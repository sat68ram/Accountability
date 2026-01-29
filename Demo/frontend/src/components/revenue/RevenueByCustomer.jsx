import React from "react";
import { formatCurrency } from "./formatUtils";

export default function RevenueByCustomer({ revenueByCustomer }) {
  const rows = revenueByCustomer ?? [];

  return (
    <section className="panel-light" style={{ minWidth: 0, overflow: "auto" }}>
        <div className="panel-header">Revenue by Customer</div>
        <div className="panel-sub">
          Top customers ranked by recognized revenue.
        </div>

        <div style={{ marginTop: "10px", maxHeight: "280px", overflow: "auto" }}>
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
        </div>
    </section>
  );
}
