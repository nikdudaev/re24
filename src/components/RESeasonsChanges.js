import * as d3 from 'npm:d3';
import * as Plot from 'npm:@observablehq/plot';
import * as aq from 'npm:arquero';

export function RESeasonsChanges(reWithSummary, selectBaseOutState, selectNumOuts) {
    return Plot.plot({
        title: `Change of RE over Seasons and Eras: ${selectBaseOutState} \nwith ${selectNumOuts}`,
        width: 1240,
        marginTop: 25,
        marginRight: 5,
        marginBottom: 35,
        marginLeft: 40,
        grid: true,
        color: {
          legend: true,
          domain: [
            "Integration Era",
            "Expansion Era",
            "Free Agency Era",
            "Steroid Era",
            "Modern Era"
          ],
          range: ["#845EC2", "#4B4453", "#B0A8B9", "#C34A36", "#FF8066"]
        },
        y: {
          domain: [
            d3.min(
              reWithSummary
                .filter(aq.escape((d) => d.Bases === selectBaseOutState))
                .select(selectNumOuts)
                .orderby(selectNumOuts)
            )[selectNumOuts],
            d3.max(
              reWithSummary
                .filter(aq.escape((d) => d.Bases === selectBaseOutState))
                .select(selectNumOuts)
                .orderby(aq.desc(selectNumOuts))
            )[selectNumOuts]
          ]
        },
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(
            reWithSummary
              .select("Season", "Bases", selectNumOuts, "Era")
              .filter(aq.escape((d) => d.Bases === selectBaseOutState)),
            {
              x: "Season",
              y: selectNumOuts,
              stroke: "Era",
              channels: { x: "Season", y: "RE" },
              tip: true,
              curve: "monotone-x",
              marker: "circle"
            }
          ),
          Plot.lineY(
            reWithSummary
              .select(
                "Season",
                "Bases",
                selectNumOuts,
                "avgByEra " + selectNumOuts,
                "minusStd " + selectNumOuts,
                "plusStd " + selectNumOuts,
                "Era"
              )
              .filter(aq.escape((d) => d.Bases === selectBaseOutState)),
            {
              x: "Season",
              y: "avgByEra " + selectNumOuts,
              z: "Era",
              stroke: "Era",
              strokeWidth: 1,
              tip: true
            }
          ),
          Plot.rectY(
            reWithSummary
              .select(
                "Season",
                "Bases",
                selectNumOuts,
                "avgByEra " + selectNumOuts,
                "minusStd " + selectNumOuts,
                "plusStd " + selectNumOuts,
                "Era",
                "firstSeason",
                "lastSeason"
              )
              .filter(aq.escape((d) => d.Bases === selectBaseOutState)),
            {
              x1: "firstSeason",
              y1: "minusStd " + selectNumOuts,
              x2: "lastSeason",
              y2: "plusStd " + selectNumOuts,
              z: "Era",
              curve: "linear",
              fill: "Era",
              fillOpacity: 0.02
            }
          ),
          Plot.crosshair(
            reWithSummary
              .select("Season", "Bases", selectNumOuts, "Era")
              .filter(aq.escape((d) => d.Bases === selectBaseOutState)),
            {
              x: "Season",
              y: selectNumOuts,
              stroke: "Era",
              channels: { x: "Season", y: "RE" },
              tip: true,
              curve: "monotone-x",
              marker: "circle"
            }
          )
        ]
      });
}