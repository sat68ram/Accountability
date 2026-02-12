import React from "react";

/** Panel 10: PMO_doubts says "To do" – placeholder keeping same layout */
export default function GateReadinessSummary() {
  return (
    <div className="vision-row">
      <section className="panel-light">
        <div className="panel-header">Gate / Readiness Summary</div>
        <div className="panel-sub">
          Program readiness by gate plus design maturity & qualification yields.
        </div>

        <div className="chart-gates">
          {[
            ["Concept", 96],
            ["Prototype", 78],
            ["Pilot", 61],
            ["Release", 42],
          ].map(([name, pct]) => (
            <div className="gate-row" key={name}>
              <div>{name}</div>
              <div className="gate-bar">
                <div className="gate-bar-fill" style={{ width: `${pct}%` }}></div>
              </div>
              <div>{pct}%</div>
            </div>
          ))}
        </div>

        <div className="maturity-grid">
          <div className="maturity-card">
            <div className="maturity-title">Design Maturity</div>
            <div className="maturity-metric">Specs frozen: --</div>
            <div className="maturity-metric">Design reviews closed: --</div>
          </div>
          <div className="maturity-card">
            <div className="maturity-title">Qualification Yields</div>
            <div className="maturity-metric">Tool qual yield: --</div>
            <div className="maturity-metric">Fab acceptance: --</div>
          </div>
        </div>
        <div className="panel-sub" style={{ marginTop: "8px", color: "#666" }}>
          Data source to be added (Panel 10 – To do).
        </div>
      </section>
    </div>
  );
}
