import React from "react";
import { getCurrentYearAndQuarter } from "../../hooks/useVisionSummary";
import { useRevenueByRegion } from "../../hooks/useRevenue";
import { formatCurrency } from "./formatUtils";

export default function RevenueByRegion() {
  const { quarter } = getCurrentYearAndQuarter();
  const { data: revenueByRegion, isLoading, error } = useRevenueByRegion("QUARTER", quarter);
  const rows = revenueByRegion ?? [];

  return (
    <section className="panel-light" style={{ minWidth: 0, overflow: "auto" }}>
        <div className="panel-header">Revenue by Region</div>
        <div className="panel-sub">
          Regional mix of revenue for the selected time horizon.
        </div>

        <div style={{ marginTop: "10px", maxHeight: "280px", overflow: "auto" }}>
          {isLoading && <div style={{ padding: "8px", color: "#666" }}>Loading…</div>}
          {error && <div style={{ padding: "8px", color: "#c00" }}>Failed to load.</div>}
          {!isLoading && !error && (
          <table className="okrs-table">
            <thead>
              <tr>
                <th style={{ width: "60%" }}>Region</th>
                <th style={{ width: "40%" }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((region, idx) => (
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
          )}
        </div>
    </section>
  );
}
