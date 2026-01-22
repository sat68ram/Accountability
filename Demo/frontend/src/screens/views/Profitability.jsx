import React from "react";
export default function Profitability() {
  return (
    <div className="vision-layout">

      {/* Top KPIs */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Profitability Overview</div>
          <div className="panel-sub">
            High-level margin and cost structure indicators.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <div className="metric-card metric-good">
              <div className="metric-label">Revenue</div>
              <div className="metric-value">$4.2B</div>
              <div className="metric-hint">Year to date</div>
            </div>

            <div className="metric-card metric-warn">
              <div className="metric-label">Gross Margin %</div>
              <div className="metric-value">46.7%</div>
              <div className="metric-hint">company-wide</div>
            </div>

            <div className="metric-card metric-risk">
              <div className="metric-label">Opex %</div>
              <div className="metric-value">32.4%</div>
              <div className="metric-hint">R&D + S&M + G&A</div>
            </div>

            <div className="metric-card metric-good">
              <div className="metric-label">Operating Profit %</div>
              <div className="metric-value">14.3%</div>
              <div className="metric-hint">EBIT margin</div>
            </div>
          </div>
        </section>
      </div>

      {/* Quarterly Margin Trend per Product Line */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Quarterly Margin Trend by Product Line</div>
          <div className="panel-sub">
            Margin trend across FAB, Display, and Services over recent quarters.
          </div>

          <div className="chart-card chart-line-wrapper">
            <svg className="chart-line" viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* grid */}
              <g className="chart-line-grid">
                <line x1="0" y1="10" x2="100" y2="10" />
                <line x1="0" y1="20" x2="100" y2="20" />
                <line x1="0" y1="30" x2="100" y2="30" />
                <line x1="0" y1="40" x2="100" y2="40" />
              </g>

              {/* axes */}
              <line className="chart-line-axis" x1="0" y1="45" x2="100" y2="45" />
              <line className="chart-line-axis" x1="5" y1="5" x2="5" y2="45" />

              {/* FAB Products */}
              <polyline
                className="chart-line-series-1"
                points="5,30 20,26 35,22 50,24 65,20 80,18 95,16"
              />
              {/* Display */}
              <polyline
                className="chart-line-series-2"
                points="5,34 20,33 35,30 50,29 65,27 80,26 95,25"
              />
              {/* Services */}
              <polyline
                className="chart-line-series-3"
                points="5,38 20,36 35,35 50,34 65,32 80,31 95,30"
              />
            </svg>

            <div className="chart-legend">
              <div className="chart-legend-item">
                <span
                  className="chart-legend-swatch"
                  style={{ background: "#3b82f6" }}
                ></span>
                <span>FAB Products</span>
              </div>

              <div className="chart-legend-item">
                <span
                  className="chart-legend-swatch"
                  style={{ background: "#22c55e" }}
                ></span>
                <span>Display</span>
              </div>

              <div className="chart-legend-item">
                <span
                  className="chart-legend-swatch"
                  style={{ background: "#f97316" }}
                ></span>
                <span>Services</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Gross Profit Waterfall */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Gross Profit Waterfall</div>
          <div className="panel-sub">
            Flow from Bookings ? Shipments ? Revenue ? Gross Profit.
          </div>

          <div className="chart-waterfall">
            <div className="wf-column">
              <div className="wf-bar neutral" style={{ height: "80%" }}></div>
              <div className="wf-value">$5.0B</div>
              <div>Bookings</div>
            </div>

            <div className="wf-column">
              <div className="wf-bar negative" style={{ height: "65%" }}></div>
              <div className="wf-value">- $0.6B</div>
              <div>Adjustments</div>
            </div>

            <div className="wf-column">
              <div className="wf-bar positive" style={{ height: "70%" }}></div>
              <div className="wf-value">$4.4B</div>
              <div>Shipments</div>
            </div>

            <div className="wf-column">
              <div className="wf-bar positive" style={{ height: "55%" }}></div>
              <div className="wf-value">$2.0B</div>
              <div>Gross Profit</div>
            </div>
          </div>
        </section>
      </div>

      {/* Regional Profitability Heatmap + Customer Margin Scatter */}
      <div className="vision-row vision-row-2">

        {/* Heatmap */}
        <section className="panel-light">
          <div className="panel-header">Regional Profitability Heatmap</div>
          <div className="panel-sub">Gross margin % by region.</div>

          <div className="chart-heatmap">
            <div className="heatmap-row">
              <div className="heatmap-cell hm-high">
                <div className="heatmap-label">North America</div>
                <div className="heatmap-value">48.2%</div>
              </div>

              <div className="heatmap-cell hm-mid">
                <div className="heatmap-label">Europe</div>
                <div className="heatmap-value">44.1%</div>
              </div>
            </div>

            <div className="heatmap-row">
              <div className="heatmap-cell hm-mid">
                <div className="heatmap-label">China</div>
                <div className="heatmap-value">42.5%</div>
              </div>

              <div className="heatmap-cell hm-low">
                <div className="heatmap-label">Rest of Asia</div>
                <div className="heatmap-value">39.8%</div>
              </div>
            </div>

            <div className="heatmap-row">
              <div className="heatmap-cell hm-low">
                <div className="heatmap-label">Rest of World</div>
                <div className="heatmap-value">37.3%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Scatter Plot */}
        <section className="panel-light">
          <div className="panel-header">Customer Margin Scatter</div>
          <div className="panel-sub">
            Gross margin % vs revenue for selected customers.
          </div>

          <div className="chart-scatter">
            <div className="scatter-axis"></div>

            {/* Dots */}
            <div
              className="scatter-dot"
              style={{ left: "20%", bottom: "30%" }}
              data-label="Cust A: 35% / $40M"
            ></div>

            <div
              className="scatter-dot"
              style={{ left: "40%", bottom: "55%" }}
              data-label="Cust B: 52% / $70M"
            ></div>

            <div
              className="scatter-dot"
              style={{ left: "65%", bottom: "60%" }}
              data-label="Cust C: 55% / $110M"
            ></div>

            <div
              className="scatter-dot"
              style={{ left: "80%", bottom: "42%" }}
              data-label="Cust D: 44% / $150M"
            ></div>

            <div
              className="scatter-dot"
              style={{ left: "55%", bottom: "25%" }}
              data-label="Cust E: 32% / $90M"
            ></div>

            <div className="scatter-label-x">Revenue</div>
            <div className="scatter-label-y">Gross Margin %</div>
          </div>
        </section>

      </div>

      {/* Lifecycle Profit View */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Lifecycle Profit View</div>
          <div className="panel-sub">
            Profitability across lifecycle: Installed base ? service cost ? total margin.
          </div>

          <div className="chart-lifecycle">

            <div className="lifecycle-step">
              <div className="lifecycle-title">Installed Base</div>
              <div className="lifecycle-metric">~ 1,250 tools in field</div>
              <div className="lifecycle-bar">
                <div className="lifecycle-bar-fill" style={{ width: "70%" }}></div>
              </div>
            </div>

            <div className="lifecycle-step">
              <div className="lifecycle-title">Service Cost</div>
              <div className="lifecycle-metric">Service cost / rev: 18%</div>
              <div className="lifecycle-bar">
                <div
                  className="lifecycle-bar-fill"
                  style={{
                    width: "45%",
                    background: "linear-gradient(to right,#f97316,#fbbf24)",
                  }}
                ></div>
              </div>
            </div>

            <div className="lifecycle-step">
              <div className="lifecycle-title">Total Lifecycle Margin</div>
              <div className="lifecycle-metric">Lifecycle margin: 36%</div>
              <div className="lifecycle-bar">
                <div className="lifecycle-bar-fill" style={{ width: "60%" }}></div>
              </div>
            </div>

          </div>
        </section>
      </div>

    </div>
  );
}
