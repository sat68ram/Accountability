import React from "react";
import { getCurrentYearAndQuarter } from "../../hooks/useVisionSummary";
import { useProductSKUs } from "../../hooks/useRevenue";
import { formatCurrency } from "./formatUtils";

export default function RevenueByProductSku() {
  const { quarter } = getCurrentYearAndQuarter();
  const { data: productSKUs, isLoading, error } = useProductSKUs("QUARTER", quarter);
  const rows = productSKUs ?? [];

  return (
    <div className="vision-row" style={{ overflow: "auto" }}>
      <section className="panel-light" style={{ minWidth: 0 }}>
        <div className="panel-header">Revenue by Product / SKU</div>
        <div className="panel-sub">
          Detailed SKU-level breakdown including pricing and discounts.
        </div>

        <div style={{ marginTop: "10px", maxHeight: "280px", overflow: "auto" }}>
          {isLoading && <div style={{ padding: "8px", color: "#666" }}>Loading…</div>}
          {error && <div style={{ padding: "8px", color: "#c00" }}>Failed to load.</div>}
          {!isLoading && !error && (
          <table className="okrs-table">
            <thead>
              <tr>
                <th style={{ width: "40%" }}>SKU</th>
                <th style={{ width: "30%" }}>Selling Price</th>
                <th style={{ width: "30%" }}>Discount Applied</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((sku, idx) => (
                  <tr key={idx}>
                    <td>{sku.SKU ?? "--"}</td>
                    <td>{formatCurrency(sku.SELLING_PRICE)}</td>
                    <td>{sku.DISCOUNT_APPLIED != null ? `${sku.DISCOUNT_APPLIED.toFixed(1)}%` : "0.0%"}</td>
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
