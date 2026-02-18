import React from "react";
import { useGateReadiness } from "../../hooks/useProjects";

function StageBarChart({ data, title }) {
  const maxCount = Math.max(...data.map((s) => s.projectCount), 1);

  return (
    <div className="chart-stage-bars-wrapper">
      <div className="stage-chart-title">{title}</div>
      <div className="chart-stage-bars">
        <div className="stage-bars-y-label">Count</div>
        <div className="stage-bars-content">
        <div className="stage-bars-grid">
          {data.map((stage, i) => (
            <div key={stage.stageName || i} className="stage-bar-col">
              <div
                className="stage-bar"
                style={{
                  height: maxCount ? `${Math.max(4, (stage.projectCount / maxCount) * 100)}%` : "0%",
                }}
                title={`${stage.stageName}: ${stage.projectCount}`}
              ></div>
              <div className="stage-bar-val">{stage.projectCount}</div>
            </div>
          ))}
        </div>
        <div className="stage-bars-x-labels">
          {data.map((stage, i) => (
            <div key={stage.stageName || i} className="stage-x-label">
              {stage.stageName}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

export default function GateReadinessSummary() {
  const { data, isLoading, error } = useGateReadiness();

  if (isLoading) {
    return (
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Gate / Readiness Summary</div>
          <div className="panel-sub">Loading…</div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Gate / Readiness Summary</div>
          <div className="panel-sub">Failed to load.</div>
        </section>
      </div>
    );
  }

  const current = data?.current ?? [
    { stageName: "Concept", projectCount: 0 },
    { stageName: "Prototype", projectCount: 0 },
    { stageName: "Pilot", projectCount: 0 },
    { stageName: "Release", projectCount: 0 },
  ];
  const oneMonthAgo = data?.oneMonthAgo ?? [
    { stageName: "Concept", projectCount: 0 },
    { stageName: "Prototype", projectCount: 0 },
    { stageName: "Pilot", projectCount: 0 },
    { stageName: "Release", projectCount: 0 },
  ];

  return (
    <div className="vision-row">
      <section className="panel-light">
        <div className="panel-header">Gate / Readiness Summary</div>
        <div className="panel-sub">
          Program readiness by gate plus design maturity & qualification yields.
        </div>

        <div className="gate-charts-row">
          <StageBarChart data={current} title="Active projects by stage (current)" />
          <StageBarChart data={oneMonthAgo} title="Active projects by stage (1 month ago)" />
        </div>

        <div className="maturity-grid">
          <div className="maturity-card">
            <div className="maturity-title">Design Maturity</div>
            <div className="maturity-metric">Specs frozen: {data?.specsFrozen != null ? data.specsFrozen : "--"}</div>
            <div className="maturity-metric">Design reviews closed: {data?.designReviewsClosed != null ? data.designReviewsClosed : "--"}</div>
          </div>
          <div className="maturity-card">
            <div className="maturity-title">Qualification Yields</div>
            <div className="maturity-metric">Tool qual yield: {data?.toolQualYield != null ? data.toolQualYield : "--"}</div>
            <div className="maturity-metric">Fab acceptance: {data?.fabAcceptance != null ? data.fabAcceptance : "--"}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
