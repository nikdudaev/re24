---
title: Visuals
toc: false
theme: "air"
---

## Visuals
---

<!-- Load and transform the data -->

```js
import * as aq from 'npm:arquero';
import op from 'npm:arquero';
import {RESeasonsChanges} from './components/RESeasonsChanges.js';
import {REBaselineChangesZeroOuts} from './components/REBaselineChanges.js';
import {REBaselineChangesOneOut} from './components/REBaselineChanges.js';
import {REBaselineChangesTwoOuts} from './components/REBaselineChanges.js';
```

```js
const re = aq.fromCSV(await FileAttachment("re_1912_2023.csv").text());
const baseOutStates = new Array(...new Set(re.select("Bases")._data.Bases.data));
const numOuts = ["0 Outs", "1 Out", "2 Outs"];
```

### RE Changes over years by Eras

```js
const selectBaseOutState = view(Inputs.select(baseOutStates, {
  label: "Select Base/Out State"
}));
const selectNumOuts = view(Inputs.select(numOuts, {
  label: "Select number of outs"
}));
```

```js
const erasSummary = re
  .filter(aq.escape((d) => d.Bases === selectBaseOutState))
  .groupby("Era", "Bases")
  .rollup({
    "avgByEra 0 Outs": (d) => op.mean(d["0 Outs"]),
    "stdByEra 0 Outs": (d) => op.stdev(d["0 Outs"]),
    "avgByEra 1 Out": (d) => op.mean(d["1 Out"]),
    "stdByEra 1 Out": (d) => op.stdev(d["1 Out"]),
    "avgByEra 2 Outs": (d) => op.mean(d["2 Outs"]),
    "stdByEra 2 Outs": (d) => op.stdev(d["2 Outs"]),
    firstSeason: (d) => op.min(d.Season),
    lastSeason: (d) => op.max(d.Season)
  })
  .ungroup()
  .derive({
    "minusStd 0 Outs": (d) => d["avgByEra 0 Outs"] - d["stdByEra 0 Outs"],
    "plusStd 0 Outs": (d) => d["avgByEra 0 Outs"] + d["stdByEra 0 Outs"],
    "minusStd 1 Out": (d) => d["avgByEra 1 Out"] - d["stdByEra 1 Out"],
    "plusStd 1 Out": (d) => d["avgByEra 1 Out"] + d["stdByEra 1 Out"],
    "minusStd 2 Outs": (d) => d["avgByEra 2 Outs"] - d["stdByEra 2 Outs"],
    "plusStd 2 Outs": (d) => d["avgByEra 2 Outs"] + d["stdByEra 2 Outs"]
  });
const reWithSummary = re.join_left(erasSummary)
```
---

<div class="grid grid-cols-1" style="grid-auto-rows: 600px;">
  <div class="card">
  ${RESeasonsChanges(reWithSummary, selectBaseOutState, selectNumOuts)}
  </div>
</div>

---

### RE Changes Relative to Baseline Season

```js
const selectBaselineYear = view(Inputs.select(
  [1912, 1920, 1942, 1961, 1968, 1977, 1981, 1994, 2006, 2014],
  { label: "Select Baseline Year" }
));
const rangeK = view(Inputs.range([1, 15], { label: "Window Size (k)", step: 1 }));
```
```js
const reChangeFromBaseline = re
  .filter(aq.escape((d) => d.Season === selectBaselineYear))
  .groupby("Bases")
  .rollup({
    "0 Outs Baseline": (d) => op.sum(d["0 Outs"]),
    "1 Out Baseline": (d) => op.sum(d["1 Out"]),
    "2 Outs Baseline": (d) => op.sum(d["2 Outs"])
  })
  .ungroup()
  .join_right(re)
  .relocate(["0 Outs Baseline", "1 Out Baseline", "2 Outs Baseline"], {
    after: "Era"
  })
  .derive({
    "0 Outs Change": (d) => d["0 Outs"] / d["0 Outs Baseline"],
    "1 Out Change": (d) => d["1 Out"] / d["1 Out Baseline"],
    "2 Outs Change": (d) => d["2 Outs"] / d["2 Outs Baseline"]
  })
  .filter(aq.escape((d) => d.Season >= selectBaselineYear))
```

---

<div class="grid grid-cols-1" style="grid-auto-rows: 600px;">
  <div class="card">
  ${REBaselineChangesZeroOuts(reChangeFromBaseline, selectBaselineYear, rangeK)}
  </div>
</div>

<div class="grid grid-cols-1" style="grid-auto-rows: 600px;">
  <div class="card">
  ${REBaselineChangesOneOut(reChangeFromBaseline, selectBaselineYear, rangeK)}
  </div>
</div>

<div class="grid grid-cols-1" style="grid-auto-rows: 600px;">
  <div class="card">
  ${REBaselineChangesTwoOuts(reChangeFromBaseline, selectBaselineYear, rangeK)}
  </div>
</div>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 0.1rem 0;
  padding: 0.1rem 0;
  max-width: none;
  font-size: 11vw;
  font-weight: 400;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 16px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

