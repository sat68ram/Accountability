import React from "react";
import { useScheduleHealth } from "../../hooks/useProjects";

function ragClass(rag) {
  const r = (rag || "").toUpperCase();
  if (r === "GREEN") return "";
  if (r === "YELLOW" || r === "AMBER") return "at-risk";
  return "late";
}

export default function ScheduleHealth() {
  const { data: rows = [], isLoading, error } = useScheduleHealth();

  if (isLoading) {
    return (
      <section className="panel-light">
        <div className="panel-header">Schedule Health – Major Programs</div>
        <div className="panel-sub">Loading…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-light">
        <div className="panel-header">Schedule Health – Major Programs</div>
        <div className="panel-sub">Failed to load.</div>
      </section>
    );
  }

  const maxScore = Math.max(...rows.map((r) => Number(r.SCHEDULE_SCORE) || 0), 1);
  const maxDelayed = Math.max(...rows.map((r) => Number(r.DELAYED_PROJECT_PCT) || 0), 1);

  return (
    <section className="panel-light">
      <div className="panel-header">Schedule Health – Major Programs</div>
      <div className="panel-sub">
        High-level view of key node programs and milestone burn-down.
      </div>

      <div className="chart-gantt">
        {rows.length > 0 ? (
          rows.map((row, i) => {
            const score = Number(row.SCHEDULE_SCORE) || 0;
            const widthPct = maxScore ? Math.min(100, (score / maxScore) * 100) : 50;
            const rag = row.RAG_STATUS;
            return (
              <div className="gantt-row" key={row.PROGRAM_ID || i}>
                <div className="gantt-label">{row.PROGRAM_NAME || row.PROGRAM_ID || "Program"}</div>
                <div className="gantt-track">
                  <div
                    className={`gantt-bar ${ragClass(rag)}`}
                    style={{ left: "2%", width: `${widthPct}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="gantt-row">
            <div className="gantt-label">No program data</div>
            <div className="gantt-track"><div className="gantt-bar" style={{ left: "2%", width: "0%" }}></div></div>
          </div>
        )}
      </div>

      <div className="chart-burndown">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none">
          <g className="burndown-grid">
            <line x1="0" y1="10" x2="100" y2="10" />
            <line x1="0" y1="20" x2="100" y2="20" />
            <line x1="0" y1="30" x2="100" y2="30" />
            <line x1="0" y1="40" x2="100" y2="40" />
          </g>
          <line className="burndown-axis" x1="5" y1="45" x2="95" y2="45" />
          <line className="burndown-axis" x1="5" y1="5" x2="5" y2="45" />
          {rows.length > 0 && (() => {
            const pts = rows.slice(0, 10).map((r, i) => {
              const y = 45 - ((Number(r.DELAYED_PROJECT_PCT) ?? 0) / (maxDelayed || 1)) * 35;
              const x = 5 + (i * 90) / Math.max(rows.length - 1, 1);
              return `${x},${Math.max(5, Math.min(45, y))}`;
            });
            return <polyline className="burndown-actual" points={pts.join(" ")} />;
          })()}
        </svg>
      </div>
    </section>
  );
}
