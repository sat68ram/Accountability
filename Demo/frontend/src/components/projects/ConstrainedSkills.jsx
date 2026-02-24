import React from "react";
import { useConstrainedTeams } from "../../hooks/useProjects";

export default function ConstrainedSkills() {
  const { data: rows = [], isLoading, error } = useConstrainedTeams();

  if (isLoading) {
    return (
      <section className="panel-light">
        <div className="panel-header">Top Constrained Skills</div>
        <div className="panel-sub">Loading…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-light">
        <div className="panel-header">Top Constrained Skills</div>
        <div className="panel-sub">Failed to load.</div>
      </section>
    );
  }

  const pctVal = (r) => Number(r.UTILIZATION_PCT_NEXT_2Q ?? r.utilization_pct_next_2q) || 0;

  return (
    <section className="panel-light">
      <div className="panel-header">Top Constrained Skills</div>
      <div className="panel-sub">
        Skills driving schedule risk in the next two quarters.
      </div>

      <div className="panel-scroll-content">
      <div className="skill-list">
        {rows.length > 0 ? (
          rows.map((row, i) => {
            const pct = pctVal(row);
            return (
              <div className="skill-row" key={row.TEAM_ID || i}>
                <div>{row.TEAM_NAME || row.TEAM_ID || "Team"}</div>
                <div className="skill-bar">
                  <div className="skill-bar-fill" style={{ width: `${Math.min(100, pct)}%` }}></div>
                </div>
                <div>{pct.toFixed(0)}%</div>
              </div>
            );
          })
        ) : (
          <div className="skill-row">
            <div>No constrained teams (utilization &le; 100%)</div>
            <div className="skill-bar"><div className="skill-bar-fill" style={{ width: "0%" }}></div></div>
            <div>--</div>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
