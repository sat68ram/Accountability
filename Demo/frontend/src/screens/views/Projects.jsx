
import React from "react";
export default function Projects() {
  return (
    <div className="vision-layout">

      {/* A. Portfolio Overview */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Portfolio Overview</div>
          <div className="panel-sub">
            Timeliness and accountability view across all active projects.
          </div>

          {/* KPIs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <div className="metric-card metric-good">
              <div className="metric-label">Total Active Projects</div>
              <div className="metric-value">128</div>
              <div className="metric-hint">enterprise-wide</div>
            </div>

            <div className="metric-card metric-warn">
              <div className="metric-label">Avg Duration</div>
              <div className="metric-value">
                8.4<span> months</span>
              </div>
              <div className="metric-hint">start ? GA</div>
            </div>

            <div className="metric-card metric-risk">
              <div className="metric-label">Total Spend YTD</div>
              <div className="metric-value">$920M</div>
              <div className="metric-hint">capex + opex</div>
            </div>
          </div>

          {/* Pie + KPI tiles */}
          <div className="chart-pie-wrapper" style={{ marginTop: "16px" }}>
            <div style={{ position: "relative" }}>
              <div className="chart-pie">
                <div className="chart-pie-inner"></div>
              </div>
            </div>

            <div className="chart-pie-legend">
              <div className="chart-pie-legend-item">
                <span className="chart-pie-swatch" style={{ background: "#3b82f6" }}></span>
                <span>R&D · 30%</span>
              </div>

              <div className="chart-pie-legend-item">
                <span className="chart-pie-swatch" style={{ background: "#22c55e" }}></span>
                <span>Capacity · 25%</span>
              </div>

              <div className="chart-pie-legend-item">
                <span className="chart-pie-swatch" style={{ background: "#f97316" }}></span>
                <span>Field Upgrades · 25%</span>
              </div>

              <div className="chart-pie-legend-item">
                <span className="chart-pie-swatch" style={{ background: "#a855f7" }}></span>
                <span>IT · 20%</span>
              </div>
            </div>

            <div className="kpi-grid-3" style={{ flex: 1, minWidth: "220px" }}>
              <div className="metric-card metric-good">
                <div className="metric-label">On-Time %</div>
                <div className="metric-value">
                  76<span>%</span>
                </div>
                <div className="metric-hint">% milestones on or before plan</div>
              </div>

              <div className="metric-card metric-warn">
                <div className="metric-label">Budget Adherence %</div>
                <div className="metric-value">
                  82<span>%</span>
                </div>
                <div className="metric-hint">projects within ±10% of plan</div>
              </div>

              <div className="metric-card metric-risk">
                <div className="metric-label">Risk Exposure Index</div>
                <div className="metric-value">0.63</div>
                <div className="metric-hint">weighted impact × likelihood</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* B. Schedule Health */}
      <div className="vision-row vision-row-2">

        {/* Gantt / Milestones */}
        <section className="panel-light">
          <div className="panel-header">Schedule Health – Major Programs</div>
          <div className="panel-sub">
            High-level view of key node programs and milestone burn-down.
          </div>

          <div className="chart-gantt">
            <div className="gantt-row">
              <div className="gantt-label">3 nm PVD</div>
              <div className="gantt-track">
                <div className="gantt-bar" style={{ left: "5%", width: "60%" }}></div>
              </div>
            </div>

            <div className="gantt-row">
              <div className="gantt-label">5 nm Etch</div>
              <div className="gantt-track">
                <div className="gantt-bar at-risk" style={{ left: "10%", width: "55%" }}></div>
              </div>
            </div>

            <div className="gantt-row">
              <div className="gantt-label">High-k Metal Gate</div>
              <div className="gantt-track">
                <div className="gantt-bar late" style={{ left: "15%", width: "50%" }}></div>
              </div>
            </div>

            <div className="gantt-row">
              <div className="gantt-label">ILD CMP Upgrade</div>
              <div className="gantt-track">
                <div className="gantt-bar" style={{ left: "8%", width: "65%" }}></div>
              </div>
            </div>
          </div>

          <div className="chart-burndown">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* grid */}
              <g className="burndown-grid">
                <line x1="0" y1="10" x2="100" y2="10" />
                <line x1="0" y1="20" x2="100" y2="20" />
                <line x1="0" y1="30" x2="100" y2="30" />
                <line x1="0" y1="40" x2="100" y2="40" />
              </g>

              {/* axes */}
              <line className="burndown-axis" x1="5" y1="45" x2="95" y2="45" />
              <line className="burndown-axis" x1="5" y1="5" x2="5" y2="45" />

              {/* ideal */}
              <polyline className="burndown-ideal" points="5,10 35,20 65,32 95,45" />

              {/* actual */}
              <polyline className="burndown-actual" points="5,12 35,24 65,35 95,43" />
            </svg>
          </div>
        </section>

        {/* Slippage + critical path */}
        <section className="panel-light">
          <div className="panel-header">Slippage & Critical Path</div>
          <div className="panel-sub">
            Trend in schedule slippage plus key critical-path programs.
          </div>

          <div className="chart-burndown">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* axes */}
              <line className="burndown-axis" x1="5" y1="45" x2="95" y2="45" />
              <line className="burndown-axis" x1="5" y1="5" x2="5" y2="45" />

              {/* slippage line */}
              <polyline className="burndown-actual" points="5,25 25,18 45,28 65,22 85,35" />
            </svg>
          </div>

          <table className="table-small">
            <thead>
              <tr>
                <th>Program</th>
                <th>Critical Path</th>
                <th>Slack</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>3 nm PVD</td>
                <td>Tool qual ? beta at lead customer</td>
                <td>4 days</td>
                <td><span className="pill-status pill-ontrack">On track</span></td>
              </tr>

              <tr>
                <td>5 nm Etch</td>
                <td>Recipe tuning ? reliability run</td>
                <td>0 days</td>
                <td><span className="pill-status pill-risk">Tight</span></td>
              </tr>

              <tr>
                <td>Display Gen 8</td>
                <td>Line install ? full-fab acceptance</td>
                <td>-6 days</td>
                <td><span className="pill-status pill-behind">Late</span></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* C. Financial Health */}
      <div className="vision-row vision-row-2">

        {/* Budget vs actual */}
        <section className="panel-light">
          <div className="panel-header">Portfolio Budget vs Actual</div>
          <div className="panel-sub">Stacked bars by segment – budget vs actual spend.</div>

          <div className="chart-stacked-bars">
            {[
              ["R&D", 55, 45],
              ["Capacity", 50, 55],
              ["Field Upgrades", 45, 50],
              ["IT", 40, 38],
            ].map(([label, budget, actual]) => (
              <div className="stacked-row" key={label}>
                <div className="stacked-label">{label}</div>
                <div className="stacked-bar">
                  <div className="stacked-segment stacked-budget" style={{ width: `${budget}%` }}></div>
                  <div className="stacked-segment stacked-actual" style={{ width: `${actual}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EV/AC/PV */}
        <section className="panel-light">
          <div className="panel-header">EV / AC / PV</div>
          <div className="panel-sub">Earned value vs actual cost vs planned value.</div>

          <div className="chart-evacpv">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">

              {/* grid */}
              <g className="evacpv-grid">
                {[10, 20, 30, 40].map((y) => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} />
                ))}
              </g>

              {/* axes */}
              <line className="evacpv-axis" x1="5" y1="45" x2="95" y2="45" />
              <line className="evacpv-axis" x1="5" y1="5" x2="5" y2="45" />

              {/* curves */}
              <polyline className="line-pv" points="5,40 25,32 45,26 65,20 85,15" />
              <polyline className="line-ev" points="5,40 25,34 45,28 65,23 85,18" />
              <polyline className="line-ac" points="5,40 25,36 45,30 65,26 85,22" />
            </svg>
          </div>

          <div className="overrun-list">
            {[
              ["3 nm PVD Tooling", "+18% over"],
              ["5 nm Etch Pilot Line", "+12% over"],
              ["Display Gen 8 Retrofit", "+9% over"],
              ["Global Fab MES Upgrade", "+7% over"],
              ["Service Tools Standardization", "+5% over"],
            ].map(([label, chip]) => (
              <div className="overrun-item" key={label}>
                <span className="overrun-label">{label}</span>
                <span className="overrun-chip">{chip}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* D. Resource Utilization */}
      <div className="vision-row vision-row-2">

        {/* Utilization heatmap */}
        <section className="panel-light">
          <div className="panel-header">Engineering Utilization Heatmap</div>
          <div className="panel-sub">Utilization by group vs quarter.</div>

          <div className="chart-heatmap-util">
            <div className="util-row">
              <div className="util-label"></div>
              {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                <div className="util-cell util-low" key={q}>
                  {q}
                </div>
              ))}
            </div>

            {[
              ["Controls", ["78%", "92%", "98%", "89%"]],
              ["Plasma", ["74%", "88%", "90%", "76%"]],
              ["Robotics", ["71%", "86%", "97%", "91%"]],
              ["Process", ["69%", "73%", "84%", "78%"]],
            ].map(([team, values]) => (
              <div className="util-row" key={team}>
                <div className="util-label">{team}</div>
                {values.map((v, i) => (
                  <div
                    key={i}
                    className={`util-cell ${
                      v.replace("%", "") >= 95
                        ? "util-crit"
                        : v.replace("%", "") >= 85
                        ? "util-high"
                        : v.replace("%", "") >= 70
                        ? "util-med"
                        : "util-low"
                    }`}
                  >
                    {v}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Constrained skills */}
        <section className="panel-light">
          <div className="panel-header">Top Constrained Skills</div>
          <div className="panel-sub">
            Skills driving schedule risk in the next two quarters.
          </div>

          <div className="skill-list">
            {[
              ["Controls", 92],
              ["Robotics", 88],
              ["Plasma", 84],
              ["Process Integration", 79],
            ].map(([skill, pct]) => (
              <div className="skill-row" key={skill}>
                <div>{skill}</div>
                <div className="skill-bar">
                  <div
                    className="skill-bar-fill"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div>{pct}%</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* E. Risk & Issues */}
      <div className="vision-row vision-row-2">

        {/* Risk bubble chart */}
        <section className="panel-light">
          <div className="panel-header">Risk Bubble Chart</div>
          <div className="panel-sub">
            Impact × likelihood across major programs.
          </div>

          <div className="chart-bubble">
            <div className="bubble-axis"></div>

            {[
              ["30%", "40%", 18, "3 nm PVD – Med / Med"],
              ["60%", "70%", 26, "5 nm Etch – High / High"],
              ["75%", "35%", 20, "Display Gen 8 – High / Med"],
              ["40%", "20%", 14, "IT MES Upgrade – Low / Med"],
            ].map(([left, bottom, size, label], i) => (
              <div
                key={i}
                className="bubble-dot"
                style={{
                  left,
                  bottom,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                data-label={label}
              ></div>
            ))}

            <div className="bubble-label-x">Likelihood</div>
            <div className="bubble-label-y">Impact</div>
          </div>
        </section>

        {/* Issues + SLA trend */}
        <section className="panel-light">
          <div className="panel-header">Issues & Exceptions</div>
          <div className="panel-sub">
            SLA performance and export-compliance exceptions.
          </div>

          <div className="chart-sla">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* axes */}
              <line className="evacpv-axis" x1="5" y1="45" x2="95" y2="45" />
              <line className="evacpv-axis" x1="5" y1="5" x2="5" y2="45" />

              {/* SLA line */}
              <polyline className="sla-line" points="5,35 25,30 45,26 65,22 85,18" />
            </svg>
          </div>

          <table className="table-small">
            <thead>
              <tr>
                <th>Category</th>
                <th>Last 30 days</th>
                <th>Open</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Critical issues</td>
                <td>14</td>
                <td>3</td>
              </tr>
              <tr>
                <td>Major issues</td>
                <td>38</td>
                <td>9</td>
              </tr>
              <tr>
                <td>Export-compliance exceptions</td>
                <td>7</td>
                <td>2</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* F. Gate / Readiness Summary */}
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
              <div className="maturity-metric">Specs frozen: 88%</div>
              <div className="maturity-metric">Design reviews closed: 92%</div>
            </div>

            <div className="maturity-card">
              <div className="maturity-title">Qualification Yields</div>
              <div className="maturity-metric">Tool qual yield: 94%</div>
              <div className="maturity-metric">Fab acceptance: 91%</div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
