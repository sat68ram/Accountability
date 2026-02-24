import React from "react";
import { useBudgetVsActualByMonth } from "../../hooks/useProjects";
import { formatCurrency } from "./formatUtils";

export default function BudgetVsActual() {
  const { data: rows = [], isLoading, error } = useBudgetVsActualByMonth();

  if (isLoading) {
    return (
      <section className="panel-light">
        <div className="panel-header">Portfolio Budget vs Actual</div>
        <div className="panel-sub">Loading…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-light">
        <div className="panel-header">Portfolio Budget vs Actual</div>
        <div className="panel-sub">Failed to load.</div>
      </section>
    );
  }

  const maxVal = Math.max(
    ...rows.map((r) => Math.max(Number(r.BUDGET_USD ?? r.budget_usd) || 0, Number(r.ACTUAL_USD ?? r.actual_usd) || 0)),
    1
  );

  const monthLabel = (m) => {
    if (!m) return "--";
    const d = new Date(m);
    return isNaN(d.getTime()) ? String(m).slice(0, 7) : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  return (
    <section className="panel-light">
      <div className="panel-header">Portfolio Budget vs Actual</div>
      <div className="panel-sub">Stacked bars by month – budget vs actual spend.</div>

      <div className="panel-scroll-content">
      <div className="chart-stacked-bars">
        {rows.length > 0 ? (
          rows.map((row, i) => {
            const budget = Number(row.BUDGET_USD ?? row.budget_usd) || 0;
            const actual = Number(row.ACTUAL_USD ?? row.actual_usd) || 0;
            const budgetPct = maxVal ? (budget / maxVal) * 100 : 0;
            const actualPct = maxVal ? (actual / maxVal) * 100 : 0;
            return (
              <div className="stacked-row" key={row.MONTH || i}>
                <div className="stacked-label">{monthLabel(row.MONTH)}</div>
                <div className="stacked-bar">
                  <div className="stacked-segment stacked-budget" style={{ width: `${Math.min(100, budgetPct)}%` }} title={formatCurrency(budget)}></div>
                  <div className="stacked-segment stacked-actual" style={{ width: `${Math.min(100, actualPct)}%` }} title={formatCurrency(actual)}></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="stacked-row">
            <div className="stacked-label">No data</div>
            <div className="stacked-bar">
              <div className="stacked-segment stacked-budget" style={{ width: "0%" }}></div>
              <div className="stacked-segment stacked-actual" style={{ width: "0%" }}></div>
            </div>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
