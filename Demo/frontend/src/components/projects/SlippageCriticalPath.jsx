import React from "react";
import { useSlippageByProgram } from "../../hooks/useProjects";

function statusPill(status) {
  const s = (status || "").toUpperCase();
  if (s === "GREEN") return "pill-ontrack";
  if (s === "YELLOW") return "pill-risk";
  return "pill-behind";
}

function statusLabel(status) {
  const s = (status || "").toUpperCase();
  if (s === "GREEN") return "On track";
  if (s === "YELLOW") return "Tight";
  return "Late";
}

export default function SlippageCriticalPath() {
  const { data: rows = [], isLoading, error } = useSlippageByProgram();

  if (isLoading) {
    return (
      <section className="panel-light">
        <div className="panel-header">Slippage & Critical Path</div>
        <div className="panel-sub">Loading…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-light">
        <div className="panel-header">Slippage & Critical Path</div>
        <div className="panel-sub">Failed to load.</div>
      </section>
    );
  }

  const slackValues = rows.map((r) => Number(r.CRITICAL_SLACK_DAYS ?? r.critical_slack_days) ?? 0).filter((n) => !isNaN(n));
  const points = slackValues.length
    ? slackValues.map((v, i) => `${5 + (i * 90) / Math.max(slackValues.length - 1, 1)},${25 - Math.max(-15, Math.min(15, v))}`
    ).join(" ")
    : "5,25 95,25";

  return (
    <section className="panel-light">
      <div className="panel-header">Slippage & Critical Path</div>
      <div className="panel-sub">
        Trend in schedule slippage plus key critical-path programs.
      </div>

      <div className="chart-burndown">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none">
          <line className="burndown-axis" x1="5" y1="45" x2="95" y2="45" />
          <line className="burndown-axis" x1="5" y1="5" x2="5" y2="45" />
          <polyline className="burndown-actual" points={points} />
        </svg>
      </div>

      <table className="table-small">
        <thead>
          <tr>
            <th>Program</th>
            <th>Critical Path</th>
            <th>Slack</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, i) => (
              <tr key={row.PROGRAM_ID || i}>
                <td>{row.PROGRAM_NAME || row.PROGRAM_ID || "--"}</td>
                <td>{row.CRITICAL_PROJECT_NAME || row.critical_project_name || "--"}</td>
                <td>
                  {(row.CRITICAL_SLACK_DAYS ?? row.critical_slack_days) != null
                    ? `${Number(row.CRITICAL_SLACK_DAYS ?? row.critical_slack_days)} days`
                    : "--"}
                </td>
                <td>
                  <span className={`pill-status ${statusPill(row.STATUS ?? row.status)}`}>
                    {statusLabel(row.STATUS ?? row.status)}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#666" }}>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
