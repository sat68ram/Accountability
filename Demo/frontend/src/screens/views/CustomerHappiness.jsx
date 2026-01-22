
import React from "react";
export default function CustomerHappiness() {
  return (
    <div className="vision-layout">

      {/* ======================== A. Customer Happiness Overview ======================== */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Customer Happiness Overview</div>
          <div className="panel-sub">
            Executive view of CSAT, NPS, and delivery/service correlation.
          </div>

          {/* === CSAT BAR CHART === */}
          <div className="chart-bars">
            {[
              ["TSMC", 94, 4.7],
              ["Samsung", 90, 4.5],
              ["Intel", 84, 4.2],
              ["SK Hynix", 82, 4.1],
              ["Micron", 80, 4.0],
            ].map(([label, pct, score]) => (
              <div className="bar-row" key={label}>
                <div className="bar-label">{label}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }}></div>
                </div>
                <div>{score}</div>
              </div>
            ))}
          </div>

          {/* === NPS TREND (Q1 ? Q4) === */}
          <div className="chart-nps">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* grid */}
              <g className="nps-grid">
                {[10, 20, 30, 40].map((y) => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} />
                ))}
              </g>

              {/* axes */}
              <line className="nps-axis" x1="5" y1="45" x2="95" y2="45" />
              <line className="nps-axis" x1="5" y1="5" x2="5" y2="45" />

              {/* line */}
              <polyline
                className="nps-line"
                points="5,35 30,30 55,24 80,20 95,18"
              />
            </svg>
          </div>

          {/* === VOC CLOUD === */}
          <div className="voc-cloud">
            <span className="voc-tag voc-pos">Proactive field engineers</span>
            <span className="voc-tag voc-neg">Spare parts lead time</span>
            <span className="voc-tag voc-pos">Ramp support quality</span>
            <span className="voc-tag voc-neutral">Dashboard usability</span>
            <span className="voc-tag voc-neg">Escalation responsiveness</span>
            <span className="voc-tag voc-pos">Technical depth</span>
          </div>

          {/* === OTD vs CSAT (Scatter Plot) === */}
          <div className="chart-scatter-small">
            <div className="scatter-axis"></div>

            {[
              ["85%", "80%", "TSMC: 98% OTD / 4.8 CSAT"],
              ["78%", "74%", "Samsung: 95% OTD / 4.6 CSAT"],
              ["65%", "64%", "Intel: 91% OTD / 4.3 CSAT"],
              ["52%", "55%", "SK Hynix: 86% OTD / 4.1 CSAT"],
              ["40%", "48%", "Micron: 80% OTD / 3.9 CSAT"],
            ].map(([left, bottom, label], i) => (
              <div
                key={i}
                className="scatter-dot"
                style={{ left, bottom }}
                data-label={label}
              ></div>
            ))}

            <div className="scatter-label-x">On-Time Delivery %</div>
            <div className="scatter-label-y">CSAT</div>
          </div>
        </section>
      </div>

      {/* ======================== B. Account-Level View ======================== */}
      <div className="vision-row vision-row-2">

        {/* === Delivery & Service === */}
        <section className="panel-light">
          <div className="panel-header">Account-Level Delivery & Service</div>
          <div className="panel-sub">
            NPI project satisfaction and field service performance.
          </div>

          <div className="account-grid">

            {/* NPI Satisfaction */}
            <div className="account-card">
              <div style={{ fontWeight: 600 }}>NPI Project Satisfaction</div>
              <div>Delivery quality: 4.4 / 5</div>
              <div>Acceptance experience: 4.5 / 5</div>
              <div className="gate-bar" style={{ marginTop: "6px" }}>
                <div className="gate-bar-fill" style={{ width: "88%" }}></div>
              </div>
            </div>

            {/* Field Service */}
            <div className="account-card">
              <div style={{ fontWeight: 600 }}>Field Service Performance</div>
              <div>MTBF: 920 hrs</div>
              <div>MTTR: 3.1 hrs</div>
              <div>SLA compliance: 96%</div>
              <div className="gate-bar" style={{ marginTop: "6px" }}>
                <div className="gate-bar-fill" style={{ width: "96%" }}></div>
              </div>
            </div>

            {/* Ticket Volume */}
            <div className="account-card">
              <div style={{ fontWeight: 600 }}>Support Ticket Volume (Last 6 Months)</div>
              <div className="chart-tickets">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                  <g className="tickets-bars">
                    {[
                      [8, 30, 15],
                      [24, 26, 19],
                      [40, 22, 23],
                      [56, 18, 27],
                      [72, 20, 25],
                      [88, 24, 21],
                    ].map(([x, y, h], i) => (
                      <rect key={i} x={x} y={y} width="8" height={h} />
                    ))}
                  </g>
                </svg>
              </div>
            </div>

            {/* Rolling NPS/CSAT vs Renewal */}
            <div className="account-card">
              <div style={{ fontWeight: 600 }}>
                Rolling 12-Month NPS & CSAT vs Renewal
              </div>
              <div className="chart-renew">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                  {/* grid */}
                  <g className="renew-grid">
                    {[10, 20, 30, 40].map((y) => (
                      <line key={y} x1="0" y1={y} x2="100" y2={y} />
                    ))}
                  </g>

                  {/* axes */}
                  <line className="renew-axis" x1="5" y1="45" x2="95" y2="45" />
                  <line className="renew-axis" x1="5" y1="5" x2="5" y2="45" />

                  {/* NPS */}
                  <polyline
                    className="renew-nps"
                    points="5,35 20,32 35,30 50,28 65,26 80,24 95,22"
                  />

                  {/* CSAT */}
                  <polyline
                    className="renew-csat"
                    points="5,32 20,30 35,28 50,26 65,25 80,24 95,23"
                  />

                  {/* Renewal */}
                  <polyline
                    className="renew-rate"
                    points="5,28 20,26 35,24 50,22 65,20 80,18 95,17"
                  />
                </svg>
              </div>

              <div style={{ marginTop: "4px", fontSize: "0.75rem", color: "#6b7280" }}>
                Higher NPS/CSAT align with ~95–97% renewal in top accounts.
              </div>
            </div>
          </div>
        </section>

        {/* ======================== C. Health Scores & Alerts ======================== */}
        <section className="panel-light">
          <div className="panel-header">Customer Health Scores & Alerts</div>
          <div className="panel-sub">
            Composite health based on CSAT, NPS, OTD, SLA, and issue rates.
          </div>

          <div className="health-grid">
            <table className="health-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>CSAT</th>
                  <th>NPS</th>
                  <th>OTD %</th>
                  <th>SLA %</th>
                  <th>Issues / mo</th>
                  <th>Health</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["TSMC", 4.7, 68, "98%", "97%", 3, "good", 0.91],
                  ["Samsung", 4.5, 62, "95%", "96%", 5, "good", 0.87],
                  ["Intel", 4.2, 54, "91%", "93%", 8, "watch", 0.79],
                  ["SK Hynix", 4.0, 48, "86%", "90%", 11, "watch", 0.73],
                  ["Micron", 3.8, 40, "80%", "88%", 16, "risk", 0.65],
                ].map(([cust, csat, nps, otd, sla, issues, status, score]) => (
                  <tr key={cust}>
                    <td>{cust}</td>
                    <td>{csat}</td>
                    <td>{nps}</td>
                    <td>{otd}</td>
                    <td>{sla}</td>
                    <td>{issues}</td>
                    <td>
                      <span className={`health-badge health-${status}`}>
                        {score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "6px", fontSize: "0.75rem", color: "#6b7280" }}>
              Health &lt; 0.7 flagged for proactive intervention.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
