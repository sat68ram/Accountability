import React from "react";
export default function Risks() {
  return (
    <div className="vision-layout">

      {/* ======================= A. Portfolio Risk Dashboard ======================= */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Portfolio Risk Dashboard</div>
          <div className="panel-sub">
            Severity mix, critical risk exposure, and trend across the portfolio.
          </div>

          {/* Total Open Risks (Stacked Bar) */}
          <div className="risk-stacked-bar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "#4b5563" }}>
                Total Open Risks
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                184 open � last updated 2 hours ago
              </div>
            </div>

            <div className="risk-stacked-track">
              <div className="risk-segment risk-low" style={{ width: "20%" }}></div>
              <div className="risk-segment risk-med" style={{ width: "35%" }}></div>
              <div className="risk-segment risk-high" style={{ width: "30%" }}></div>
              <div className="risk-segment risk-crit" style={{ width: "15%" }}></div>
            </div>

            <div className="risk-stacked-legend">
              <div className="risk-legend-item">
                <span className="risk-legend-swatch risk-low"></span><span>Low � 37</span>
              </div>
              <div className="risk-legend-item">
                <span className="risk-legend-swatch risk-med"></span><span>Medium � 64</span>
              </div>
              <div className="risk-legend-item">
                <span className="risk-legend-swatch risk-high"></span><span>High � 55</span>
              </div>
              <div className="risk-legend-item">
                <span className="risk-legend-swatch risk-crit"></span><span>Critical � 28</span>
              </div>
            </div>
          </div>

          {/* Top Critical Risks */}
          <div className="risk-list">
            <div className="risk-row" style={{ fontWeight: 600, color: "#6b7280" }}>
              <div>#</div>
              <div>Risk</div>
              <div>Program</div>
              <div>Owner</div>
              <div>Exposure</div>
            </div>

            {[
              ["R-101", "3 nm PVD tool delivery to lead customer slips", "3 nm PVD", "PMO", "0.92"],
              ["R-087", "Key plasma controller vendor at capacity", "5 nm Etch", "Supply Chain", "0.88"],
              ["R-132", "Export license renewal delays for critical geography", "Display Gen 8", "Legal", "0.84"],
              ["R-119", "Controls engineering bandwidth constraint", "Capacity Upgrades", "Engineering", "0.80"],
              ["R-095", "Field upgrade certification not aligned to fab downtime", "Field Upgrades", "CS", "0.78"],
            ].map(([id, desc, program, owner, exp]) => (
              <div className="risk-row" key={id}>
                <div className="risk-id">{id}</div>
                <div>{desc}</div>
                <div>{program}</div>
                <div>{owner}</div>
                <div><span className="risk-exposure">{exp}</span></div>
              </div>
            ))}
          </div>

          {/* Risk Trend */}
          <div className="chart-risk-trend">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">
              <g className="risk-grid">
                {[10,20,30,40].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} />)}
              </g>

              <line className="risk-axis" x1="5" y1="45" x2="95" y2="45" />
              <line className="risk-axis" x1="5" y1="5" x2="5" y2="45" />

              <polyline className="risk-line-open"
                points="5,15 22,18 39,22 56,27 73,32 90,35"
              />

              <polyline className="risk-line-closed"
                points="5,40 22,36 39,33 56,30 73,27 90,24"
              />
            </svg>
          </div>

          {/* Likelihood vs Impact */}
          <div className="risk-heatmap">
            <div className="risk-heat-grid">
              <div></div>
              <div className="risk-heat-header">Low Impact</div>
              <div className="risk-heat-header">Medium Impact</div>
              <div className="risk-heat-header">High Impact</div>

              <div className="risk-heat-header">Low Likelihood</div>
              <div className="risk-heat-cell risk-heat-low">6</div>
              <div className="risk-heat-cell risk-heat-low">9</div>
              <div className="risk-heat-cell risk-heat-med">4</div>

              <div className="risk-heat-header">Medium Likelihood</div>
              <div className="risk-heat-cell risk-heat-low">5</div>
              <div className="risk-heat-cell risk-heat-med">11</div>
              <div className="risk-heat-cell risk-heat-high">7</div>

              <div className="risk-heat-header">High Likelihood</div>
              <div className="risk-heat-cell risk-heat-med">3</div>
              <div className="risk-heat-cell risk-heat-high">6</div>
              <div className="risk-heat-cell risk-heat-high">7</div>
            </div>
          </div>
        </section>
      </div>

      {/* ======================= B. Project Risk Drilldown ======================= */}
      <div className="vision-row vision-row-2">

        {/* Risk Register */}
        <section className="panel-light">
          <div className="panel-header">Project Risk Register</div>
          <div className="panel-sub">
            Drilldown into risks by project, sortable by severity and exposure.
          </div>

          <div className="risk-register">
            <table className="table-small">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project</th>
                  <th className="sortable">Severity</th>
                  <th>Likelihood</th>
                  <th>Impact</th>
                  <th>Owner</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>R-101</td>
                  <td>3 nm PVD</td>
                  <td>Critical</td>
                  <td>High</td>
                  <td>High</td>
                  <td>PMO</td>
                  <td><span className="pill-status pill-behind">Open</span></td>
                </tr>
                <tr>
                  <td>R-087</td>
                  <td>5 nm Etch</td>
                  <td>Critical</td>
                  <td>High</td>
                  <td>High</td>
                  <td>Supply Chain</td>
                  <td><span className="pill-status pill-risk">Mitigating</span></td>
                </tr>
                <tr>
                  <td>R-119</td>
                  <td>Capacity Upgrades</td>
                  <td>High</td>
                  <td>Medium</td>
                  <td>High</td>
                  <td>Engineering</td>
                  <td><span className="pill-status pill-risk">Mitigating</span></td>
                </tr>
                <tr>
                  <td>R-132</td>
                  <td>Display Gen 8</td>
                  <td>High</td>
                  <td>High</td>
                  <td>Medium</td>
                  <td>Legal</td>
                  <td><span className="pill-status pill-ontrack">Tracking</span></td>
                </tr>
                <tr>
                  <td>R-095</td>
                  <td>Field Upgrades</td>
                  <td>Medium</td>
                  <td>Medium</td>
                  <td>Medium</td>
                  <td>CS</td>
                  <td><span className="pill-status pill-ontrack">Open</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Gantt Overlay + CPI/SPI */}
        <section className="panel-light">
          <div className="panel-header">Schedule & Performance Correlation</div>
          <div className="panel-sub">
            Risk windows overlaid on schedule and CPI/SPI trends.
          </div>

          {/* Gantt */}
          <div className="risk-gantt">
            {[
              ["3 nm PVD", "10%", "35%"],
              ["5 nm Etch", "25%", "40%"],
              ["Display Gen 8", "35%", "30%"],
            ].map(([label, left, width]) => (
              <div className="risk-gantt-row" key={label}>
                <div className="risk-gantt-label">{label}</div>
                <div className="risk-gantt-track">
                  <div
                    className="risk-gantt-window"
                    style={{ left, width }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* CPI / SPI */}
          <div className="chart-cpi-spi">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">
              <g className="cpi-spi-grid">
                {[10,20,30,40].map(y => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} />
                ))}
              </g>

              <line className="cpi-spi-axis" x1="5" y1="45" x2="95" y2="45" />
              <line className="cpi-spi-axis" x1="5" y1="5" x2="5" y2="45" />

              <polyline className="line-cpi"
                points="5,25 25,27 45,29 65,32 85,35"
              />

              <polyline className="line-spi"
                points="5,25 25,23 45,21 65,24 85,28"
              />
            </svg>

            <div style={{ marginTop: "4px", fontSize: "0.75rem", color: "#6b7280" }}>
              CPI &gt; 1 with SPI &lt; 1 often coincides with high risk windows.
            </div>
          </div>
        </section>
      </div>

      {/* ======================= C. Risk Owner View ======================= */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Risk Owner View</div>
          <div className="panel-sub">
            Ownership, closure rates, and on-time mitigation by team.
          </div>

          <div className="risk-owner-grid">
            {[
              ["PMO", 38, "14 / 24", "82%", "Healthy", "owner-chip-good"],
              ["Engineering", 54, "21 / 33", "74%", "Watch", "owner-chip-good"],
              ["Supply Chain", 29, "13 / 16", "61%", "Overdue", "owner-chip-risk"],
              ["Customer Success", 23, "8 / 15", "88%", "Strong", "owner-chip-good"],
            ].map(([team, owned, oc, pct, label, chip]) => (
              <div className="owner-card" key={team}>
                <div style={{ fontWeight: 600 }}>{team}</div>

                <div className="owner-metric-row">
                  <span># Owned</span><span>{owned}</span>
                </div>

                <div className="owner-metric-row">
                  <span>Open / Closed</span><span>{oc}</span>
                </div>

                <div className="owner-metric-row">
                  <span>On-time mitigated</span><span>{pct}</span>
                </div>

                <div className="owner-bar">
                  <div className="owner-bar-fill" style={{ width: pct }}></div>
                </div>

                <div style={{ marginTop: "4px" }}>
                  <span className={chip}>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
