create table re_batting.source_2023 as
with basis_logs as (
  select game_id,
         away_team_id,
         inn_ct,
         bat_home_id,
         outs_ct,
         away_score_ct,
         home_score_ct,
         base1_run_id,
         base2_run_id,
         base3_run_id,
         event_outs_ct,
         bat_dest_id,
         run1_dest_id,
         run2_dest_id,
         run3_dest_id,
         bat_team_id,
         inn_runs_ct,
         start_bases_cd,
         end_bases_cd,
         event_runs_ct,
         event_id,
         event_cd,
         event_tx,
         battedball_cd,
         battedball_loc_tx,
         to_date(substring(game_id from 4 for 8), 'YYYYMMDD') as game_date,
         cast(extract(year from to_date(substring(game_id from 4 for 8), 'YYYYMMDD')) as text) as season
  from retrosheet.events 
  
)
select *
from basis_logs
where season = '2023'
order by game_id, inn_ct, cast(bat_home_id as int), outs_ct, cast(event_id as int);

alter table re_batting.source_2023
add column runs_before int,
add column half_inning text,
add column runs_scored int;

update re_batting.source_2023
set runs_before = away_score_ct + home_score_ct,
    half_inning = game_id || ' ' || cast(inn_ct as int) || ' ' || bat_home_id,
    runs_scored = (
        (cast(bat_dest_id as int) > 3)::int +
        (cast(run1_dest_id as int) > 3)::int +
        (cast(run2_dest_id as int) > 3)::int +
        (cast(run3_dest_id as int) > 3)::int
    );

create table re_batting.half_innings_2023_first as
select half_inning,
       sum(event_outs_ct) as outs_inning,
       sum(runs_scored) as runs_inning
from re_batting.source_2023
group by half_inning;

create table re_batting.half_innings_2023_second as
select distinct half_inning,
       first_value(runs_before) over (partition by half_inning order by half_inning, inn_ct, bat_home_id, outs_ct, cast(event_id as int)) as runs_start
from re_batting.source_2023
group by half_inning, runs_before, inn_ct, bat_home_id, outs_ct, event_id
order by half_inning;

create table re_batting.half_innings_2023 as
select f.*,
       s.runs_start,
       f.runs_inning + s.runs_start as max_runs
from re_batting.half_innings_2023_first f
inner join re_batting.half_innings_2023_second s
on f.half_inning = s.half_inning;

drop table re_batting.half_innings_2023_first;
drop table re_batting.half_innings_2023_second;

create table re_batting.pre_2023 as
select ts.*,
       hi.outs_inning,
       hi.runs_inning,
       hi.runs_start,
       hi.max_runs,
       hi.max_runs - ts.runs_before as runs_roi
from re_batting.source_2023 ts
inner join re_batting.half_innings_2023 hi
on ts.half_inning = hi.half_inning;

drop table re_batting.half_innings_2023 cascade;

alter table re_batting.pre_2023
add column bases text,
add column state text,
add column is_runner1 numeric,
add column is_runner2 numeric,
add column is_runner3 numeric,
add column new_outs int,
add column new_bases text,
add column new_state text;

update re_batting.pre_2023
set bases = (
    (case when base1_run_id is null then '0' else '1' end) ||
    (case when base2_run_id is null then '0' else '1' end) ||
    (case when base3_run_id is null then '0' else '1' end)
),
    is_runner1 = (run1_dest_id = '1' or bat_dest_id = '1')::int,
    is_runner2 = (run1_dest_id = '2' or run2_dest_id = '2' or bat_dest_id = '2')::int,
    is_runner3 = (run1_dest_id = '3' or run2_dest_id = '3' or run3_dest_id = '3' or bat_dest_id = '3')::int,
    new_outs = outs_ct + event_outs_ct;

update re_batting.pre_2023
set state = bases || ' ' || cast(cast(outs_ct as int) as text),
    new_bases = cast(is_runner1 as text) || cast(is_runner2 as text) || cast(is_runner3 as text);

update re_batting.pre_2023
set new_state = new_bases || ' ' || cast(new_outs as text);
