import React from "react";
export default function Revenue() {
  return (
    <div className="vision-layout">

      {/* Top row: Company Revenue card */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Company Revenue Overview</div>
          <div className="panel-sub">
            High-level revenue performance with growth indicators.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <div className="metric-card metric-good">
              <div className="metric-label">YTD Revenue</div>
              <div className="metric-value">$4.2B</div>
              <div className="metric-hint">Fiscal year to date</div>
            </div>

            <div className="metric-card metric-warn">
              <div className="metric-label">YoY Growth</div>
              <div className="metric-value">+11.4%</div>
              <div className="metric-hint">vs same period last year</div>
            </div>

            <div className="metric-card metric-risk">
              <div className="metric-label">QoQ Growth</div>
              <div className="metric-value">+2.1%</div>
              <div className="metric-hint">vs prior quarter</div>
            </div>
          </div>
        </section>
      </div>

      {/* Business segment level revenue */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Revenue by Business Segment</div>
          <div className="panel-sub">
            Segment revenue and operating margin across key lines of business.
          </div>

          <div style={{ marginTop: "10px", overflowX: "auto" }}>
            <table className="okrs-table">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Business Segment</th>
                  <th style={{ width: "30%" }}>Revenue</th>
                  <th style={{ width: "30%" }}>Operating Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Semiconductor Systems</td>
                  <td>$2.6B</td>
                  <td>27.5%</td>
                </tr>
                <tr>
                  <td>Applied Global Services</td>
                  <td>$1.1B</td>
                  <td>23.2%</td>
                </tr>
                <tr>
                  <td>Display & Adjacent Technologies</td>
                  <td>$0.5B</td>
                  <td>18.7%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Product Line Revenue */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Revenue by Product Line</div>
          <div className="panel-sub">
            Product-line view showing revenue, ASP, and shipment volumes.
          </div>

          <div style={{ marginTop: "10px", maxHeight: "220px", overflow: "auto" }}>
            <table className="okrs-table">
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Product Line</th>
                  <th style={{ width: "25%" }}>Revenue</th>
                  <th style={{ width: "25%" }}>Avg Selling Price</th>
                  <th style={{ width: "20%" }}>Shipment Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>FAB Products</td>
                  <td>$1.8B</td>
                  <td>$4.2M</td>
                  <td>430</td>
                </tr>
                <tr>
                  <td>Display</td>
                  <td>$0.7B</td>
                  <td>$2.9M</td>
                  <td>240</td>
                </tr>
                <tr>
                  <td>Packaging Tools</td>
                  <td>$0.4B</td>
                  <td>$1.3M</td>
                  <td>310</td>
                </tr>
                <tr>
                  <td>Inspection & Metrology</td>
                  <td>$0.9B</td>
                  <td>$3.1M</td>
                  <td>290</td>
                </tr>
                <tr>
                  <td>Services & Subscriptions</td>
                  <td>$0.5B</td>
                  <td>$180K</td>
                  <td>2,750</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Product / SKU Revenue */}
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Revenue by Product / SKU</div>
          <div className="panel-sub">
            Detailed SKU-level breakdown including pricing and discounts.
          </div>

          <div style={{ marginTop: "10px", maxHeight: "220px", overflow: "auto" }}>
            <table className="okrs-table">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>SKU</th>
                  <th style={{ width: "30%" }}>Selling Price</th>
                  <th style={{ width: "30%" }}>Discount Applied</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>FAB-ETCH-7N-ULTRA</td>
                  <td>$5.1M</td>
                  <td>4.5%</td>
                </tr>
                <tr>
                  <td>FAB-DEPOSITION-3D-NAND</td>
                  <td>$4.7M</td>
                  <td>3.0%</td>
                </tr>
                <tr>
                  <td>DISP-LITHO-G8</td>
                  <td>$2.4M</td>
                  <td>6.2%</td>
                </tr>
                <tr>
                  <td>PACK-ADVANCED-WLP</td>
                  <td>$1.6M</td>
                  <td>2.8%</td>
                </tr>
                <tr>
                  <td>SVC-FULL-FAB-CONTRACT-3Y</td>
                  <td>$350K</td>
                  <td>0.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Revenue by Region & by Customer */}
      <div className="vision-row vision-row-2">

        {/* By Region */}
        <section className="panel-light">
          <div className="panel-header">Revenue by Region</div>
          <div className="panel-sub">
            Regional mix of revenue for the selected time horizon.
          </div>

          <div style={{ marginTop: "10px", maxHeight: "220px", overflow: "auto" }}>
            <table className="okrs-table">
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Region</th>
                  <th style={{ width: "40%" }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>North America</td>
                  <td>$1.4B</td>
                </tr>
                <tr>
                  <td>Europe</td>
                  <td>$0.8B</td>
                </tr>
                <tr>
                  <td>China</td>
                  <td>$0.9B</td>
                </tr>
                <tr>
                  <td>Rest of Asia</td>
                  <td>$0.7B</td>
                </tr>
                <tr>
                  <td>Rest of World</td>
                  <td>$0.4B</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* By Customer */}
        <section className="panel-light">
          <div className="panel-header">Revenue by Customer</div>
          <div className="panel-sub">
            Top customers ranked by recognized revenue.
          </div>

          <div style={{ marginTop: "10px", maxHeight: "220px", overflow: "auto" }}>
            <table className="okrs-table">
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Customer</th>
                  <th style={{ width: "40%" }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Alpha Foundry Corp.</td>
                  <td>$520M</td>
                </tr>
                <tr>
                  <td>Global Chip Manufacturing</td>
                  <td>$410M</td>
                </tr>
                <tr>
                  <td>NextGen Displays Inc.</td>
                  <td>$320M</td>
                </tr>
                <tr>
                  <td>Silicon Packaging Solutions</td>
                  <td>$260M</td>
                </tr>
                <tr>
                  <td>Universal Fab Services</td>
                  <td>$190M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>

    </div>
  );
}
