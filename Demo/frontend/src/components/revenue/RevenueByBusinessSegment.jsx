import React from "react";
import { formatCurrency } from "./formatUtils";

export default function RevenueByBusinessSegment({ businessSegments }) {
  const rows = businessSegments ?? [];

  return (
    <div className="vision-row" style={{ overflow: "auto" }}>
      <section className="panel-light" style={{ minWidth: 0 }}>
        <div className="panel-header">Revenue by Business Segment</div>
        <div className="panel-sub">
          Segment revenue and operating margin across key lines of business.
        </div>

        <div style={{ marginTop: "10px", maxHeight: "280px", overflow: "auto" }}>
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
        </div>
      </section>
    </div>
  );
}
