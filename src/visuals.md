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
```

```js
const re = aq.fromCSV(await FileAttachment("re_1912_2023.csv").text());
const baseOutStates = new Array(...new Set(re.select("Bases")._data.Bases.data));
const numOuts = ["0 Outs", "1 Out", "2 Outs"];
```

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

