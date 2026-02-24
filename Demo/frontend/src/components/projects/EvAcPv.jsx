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

  const overCost = rows.filter(
    (r) => ((r.COST_POSITION ?? r.cost_position) || "").toUpperCase() === "OVER_COST"
  );

  const allValues = rows.flatMap((r) => [
    Number(r.PV_TD_USD ?? r.pv_td_usd) || 0,
    Number(r.EV_TD_USD ?? r.ev_td_usd) || 0,
    Number(r.AC_TD_USD ?? r.ac_td_usd) || 0,
  ]);

  const hasData = allValues.length > 0;
  const minVal = hasData ? Math.min(0, ...allValues) : 0;
  const maxVal = hasData ? Math.max(0, ...allValues) : 1;
  const top = 8;
  const bottom = 45;
  const range = maxVal - minVal || 1;

  const toY = (value) =>
    bottom - ((Number(value || 0) - minVal) / range) * (bottom - top);
  const clampY = (y) => Math.max(top, Math.min(bottom, y));
  const count = rows.length || 1;
  const xForIndex = (i) => (count === 1 ? 50 : 5 + (i * 90) / Math.max(count - 1, 1));

  const pvPoints = rows
    .map((r, i) => {
      const y = clampY(toY(r.PV_TD_USD ?? r.pv_td_usd));
      return `${xForIndex(i)},${y}`;
    })
    .join(" ");

  const evPoints = rows
    .map((r, i) => {
      const y = clampY(toY(r.EV_TD_USD ?? r.ev_td_usd));
      return `${xForIndex(i)},${y}`;
    })
    .join(" ");

  const acPoints = rows
    .map((r, i) => {
      const y = clampY(toY(r.AC_TD_USD ?? r.ac_td_usd));
      return `${xForIndex(i)},${y}`;
    })
    .join(" ");

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
          {/* x-axis at value = 0 (or bottom if all values positive) */}
          <line className="evacpv-axis" x1="5" y1={clampY(toY(0))} x2="95" y2={clampY(toY(0))} />
          <line className="evacpv-axis" x1="5" y1="5" x2="5" y2="45" />
          {rows.length > 0 && (
            <>
              <polyline className="line-pv" points={pvPoints} />
              <polyline className="line-ev" points={evPoints} />
              <polyline className="line-ac" points={acPoints} />
              {rows.map((row, i) => {
                const x = xForIndex(i);
                const pv = Number(row.PV_TD_USD ?? row.pv_td_usd) || 0;
                const ev = Number(row.EV_TD_USD ?? row.ev_td_usd) || 0;
                const ac = Number(row.AC_TD_USD ?? row.ac_td_usd) || 0;
                const program = row.PROGRAM_NAME || row.PROGRAM_ID || "Program";
                return (
                  <g key={row.PROGRAM_ID || i}>
                    <circle cx={x} cy={clampY(toY(pv))} r="1.2" fill="#22c55e">
                      <title>{`${program}: PV ${formatCurrency(pv)}`}</title>
                    </circle>
                    <circle cx={x} cy={clampY(toY(ev))} r="1.2" fill="#3b82f6">
                      <title>{`${program}: EV ${formatCurrency(ev)}`}</title>
                    </circle>
                    <circle cx={x} cy={clampY(toY(ac))} r="1.2" fill="#ef4444">
                      <title>{`${program}: AC ${formatCurrency(ac)}`}</title>
                    </circle>
                  </g>
                );
              })}
            </>
          )}

          {/* axis labels */}
          <text x="50" y="49" textAnchor="middle" fontSize="3">
            Programs
          </text>
          <text
            x="2"
            y="25"
            textAnchor="middle"
            fontSize="3"
            transform="rotate(-90 2 25)"
          >
            Value to Date (USD)
          </text>
        </svg>
      </div>

      <div className="panel-scroll-content">
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
      </div>
    </section>
  );
}
