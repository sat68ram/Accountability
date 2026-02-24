import React from "react";
import { useScheduleHealth } from "../../hooks/useProjects";
import ProgramBurndown from "./ProgramBurndown.jsx";

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

  // SCHEDULE_SCORE is returned as a percent (can be > 100)
  const scorePercents = rows
    .map((r) => Number(r.SCHEDULE_SCORE ?? r.schedule_score))
    .filter((n) => !Number.isNaN(n));

  const maxScorePercent = scorePercents.length ? Math.max(100, ...scorePercents) : 100;
  const quartilePercents = [25, 50, 75, 100];
  const quartilePositions = quartilePercents.map((q) =>
    Math.min(100, (q / maxScorePercent) * 100)
  );
  const delayedValues = rows
    .slice(0, 10)
    .map((r) => Number(r.DELAYED_PROJECT_PCT ?? 0))
    .filter((n) => !Number.isNaN(n));
  const minDelayed = delayedValues.length ? Math.min(...delayedValues) : 0;
  const maxDelayed = delayedValues.length ? Math.max(...delayedValues) : 1;
  const delayedRange = Math.max(maxDelayed - minDelayed, 1);

  return (
    <section className="panel-light">
      <div className="panel-header">Schedule Health – Major Programs</div>
      <div className="panel-sub">
        High-level view of key node programs and milestone burn-down.
      </div>

      <div className="panel-scroll-content">
        <div className="chart-gantt">
          {rows.length > 0 ? (
            rows.map((row, i) => {
              const scorePercent = Number(row.SCHEDULE_SCORE ?? row.schedule_score);
              const scoreLabel = Number.isNaN(scorePercent) ? "N/A" : `${scorePercent.toFixed(1)}%`;
              const widthPct =
                Number.isNaN(scorePercent)
                  ? 0
                  : Math.min(100, (scorePercent / maxScorePercent) * 100);
              const rag = row.RAG_STATUS;

              return (
                <div className="gantt-row" key={row.PROGRAM_ID || i}>
                  <div className="gantt-label">
                    {row.PROGRAM_NAME || row.PROGRAM_ID || "Program"}
                  </div>
                  <div
                    className="gantt-track"
                    style={{ position: "relative", overflow: "visible" }}
                  >
                    {/* quartile markers (based on SCHEDULE_SCORE percent scale) */}
                    {quartilePositions.map((leftPct, idx) => (
                      <div
                        key={quartilePercents[idx]}
                        style={{
                          position: "absolute",
                          left: `${leftPct}%`,
                          top: "10%",
                          bottom: "10%",
                          width: "2px",
                          background: "#000",
                          zIndex: 2,
                          pointerEvents: "none",
                        }}
                      />
                    ))}
                    {/* quartile labels under each bar */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-12px",
                        left: 0,
                        right: 0,
                        height: 0,
                        fontSize: "10px",
                        color: "#111827",
                        pointerEvents: "none",
                      }}
                    >
                      {quartilePositions.map((leftPct, idx) => (
                        <span
                          key={quartilePercents[idx]}
                          style={{
                            position: "absolute",
                            left: `${leftPct}%`,
                            transform: "translateX(-50%)",
                          }}
                        >
                          {quartilePercents[idx]}%
                        </span>
                      ))}
                    </div>

                    <div
                      className={`gantt-bar ${ragClass(rag)}`}
                      style={{
                        left: "2%",
                        width: `${widthPct}%`,
                        position: "relative",
                        zIndex: 1,
                      }}
                      title={`Schedule score: ${scoreLabel}`}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="gantt-row">
              <div className="gantt-label">No program data</div>
              <div className="gantt-track">
                <div className="gantt-bar" style={{ left: "2%", width: "0%" }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProgramBurndown />
    </section>
  );
}
