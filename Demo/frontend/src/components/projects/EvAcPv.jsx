import React from "react";
import { useEvAcPv } from "../../hooks/useProjects";
import { formatCurrency } from "./formatUtils";

export default function EvAcPv() {
  const { data: rows = [], isLoading, error } = useEvAcPv();

  if (isLoading) {
    return (
      <section className="panel-light">
        <div className="panel-header">EV / AC / PV</div>
        <div className="panel-sub">Loading…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-light">
        <div className="panel-header">EV / AC / PV</div>
        <div className="panel-sub">Failed to load.</div>
      </section>
    );
  }

  const overCost = rows.filter((r) => ((r.COST_POSITION ?? r.cost_position) || "").toUpperCase() === "OVER_COST");
  const maxVal = Math.max(
    ...rows.map((r) => Math.max(Number(r.PV_TD_USD ?? r.pv_td_usd) || 0, Number(r.EV_TD_USD ?? r.ev_td_usd) || 0, Number(r.AC_TD_USD ?? r.ac_td_usd) || 0)),
    1
  );

  const toY = (v) => 45 - (Number(v) / maxVal) * 38;
  const n = Math.max(rows.length, 1);
  const pvPoints = rows.map((r, i) => `${5 + (i * 90) / (n - 1)},${Math.max(5, Math.min(45, toY(r.PV_TD_USD ?? r.pv_td_usd)))}`).join(" ");
  const evPoints = rows.map((r, i) => `${5 + (i * 90) / (n - 1)},${Math.max(5, Math.min(45, toY(r.EV_TD_USD ?? r.ev_td_usd)))}`).join(" ");
  const acPoints = rows.map((r, i) => `${5 + (i * 90) / (n - 1)},${Math.max(5, Math.min(45, toY(r.AC_TD_USD ?? r.ac_td_usd)))}`).join(" ");

  return (
    <section className="panel-light">
      <div className="panel-header">EV / AC / PV</div>
      <div className="panel-sub">Earned value vs actual cost vs planned value.</div>

      <div className="chart-evacpv">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none">
          <g className="evacpv-grid">
            {[10, 20, 30, 40].map((y) => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} />
            ))}
          </g>
          <line className="evacpv-axis" x1="5" y1="45" x2="95" y2="45" />
          <line className="evacpv-axis" x1="5" y1="5" x2="5" y2="45" />
          {rows.length > 0 && (
            <>
              <polyline className="line-pv" points={pvPoints} />
              <polyline className="line-ev" points={evPoints} />
              <polyline className="line-ac" points={acPoints} />
            </>
          )}
        </svg>
      </div>

      <div className="overrun-list">
        {overCost.length > 0 ? (
          overCost.slice(0, 5).map((row, i) => {
            const cv = Number(row.CV_TD_USD ?? row.cv_td_usd) || 0;
            const ac = Number(row.AC_TD_USD ?? row.ac_td_usd) || 1;
            const pct = ac ? Math.abs((cv / ac) * 100) : 0;
            return (
              <div className="overrun-item" key={row.PROGRAM_ID || i}>
                <span className="overrun-label">{row.PROGRAM_NAME || row.PROGRAM_ID}</span>
                <span className="overrun-chip">+{pct.toFixed(0)}% over</span>
              </div>
            );
          })
        ) : (
          <div className="overrun-item">
            <span className="overrun-label">No over-cost programs</span>
          </div>
        )}
      </div>
    </section>
  );
}
