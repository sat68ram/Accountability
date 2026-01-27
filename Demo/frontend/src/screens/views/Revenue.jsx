import React, { useState } from "react";
import { useRevenueSummary } from "../../hooks/useRevenue";
import { getCurrentYearAndQuarter } from "../../hooks/useVisionSummary";

export default function Revenue() {
  // --- period state ---
  const [periodType, setPeriodType] = useState("QUARTER");

  const { year, quarter } = getCurrentYearAndQuarter();
  const [periodLabel, setPeriodLabel] = useState(quarter); // default
  
  const yearLabel = year;
  
  const quarterQuery = useRevenueSummary(periodType, periodLabel);
  const yearQuery = useRevenueSummary('YEAR', yearLabel);

  const isLoading = quarterQuery.isLoading || yearQuery.isLoading;
  const error = quarterQuery.error || yearQuery.error;

  if (isLoading) {
    return <div className="screen company-vision">Loading…</div>;
  }

  if (error) {
    return (
      <div className="screen company-vision">
        <div className="panel-light">Failed to load Revenue data</div>
      </div>
    );
  }

  // Use these in UI:
  const quarterData = quarterQuery.data ?? {};
  const yearData = yearQuery.data ?? {};

  const metrics = quarterData.metrics ?? [];
  const yearMetrics = yearData.metrics ?? [];

  const metricByName = (name) =>
    metrics.find((m) => m.METRIC_NAME === name) || {};

  const yearMetricByName = (name) =>
    yearMetrics.find((m) => m.METRIC_NAME === name) || {};

  // YTD Revenue should come from year data, not quarter
  const ytdMetric = yearMetricByName("YTD Revenue");
  const yoyMetric = metricByName("YoY Growth");
  const qoqMetric = metricByName("QoQ Growth");

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "--") return "--";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return "--";
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined || value === "--") return "--";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return "--";
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "--") return "--";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return "--";
    return num.toLocaleString();
  };

  const businessSegments = quarterData.businessSegments ?? [];
  const productLines = quarterData.productLines ?? [];
  const productSKUs = quarterData.productSKUs ?? [];
  const revenueByRegion = quarterData.revenueByRegion ?? [];
  const revenueByCustomer = quarterData.revenueByCustomer ?? [];

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
            <div className={`metric-card metric-${(ytdMetric.HEALTH_STATUS?.toLowerCase()) ?? "good"}`}>
              <div className="metric-label">YTD Revenue</div>
              <div className="metric-value">{ytdMetric.VALUE_NUM ?? "--"}{ytdMetric.VALUE_UNIT ?? ""}</div>
              <div className="metric-hint">Fiscal year to date</div>
            </div>

            <div className={`metric-card metric-${(yoyMetric.HEALTH_STATUS?.toLowerCase()) ?? "warn"}`}>
              <div className="metric-label">YoY Growth</div>
              <div className="metric-value">{yoyMetric.VALUE_NUM ?? "--"}{yoyMetric.VALUE_UNIT ?? ""}</div>
              <div className="metric-hint">vs same period last year</div>
            </div>

            <div className={`metric-card metric-${(qoqMetric.HEALTH_STATUS?.toLowerCase()) ?? "risk"}`}>
              <div className="metric-label">QoQ Growth</div>
              <div className="metric-value">{qoqMetric.VALUE_NUM ?? "--"}{qoqMetric.VALUE_UNIT ?? ""}</div>
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
                {businessSegments.length > 0 ? (
                  businessSegments.map((segment, idx) => (
                    <tr key={idx}>
                      <td>{segment.BUSINESS_SEGMENT ?? "--"}</td>
                      <td>{formatCurrency(segment.REVENUE)}</td>
                      <td>{segment.OPERATING_MARGIN ? `${segment.OPERATING_MARGIN.toFixed(1)}%` : "--"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "#666" }}>No data available</td>
                  </tr>
                )}
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
                {productLines.length > 0 ? (
                  productLines.map((product, idx) => (
                    <tr key={idx}>
                      <td>{product.PRODUCT_LINE ?? "--"}</td>
                      <td>{formatCurrency(product.REVENUE)}</td>
                      <td>{formatCurrency(product.AVG_SELLING_PRICE)}</td>
                      <td>{formatNumber(product.SHIPMENT_COUNT)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "#666" }}>No data available</td>
                  </tr>
                )}
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
                {productSKUs.length > 0 ? (
                  productSKUs.map((sku, idx) => (
                    <tr key={idx}>
                      <td>{sku.SKU ?? "--"}</td>
                      <td>{formatCurrency(sku.SELLING_PRICE)}</td>
                      <td>{sku.DISCOUNT_APPLIED ? `${sku.DISCOUNT_APPLIED.toFixed(1)}%` : "0.0%"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "#666" }}>No data available</td>
                  </tr>
                )}
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
                {revenueByRegion.length > 0 ? (
                  revenueByRegion.map((region, idx) => (
                    <tr key={idx}>
                      <td>{region.REGION ?? "--"}</td>
                      <td>{formatCurrency(region.REVENUE)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center", color: "#666" }}>No data available</td>
                  </tr>
                )}
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
                {revenueByCustomer.length > 0 ? (
                  revenueByCustomer.map((customer, idx) => (
                    <tr key={idx}>
                      <td>{customer.CUSTOMER ?? "--"}</td>
                      <td>{formatCurrency(customer.REVENUE)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center", color: "#666" }}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

    </div>
  );
}
