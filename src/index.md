---
toc: false
theme: "air"
---

<!-- Load and transform the data -->

```js
const re = await FileAttachment("re_1950_2023.csv").csv();
const seasons = [...new Set(re.map(d => d.Season))];
console.log(seasons);
```

## Run Expectancy Matrices for 1950-2023 MLB seasons
---
*Matrices are calculated using data from <a href="https://retrosheet.org">Retrosheet</a>, and*   
*methodology from The Book by Tom Tango, Mitchel Lichtman, and Andrew Dolphin*

---

```js
const seasonSelector = view(Inputs.select(seasons, {value: "1950", label: "Select season:"}));
```
---

<div class="grid grid-cols-1" style="grid-auto-rows: 280px;">
  <div class="card">${
    Inputs.table(re.filter(d => d.Season === seasonSelector))
  }</div>
</div>

---

<div class="grid grid-cols-1">
  <div class="card">
    If you spot any errors or think that calculations are wrong, or you have ideas how to make this page more useful, or simply want to send good vibes my way <a href= "mailto: nikolay.dudaev@proton.me"> send me an email </a>
  </div>
  <div class="card">
    The project is on <a href= "https://github.com/nikdudaev/re24"> GitHub </a>
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
  font-size: 25px;
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
