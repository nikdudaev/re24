---
title: Compare seasons
toc: false
theme: "air"
---

## Compare two seasons
---

<!-- Load and transform the data -->

```js
const re = await FileAttachment("re_1950_2023.csv").csv();
const seasons = [...new Set(re.map(d => d.Season))];
```

```js
const seasonSelector1 = view(Inputs.select(seasons, {value: "1950", label: "Select season:"}));
const seasonSelector2 = view(Inputs.select(seasons, {value: "1950", label: "Select season:"}));
```
---

<div class="grid grid-cols-2" style="grid-auto-rows: 280px;">
  <div class="card">${
    Inputs.table(re.filter(d => d.Season === seasonSelector1))
  }</div>
  <div class="card">${
    Inputs.table(re.filter(d => d.Season === seasonSelector2))
  }</div>
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

