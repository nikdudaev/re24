import * as d3 from 'npm:d3';
import * as Plot from 'npm:@observablehq/plot';

export function REBaselineChangesZeroOuts(reChangeFromBaseline, selectBaselineYear, rangeK) {
    return Plot.plot({
        title: `0 Outs. RE Change relative to ${selectBaselineYear}`,
        width: 1200,
        color: {
          legend: true
        },
        marks: [
          Plot.ruleY([1]),
          Plot.lineY(
            reChangeFromBaseline,
            Plot.windowY(
              { k: rangeK, anchor: "end" },
              {
                x: "Season",
                y: "0 Outs Change",
                z: "Bases",
                stroke: "Bases",
                curve: "catmull-rom",
                strokeWidth: 1.3,
                tip: true
              }
            )
          )
        ]
      });
}

export function REBaselineChangesOneOut(reChangeFromBaseline, selectBaselineYear, rangeK) {
    return Plot.plot({
        title: `1 Out. RE Change relative to ${selectBaselineYear}`,
        width: 1200,
        color: {
          legend: true
        },
        marks: [
          Plot.ruleY([1]),
          Plot.lineY(
            reChangeFromBaseline,
            Plot.windowY(
              { k: rangeK, anchor: "end" },
              {
                x: "Season",
                y: "1 Out Change",
                z: "Bases",
                stroke: "Bases",
                curve: "catmull-rom",
                strokeWidth: 1.3,
                tip: true
              }
            )
          )
        ]
      });
}

export function REBaselineChangesTwoOuts(reChangeFromBaseline, selectBaselineYear, rangeK) {
    return Plot.plot({
        title: `2 Outs. RE Change relative to ${selectBaselineYear}`,
        width: 1200,
        color: {
          legend: true
        },
        marks: [
          Plot.ruleY([1]),
          Plot.lineY(
            reChangeFromBaseline,
            Plot.windowY(
              { k: rangeK, anchor: "end" },
              {
                x: "Season",
                y: "2 Outs Change",
                z: "Bases",
                stroke: "Bases",
                curve: "catmull-rom",
                strokeWidth: 1.3,
                tip: true
              }
            )
          )
        ]
      });
}