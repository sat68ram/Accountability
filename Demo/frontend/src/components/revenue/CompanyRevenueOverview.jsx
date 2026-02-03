import React from "react";
import { getCurrentYearAndQuarter } from "../../hooks/useVisionSummary";
import { useRevenueMetrics } from "../../hooks/useRevenue";

export default function CompanyRevenueOverview() {
  const { year, quarter } = getCurrentYearAndQuarter();
  const quarterQuery = useRevenueMetrics("QUARTER", quarter);
  const yearQuery = useRevenueMetrics("YEAR", year);

  const metrics = quarterQuery.data ?? [];
  const yearMetrics = yearQuery.data ?? [];
  const metricByName = (name) => metrics.find((m) => m.METRIC_NAME === name) || {};
  const yearMetricByName = (name) => yearMetrics.find((m) => m.METRIC_NAME === name) || {};

  const ytdMetric = yearMetricByName("YTD Revenue");
  const yoyMetric = metricByName("YoY Growth");
  const qoqMetric = metricByName("QoQ Growth");

  if (quarterQuery.isLoading || yearQuery.isLoading) {
    return (
      <div className="vision-row" style={{ overflow: "auto" }}>
        <section className="panel-light" style={{ minWidth: 0 }}>
          <div className="panel-header">Company Revenue Overview</div>
          <div className="panel-sub">Loading…</div>
        </section>
      </div>
    );
  }

  if (quarterQuery.error || yearQuery.error) {
    return (
      <div className="vision-row" style={{ overflow: "auto" }}>
        <section className="panel-light" style={{ minWidth: 0 }}>
          <div className="panel-header">Company Revenue Overview</div>
          <div className="panel-sub">Failed to load metrics.</div>
        </section>
      </div>
    );
  }

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
