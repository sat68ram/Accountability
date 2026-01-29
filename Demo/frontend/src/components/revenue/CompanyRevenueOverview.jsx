import React from "react";

export default function CompanyRevenueOverview({ ytdMetric, yoyMetric, qoqMetric }) {
  return (
    <div className="vision-row" style={{ overflow: "auto" }}>
      <section className="panel-light" style={{ minWidth: 0 }}>
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
          <div className={`metric-card metric-${(ytdMetric?.HEALTH_STATUS?.toLowerCase()) ?? "good"}`}>
            <div className="metric-label">YTD Revenue</div>
            <div className="metric-value">{ytdMetric?.VALUE_NUM ?? "--"}{ytdMetric?.VALUE_UNIT ?? ""}</div>
            <div className="metric-hint">Fiscal year to date</div>
          </div>

          <div className={`metric-card metric-${(yoyMetric?.HEALTH_STATUS?.toLowerCase()) ?? "warn"}`}>
            <div className="metric-label">YoY Growth</div>
            <div className="metric-value">{yoyMetric?.VALUE_NUM ?? "--"}{yoyMetric?.VALUE_UNIT ?? ""}</div>
            <div className="metric-hint">vs same period last year</div>
          </div>

          <div className={`metric-card metric-${(qoqMetric?.HEALTH_STATUS?.toLowerCase()) ?? "risk"}`}>
            <div className="metric-label">QoQ Growth</div>
            <div className="metric-value">{qoqMetric?.VALUE_NUM ?? "--"}{qoqMetric?.VALUE_UNIT ?? ""}</div>
            <div className="metric-hint">vs prior quarter</div>
          </div>
        </div>
      </section>
    </div>
  );
}
