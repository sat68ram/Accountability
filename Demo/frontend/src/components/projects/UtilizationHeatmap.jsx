import React, { useMemo } from "react";
import { useUtilizationByTeamByQuarter } from "../../hooks/useProjects";

function cellClass(pct) {
  const n = Number(pct);
  if (isNaN(n)) return "util-low";
  if (n >= 95) return "util-crit";
  if (n >= 85) return "util-high";
  if (n >= 70) return "util-med";
  return "util-low";
}

export default function UtilizationHeatmap() {
  const { data: rows = [], isLoading, error } = useUtilizationByTeamByQuarter();

  const { teams, quarters, grid } = useMemo(() => {
    const teamSet = new Set();
    const quarterSet = new Set();
    rows.forEach((r) => {
      teamSet.add(r.TEAM_NAME || r.TEAM_ID);
      quarterSet.add(r.QUARTER_LABEL || "");
    });
    const teams = [...teamSet].sort();
    const quarters = [...quarterSet].filter(Boolean).sort();
    const grid = {};
    rows.forEach((r) => {
      const t = r.TEAM_NAME || r.TEAM_ID;
      const q = r.QUARTER_LABEL || "";
      if (!grid[t]) grid[t] = {};
      grid[t][q] = r.UTILIZATION_PCT ?? r.utilization_pct;
    });
    return { teams, quarters, grid };
  }, [rows]);

  if (isLoading) {
    return (
      <section className="panel-light">
        <div className="panel-header">Engineering Utilization Heatmap</div>
        <div className="panel-sub">Loading…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-light">
        <div className="panel-header">Engineering Utilization Heatmap</div>
        <div className="panel-sub">Failed to load.</div>
      </section>
    );
  }

  const qLabels = quarters.length > 0 ? quarters : ["Q1", "Q2", "Q3", "Q4"];
  const teamRows = teams.length > 0 ? teams : ["No data"];

  return (
    <section className="panel-light">
      <div className="panel-header">Engineering Utilization Heatmap</div>
      <div className="panel-sub">Utilization by group vs quarter.</div>

      <div className="panel-scroll-content">
      <div className="chart-heatmap-util">
        <div className="util-row">
          <div className="util-label"></div>
          {qLabels.map((q) => (
            <div className="util-cell util-low" key={q}>
              {q}
            </div>
          ))}
        </div>
        {teamRows.map((team) => (
          <div className="util-row" key={team}>
            <div className="util-label">{team}</div>
            {qLabels.map((q) => {
              const val = grid[team] && grid[team][q];
              const pct = val != null ? `${Number(val).toFixed(0)}%` : "--";
              return (
                <div key={q} className={`util-cell ${cellClass(val)}`}>
                  {pct}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
