import React from "react";
import { useProjectRisksExceptions } from "../../hooks/useProjects";

const BAR_MAX_HEIGHT_PX = 160;

function RisksBarChart({ data, title }) {
  const flatBars = data.flatMap((b) => [
    { label: b.label, level: "Critical", count: b.criticalCount },
    { label: b.label, level: "Major", count: b.majorCount },
  ]);
  const maxCount = Math.max(...flatBars.map((b) => b.count), 1);

  return (
    <div className="chart-risks-bars">
      <div className="risks-chart-title">{title}</div>
      <div className="risks-bars-y-label">Count</div>
      <div className="risks-bars-content">
        <div className="risks-bars-grid">
          {flatBars.map((bar, i) => {
            const barHeightPx = maxCount
              ? Math.max(4, Math.round((bar.count / maxCount) * BAR_MAX_HEIGHT_PX))
              : 0;
            return (
            <div key={i} className="risks-bar-col">
              <div className="risks-bar-track">
                <div
                  className={`risks-bar risks-bar-${bar.level.toLowerCase()}`}
                  style={{ height: `${barHeightPx}px` }}
                  title={`${bar.label} – ${bar.level}: ${bar.count}`}
                ></div>
              </div>
              <div className="risks-bar-val">{bar.count}</div>
            </div>
            );
          })}
        </div>
        <div className="risks-bars-x-labels">
          {data.map((b, i) => (
            <div key={i} className="risks-x-group">
              <span>{b.label}</span>
              <span className="risks-x-sublabels">Critical / Major</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectRisksExceptions() {
  const { data, isLoading, error } = useProjectRisksExceptions();

  if (isLoading) {
    return (
      <section className="panel-light">
        <div className="panel-header">Project Risks & Exceptions</div>
        <div className="panel-sub">Loading…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel-light">
        <div className="panel-header">Project Risks & Exceptions</div>
        <div className="panel-sub">Failed to load.</div>
      </section>
    );
  }

  const openedByMonth = data?.openedByMonth ?? [];
  const activelyOpenByMonth = data?.activelyOpenByMonth ?? [];
  const criticalLast30 = data?.criticalLast30 ?? 0;
  const criticalOpen = data?.criticalOpen ?? 0;
  const majorLast30 = data?.majorLast30 ?? 0;
  const majorOpen = data?.majorOpen ?? 0;

  return (
    <section className="panel-light">
      <div className="panel-header">Project Risks & Exceptions</div>
      <div className="panel-sub">
        Critical and major risks by open date and actively open status.
      </div>

      <div className="risks-charts-row">
        <RisksBarChart data={openedByMonth} title="Opened by month" />
        <RisksBarChart data={activelyOpenByMonth} title="Actively open by month" />
      </div>

      <div className="panel-scroll-content">
      <table className="table-small">
        <thead>
          <tr>
            <th>Category</th>
            <th>Last 30 days</th>
            <th>Open</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Critical issues</td>
            <td>{criticalLast30 != null ? criticalLast30 : "--"}</td>
            <td>{criticalOpen != null ? criticalOpen : "--"}</td>
          </tr>
          <tr>
            <td>Major issues</td>
            <td>{majorLast30 != null ? majorLast30 : "--"}</td>
            <td>{majorOpen != null ? majorOpen : "--"}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </section>
  );
}
