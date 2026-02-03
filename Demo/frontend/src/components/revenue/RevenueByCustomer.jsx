import React from "react";
import { getCurrentYearAndQuarter } from "../../hooks/useVisionSummary";
import { useRevenueByCustomer } from "../../hooks/useRevenue";
import { formatCurrency } from "./formatUtils";

export default function RevenueByCustomer() {
  const { quarter } = getCurrentYearAndQuarter();
  const { data: revenueByCustomer, isLoading, error } = useRevenueByCustomer("QUARTER", quarter);
  const rows = revenueByCustomer ?? [];

  return (
    <section className="panel-light" style={{ minWidth: 0, overflow: "auto" }}>
        <div className="panel-header">Revenue by Customer</div>
        <div className="panel-sub">
          Top customers ranked by recognized revenue.
        </div>

        <div style={{ marginTop: "10px", maxHeight: "280px", overflow: "auto" }}>
          {isLoading && <div style={{ padding: "8px", color: "#666" }}>Loading…</div>}
          {error && <div style={{ padding: "8px", color: "#c00" }}>Failed to load.</div>}
          {!isLoading && !error && (
          <table className="okrs-table">
            <thead>
              <tr>
                <th style={{ width: "60%" }}>Customer</th>
                <th style={{ width: "40%" }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((customer, idx) => (
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
          )}
        </div>
    </section>
  );
}
