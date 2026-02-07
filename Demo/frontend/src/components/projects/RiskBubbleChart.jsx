import React from "react";
import { useRiskBubble } from "../../hooks/useProjects";

export default function RiskBubbleChart() {
  const { data: rows = [], isLoading, error } = useRiskBubble();

  if (isLoading) {
    return (
      <section className="panel-light">
        <div className="panel-header">Risk Bubble Chart</div>
        <div className="panel-sub">Loading…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-light">
        <div className="panel-header">Risk Bubble Chart</div>
        <div className="panel-sub">Failed to load.</div>
      </section>
    );
  }

  const maxLikelihood = Math.max(...rows.map((r) => Number(r.AVG_LIKELIHOOD_PCT ?? r.avg_likelihood_pct) || 0), 1);
  const maxImpact = Math.max(...rows.map((r) => Number(r.AVG_IMPACT_SCORE ?? r.avg_impact_score) || 0), 1);
  const maxExp = Math.max(...rows.map((r) => Number(r.RISK_EXPOSURE_INDEX ?? r.risk_exposure_index) || 0), 1);

  return (
    <section className="panel-light">
      <div className="panel-header">Risk Bubble Chart</div>
      <div className="panel-sub">
        Impact × likelihood across major programs.
      </div>

      <div className="chart-bubble">
        <div className="bubble-axis"></div>
        {rows.length > 0 ? (
          rows.map((row, i) => {
            const likelihood = Number(row.AVG_LIKELIHOOD_PCT ?? row.avg_likelihood_pct) || 0;
            const impact = Number(row.AVG_IMPACT_SCORE ?? row.avg_impact_score) || 0;
            const exp = Number(row.RISK_EXPOSURE_INDEX ?? row.risk_exposure_index) || 0;
            const left = maxLikelihood ? (likelihood / maxLikelihood) * 80 + 10 : 50;
            const bottom = maxImpact ? (impact / maxImpact) * 80 + 10 : 50;
            const size = maxExp ? 8 + (exp / maxExp) * 20 : 14;
            const label = `${row.PROGRAM_NAME || row.PROGRAM_ID} – ${(row.RISK_LEVEL ?? row.risk_level) || ""} / ${likelihood.toFixed(0)}%`;
            return (
              <div
                key={row.PROGRAM_ID || i}
                className="bubble-dot"
                style={{
                  left: `${left}%`,
                  bottom: `${bottom}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                data-label={label}
                title={label}
              ></div>
            );
          })
        ) : (
          <div className="bubble-dot" style={{ left: "50%", bottom: "50%", width: "10px", height: "10px" }} title="No risk data"></div>
        )}
        <div className="bubble-label-x">Likelihood</div>
        <div className="bubble-label-y">Impact</div>
      </div>
    </section>
  );
}
