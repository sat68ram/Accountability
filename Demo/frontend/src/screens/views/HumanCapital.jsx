import React from "react";
export default function HumanCapital() {
  return (
    <div className="vision-layout">

      {/* ===================== A. Portfolio Human Capital Overview ===================== */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Portfolio Human Capital Overview</div>
          <div className="panel-sub">
            Headcount, utilization, attrition, and critical skill capacity across the portfolio.
          </div>

          {/* Headcount KPIs */}
          <div className="hc-kpi-grid">
            <div className="metric-card metric-good">
              <div className="metric-label">Total Headcount</div>
              <div className="metric-value">4,820</div>
              <div className="metric-hint">All functions · global</div>
            </div>
            <div className="metric-card metric-warn">
              <div className="metric-label">Engineering</div>
              <div className="metric-value">2,140</div>
              <div className="metric-hint">Process, Controls, Plasma, Robotics…</div>
            </div>
            <div className="metric-card metric-warn">
              <div className="metric-label">Field & Services</div>
              <div className="metric-value">1,220</div>
              <div className="metric-hint">FSE, CS, Support</div>
            </div>
          </div>

          {/* Headcount by function & region */}
          <div className="hc-two-col" style={{ marginTop: "14px" }}>
            <div>
              <div style={{ fontSize: ".85rem", fontWeight: 600, color: "#4b5563" }}>
                Headcount by Function
              </div>

              <table className="hc-table">
                <thead>
                  <tr>
                    <th>Function</th>
                    <th>HC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>R&D / Engineering</td><td>2,140</td></tr>
                  <tr><td>Field Services</td><td>880</td></tr>
                  <tr><td>Customer Success</td><td>340</td></tr>
                  <tr><td>Manufacturing & Ops</td><td>960</td></tr>
                  <tr><td>IT / G&A</td><td>500</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <div style={{ fontSize: ".85rem", fontWeight: 600, color: "#4b5563" }}>
                Headcount by Region
              </div>

              <table className="hc-table">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>HC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>North America</td><td>1,520</td></tr>
                  <tr><td>Europe</td><td>820</td></tr>
                  <tr><td>Taiwan</td><td>760</td></tr>
                  <tr><td>Rest of Asia</td><td>1,320</td></tr>
                  <tr><td>Other</td><td>400</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Utilization Heatmap */}
          <div style={{
            marginTop: "14px",
            fontSize: ".85rem",
            fontWeight: 600,
            color: "#4b5563"
          }}>
            Utilization % Heatmap (Functions × Quarter)
          </div>

          <div className="chart-heatmap-util">
            <div className="util-row">
              <div className="util-label"></div>
              <div className="util-cell util-low">Q1</div>
              <div className="util-cell util-low">Q2</div>
              <div className="util-cell util-low">Q3</div>
              <div className="util-cell util-low">Q4</div>
            </div>

            <div className="util-row">
              <div className="util-label">Process Eng</div>
              <div className="util-cell util-med">78%</div>
              <div className="util-cell util-high">86%</div>
              <div className="util-cell util-high">89%</div>
              <div className="util-cell util-high">91%</div>
            </div>

            <div className="util-row">
              <div className="util-label">Controls Eng</div>
              <div className="util-cell util-high">88%</div>
              <div className="util-cell util-crit">96%</div>
              <div className="util-cell util-crit">98%</div>
              <div className="util-cell util-high">92%</div>
            </div>

            <div className="util-row">
              <div className="util-label">Field Service</div>
              <div className="util-cell util-med">72%</div>
              <div className="util-cell util-high">83%</div>
              <div className="util-cell util-high">87%</div>
              <div className="util-cell util-med">75%</div>
            </div>

            <div className="util-row">
              <div className="util-label">IT / Data</div>
              <div className="util-cell util-med">68%</div>
              <div className="util-cell util-med">70%</div>
              <div className="util-cell util-high">81%</div>
              <div className="util-cell util-med">74%</div>
            </div>
          </div>

          {/* Attrition + Training + Critical Skills */}
          <div className="hc-training-grid">

            {/* Attrition */}
            <div>
              <div style={{
                fontSize: ".85rem",
                fontWeight: 600,
                color: "#4b5563",
                marginTop: "10px"
              }}>
                Attrition Trend (Rolling 12 Months)
              </div>

              <div className="chart-attrition">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                  <g className="attrition-grid">
                    {[10, 20, 30, 40].map(y => (
                      <line key={y} x1="0" y1={y} x2="100" y2={y} />
                    ))}
                  </g>
                  <line className="attrition-axis" x1="5" y1="45" x2="95" y2="45" />
                  <line className="attrition-axis" x1="5" y1="5" x2="5" y2="45" />

                  <polyline
                    className="attrition-line"
                    points="5,18 14,20 23,23 32,25 41,28 50,30 59,32 68,33 77,34 86,35 95,36"
                  />
                </svg>
              </div>

              <div className="metric-card metric-good" style={{ marginTop: "10px" }}>
                <div className="metric-label">Training Investment / Employee</div>
                <div className="metric-value">$4.2K</div>
                <div className="metric-hint">last 12 months · global avg</div>
              </div>
            </div>

            {/* Critical Skills */}
            <div>
              <div style={{
                fontSize: ".85rem",
                fontWeight: 600,
                color: "#4b5563",
                marginTop: "10px"
              }}>
                Critical Skill Capacity vs Demand
              </div>

              <div className="hc-skill-list">
                {[
                  ["Vacuum Process Engineers", "25 / 19", "-6 gap"],
                  ["Controls Engineers", "32 / 26", "-6 gap"],
                  ["Robotics Engineers", "18 / 15", "-3 gap"],
                  ["Field Upgrade Leads", "22 / 21", "-1 gap"],
                ].map(([role, ratio, gap]) => (
                  <div className="hc-skill-row" key={role}>
                    <span>{role}</span>
                    <span>{ratio}</span>
                    <span className="hc-skill-badge">{gap}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ===================== B. Project Workforce View ===================== */}
      <div className="vision-row vision-row-2">
        <section className="panel-light">
          <div className="panel-header">Project Workforce View</div>
          <div className="panel-sub">
            Allocation by project and key skill coverage vs requirements.
          </div>

          <div
            style={{ fontSize: ".85rem", fontWeight: 600, color: "#4b5563", marginTop: "8px" }}
          >
            Resource Allocation (Hours / Month)
          </div>

          <div style={{ maxHeight: "160px", overflow: "auto" }}>
            <table className="hc-allocation-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Eng hrs</th>
                  <th>Field hrs</th>
                  <th>CS hrs</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["3 nm PVD", 1240, 320, 110],
                  ["5 nm Etch", 980, 280, 90],
                  ["Display Gen 8", 760, 240, 80],
                  ["Global MES Upgrade", 620, 90, 140],
                ].map(([proj, e, f, c]) => (
                  <tr key={proj}>
                    <td>{proj}</td>
                    <td>{e}</td>
                    <td>{f}</td>
                    <td>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Skill Coverage Matrix */}
          <div className="hc-matrix">
            <div className="hc-matrix-grid">

              <div></div>
              <div className="hc-matrix-header">3 nm PVD</div>
              <div className="hc-matrix-header">5 nm Etch</div>
              <div className="hc-matrix-header">Display Gen 8</div>

              <div className="hc-matrix-header">Vacuum Process</div>
              <div className="hc-matrix-cell hc-matrix-gap">80% of need</div>
              <div className="hc-matrix-cell hc-matrix-ok">94%</div>
              <div className="hc-matrix-cell hc-matrix-ok">92%</div>

              <div className="hc-matrix-header">Controls</div>
              <div className="hc-matrix-cell hc-matrix-gap">76%</div>
              <div className="hc-matrix-cell hc-matrix-gap">71%</div>
              <div className="hc-matrix-cell hc-matrix-ok">89%</div>

              <div className="hc-matrix-header">Robotics</div>
              <div className="hc-matrix-cell hc-matrix-ok">91%</div>
              <div className="hc-matrix-cell hc-matrix-gap">78%</div>
              <div className="hc-matrix-cell hc-matrix-gap">82%</div>

            </div>
          </div>
        </section>

        {/* Utilization & CPI */}
        <section className="panel-light">
          <div className="panel-header">Utilization & CPI Correlation</div>
          <div className="panel-sub">
            See whether high utilization correlates with CPI shifts and overbooking.
          </div>

          {/* CPI vs Util */}
          <div className="chart-cpi-util">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">
              <g className="cpi-util-grid">
                {[10, 20, 30, 40].map(y => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} />
                ))}
              </g>

              <line className="cpi-util-axis" x1="5" y1="45" x2="95" y2="45" />
              <line className="cpi-util-axis" x1="5" y1="5" x2="5" y2="45" />

              <polyline
                className="cpi-util-line-util"
                points="5,35 25,30 45,26 65,24 85,22"
              />
              <polyline
                className="cpi-util-line-cpi"
                points="5,25 25,26 45,27 65,29 85,31"
              />
            </svg>
          </div>

          {/* Overbooked List */}
          <div
            style={{ fontSize: ".85rem", fontWeight: 600, color: "#4b5563", marginTop: "8px" }}
          >
            Overbooked Individuals (Next 60 Days)
          </div>

          <div className="hc-overbooked-list">
            {[
              ["Jane K. – Controls Eng", "128%", "Rebalance"],
              ["Ravi P. – Vacuum Process", "121%", "Rebalance"],
              ["Maria S. – Field Lead", "117%", "Rebalance"],
              ["Liang W. – Robotics Eng", "113%", "Rebalance"],
            ].map(([name, pct, tag]) => (
              <div className="hc-overbooked-row" key={name}>
                <span>{name}</span>
                <span>{pct}</span>
                <span className="hc-overbooked-chip">{tag}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ===================== C. Talent Development ===================== */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Talent Development View</div>
          <div className="panel-sub">
            Certification coverage, training investment, and high-potential pipeline.
          </div>

          <div className="hc-talent-grid">

            {/* Certifications */}
            <div>
              <div className="chart-cert">
                <div style={{ fontWeight: 600 }}>Certification Coverage</div>
                <div style={{
                  fontSize: ".8rem",
                  color: "#6b7280",
                  marginTop: "2px"
                }}>
                  % staff certified on new platform stack.
                </div>

                <div className="cert-bar">
                  <div className="cert-bar-fill" style={{ width: "74%" }}></div>
                </div>

                <div style={{
                  marginTop: "4px",
                  fontSize: ".8rem",
                  color: "#4b5563"
                }}>
                  Eng: 81% · Field: 68% · CS: 72%
                </div>
              </div>

              {/* Training bar chart */}
              <div className="chart-training">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                  <g className="training-bars">
                    <rect x="10" y="22" width="10" height="23" />
                    <rect x="32" y="26" width="10" height="19" />
                    <rect x="54" y="30" width="10" height="15" />
                    <rect x="76" y="34" width="10" height="11" />
                  </g>
                </svg>
              </div>

              <div style={{
                marginTop: "4px",
                fontSize: ".75rem",
                color: "#6b7280"
              }}>
                Avg Training Hours per FTE (last 12M): Eng 48 · Field 38 · CS 30 · Ops 22
              </div>
            </div>

            {/* High Potential Pipeline */}
            <div className="hc-pipeline">
              <div style={{ fontWeight: 600 }}>High-Potential Talent Pipeline</div>

              {[
                ["Identified", "90%", 220],
                ["In Development", "70%", 154],
                ["Ready in 12M", "45%", 98],
                ["Succession-critical roles", "36%", 72],
              ].map(([label, width, count]) => (
                <div className="pipeline-row" key={label}>
                  <span>{label}</span>
                  <div className="pipeline-bar">
                    <div
                      className="pipeline-bar-fill"
                      style={{ width }}
                    ></div>
                  </div>
                  <span>{count}</span>
                </div>
              ))}

            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
