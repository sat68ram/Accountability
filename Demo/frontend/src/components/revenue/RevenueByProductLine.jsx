import React from "react";
import { getCurrentYearAndQuarter } from "../../hooks/useVisionSummary";
import { useProductLines } from "../../hooks/useRevenue";
import { formatCurrency, formatNumber } from "./formatUtils";

export default function RevenueByProductLine() {
  const { quarter } = getCurrentYearAndQuarter();
  const { data: productLines, isLoading, error } = useProductLines("QUARTER", quarter);
  const rows = productLines ?? [];

  return (
    <div className="vision-row" style={{ overflow: "auto" }}>
      <section className="panel-light" style={{ minWidth: 0 }}>
        <div className="panel-header">Revenue by Product Line</div>
        <div className="panel-sub">
          Product-line view showing revenue, ASP, and shipment volumes.
        </div>

        <div style={{ marginTop: "10px", maxHeight: "280px", overflow: "auto" }}>
          {isLoading && <div style={{ padding: "8px", color: "#666" }}>Loading…</div>}
          {error && <div style={{ padding: "8px", color: "#c00" }}>Failed to load.</div>}
          {!isLoading && !error && (
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
              {rows.length > 0 ? (
                rows.map((product, idx) => (
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
          )}
        </div>
      </section>
    </div>
  );
}
