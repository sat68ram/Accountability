import React from "react";
import { getCurrentYearAndQuarter } from "../../hooks/useVisionSummary";
import { useBusinessSegments } from "../../hooks/useRevenue";
import { formatCurrency } from "./formatUtils";

export default function RevenueByBusinessSegment() {
  const { quarter } = getCurrentYearAndQuarter();
  const { data: businessSegments, isLoading, error } = useBusinessSegments("QUARTER", quarter);
  const rows = businessSegments ?? [];

  return (
    <div className="vision-row" style={{ overflow: "auto" }}>
      <section className="panel-light" style={{ minWidth: 0 }}>
        <div className="panel-header">Revenue by Business Segment</div>
        <div className="panel-sub">
          Segment revenue and operating margin across key lines of business.
        </div>

        <div style={{ marginTop: "10px", maxHeight: "280px", overflow: "auto" }}>
          {isLoading && <div style={{ padding: "8px", color: "#666" }}>Loading…</div>}
          {error && <div style={{ padding: "8px", color: "#c00" }}>Failed to load.</div>}
          {!isLoading && !error && (
          <table className="okrs-table">
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Business Segment</th>
                <th style={{ width: "30%" }}>Revenue</th>
                <th style={{ width: "30%" }}>Operating Margin</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((segment, idx) => (
                  <tr key={idx}>
                    <td>{segment.BUSINESS_SEGMENT ?? "--"}</td>
                    <td>{formatCurrency(segment.REVENUE)}</td>
                    <td>{segment.OPERATING_MARGIN != null ? `${segment.OPERATING_MARGIN.toFixed(1)}%` : "--"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", color: "#666" }}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </section>
    </div>
  );
}
