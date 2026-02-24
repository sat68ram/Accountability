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

  const slackValues = rows
    .map((r) => Number(r.CRITICAL_SLACK_DAYS ?? r.critical_slack_days))
    .filter((n) => !Number.isNaN(n));

  const hasData = slackValues.length > 0;
  const minSlack = hasData ? Math.min(0, ...slackValues) : 0;
  const maxSlack = hasData ? Math.max(0, ...slackValues) : 1;
  const top = 8;
  const bottom = 45;
  const range = maxSlack - minSlack || 1;

  const scaleY = (value) =>
    bottom - ((value - minSlack) / range) * (bottom - top);

  const count = rows.length || 1;
  const xForIndex = (index) =>
    count === 1 ? 50 : 5 + (index * 90) / Math.max(count - 1, 1);

  const validPoints =
    rows
      .map((row, index) => {
        const rawSlack = Number(row.CRITICAL_SLACK_DAYS ?? row.critical_slack_days);
        if (Number.isNaN(rawSlack)) return null;
        const x = xForIndex(index);
        const y = scaleY(rawSlack);
        return {
          x,
          y,
          slack: rawSlack,
          program: row.PROGRAM_NAME || row.PROGRAM_ID || "Program",
        };
      })
      .filter(Boolean) || [];

  const points = validPoints.length
    ? validPoints.map((p) => `${p.x},${p.y}`).join(" ")
    : "5,25 95,25";

  const xAxisY = scaleY(0); // place x-axis at 0 days slack

  return (
    <section className="panel-light">
      <div className="panel-header">Slippage & Critical Path</div>
      <div className="panel-sub">
        Trend in schedule slippage plus key critical-path programs.
      </div>

      <div className="chart-burndown">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none">
          {/* axes (x-axis at 0 days slack) */}
          <line className="burndown-axis" x1="5" y1={xAxisY} x2="95" y2={xAxisY} />
          <line className="burndown-axis" x1="5" y1="5" x2="5" y2="45" />

          {/* slippage curve */}
          <polyline className="burndown-actual" points={points} />

          {/* data points with hover tooltips */}
          {validPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#3b82f6">
              <title>{`${p.program}: ${p.slack.toFixed(1)} days slack`}</title>
            </circle>
          ))}

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
            Slack (days)
          </text>
        </svg>
      </div>

      <div className="panel-scroll-content">
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
      </div>
    </section>
  );
}
