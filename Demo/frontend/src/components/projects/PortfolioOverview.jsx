import React from "react";
import { usePortfolioOverview, useProjectsByProgram } from "../../hooks/useProjects";
import { formatCurrency, formatNumber } from "./formatUtils";

const PIE_COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ec4899", "#06b6d4"];

export default function PortfolioOverview() {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = usePortfolioOverview();
  const { data: byProgram = [], isLoading: programLoading, error: programError } = useProjectsByProgram();

  const isLoading = overviewLoading || programLoading;
  const error = overviewError || programError;

  if (isLoading) {
    return (
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Portfolio Overview</div>
          <div className="panel-sub">Loading…</div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vision-row">
        <section className="panel-light">
          <div className="panel-header">Portfolio Overview</div>
          <div className="panel-sub">Failed to load data.</div>
        </section>
      </div>
    );
  }

  const totalProjects = Number(overview?.total_active_projects) || 0;
  const totalCountForPie = byProgram.reduce((sum, r) => sum + Number(r.PROJECT_COUNT || 0), 0) || 1;
  const onTimePct = overview?.on_time_pct_so_far != null ? Number(overview.on_time_pct_so_far) : null;
  const budgetPct = overview?.pct_projects_within_10pct_budget != null ? Number(overview.pct_projects_within_10pct_budget) : null;
  const riskExp = overview?.risk_exposure_index_so_far != null ? Number(overview.risk_exposure_index_so_far) : null;

  const onTimeStatus = onTimePct != null ? (onTimePct >= 80 ? "good" : onTimePct >= 60 ? "warn" : "risk") : "warn";
  const budgetStatus = budgetPct != null ? (budgetPct >= 80 ? "good" : budgetPct >= 60 ? "warn" : "risk") : "warn";
  const riskStatus = riskExp != null ? (riskExp <= 0.5 ? "good" : riskExp <= 1 ? "warn" : "risk") : "risk";

  return (
    <div className="vision-row">
      <section className="panel-light">
        <div className="panel-header">Portfolio Overview</div>
        <div className="panel-sub">
          Timeliness and accountability view across all active projects.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <div className="metric-card metric-good">
            <div className="metric-label">Total Active Projects</div>
            <div className="metric-value">{overview?.total_active_projects != null ? formatNumber(overview.total_active_projects) : "--"}</div>
            <div className="metric-hint">enterprise-wide</div>
          </div>
          <div className="metric-card metric-warn">
            <div className="metric-label">Avg Duration</div>
            <div className="metric-value">
              {overview?.avg_duration_days != null ? Number(overview.avg_duration_days).toFixed(1) : "--"}
              <span> days</span>
            </div>
            <div className="metric-hint">start → GA</div>
          </div>
          <div className="metric-card metric-risk">
            <div className="metric-label">Total Spend YTD</div>
            <div className="metric-value">{formatCurrency(overview?.total_spend_so_far_usd) ?? "--"}</div>
            <div className="metric-hint">capex + opex</div>
          </div>
        </div>

        <div className="chart-pie-wrapper" style={{ marginTop: "16px" }}>
          <div style={{ position: "relative" }}>
            <div className="chart-pie">
              <div className="chart-pie-inner"></div>
            </div>
          </div>
          <div className="chart-pie-legend">
            {byProgram.slice(0, 6).map((row, i) => {
              const count = Number(row.PROJECT_COUNT) || 0;
              const pct = totalCountForPie ? Math.round((100 * count) / totalCountForPie) : 0;
              return (
                <div className="chart-pie-legend-item" key={row.PROGRAM_ID || i}>
                  <span className="chart-pie-swatch" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                  <span>{row.PROGRAM_NAME || "Unknown"} – {pct}%</span>
                </div>
              );
            })}
            {byProgram.length === 0 && (
              <div className="chart-pie-legend-item">
                <span>No program data</span>
              </div>
            )}
          </div>
          <div className="kpi-grid-3" style={{ flex: 1, minWidth: "220px" }}>
            <div className={`metric-card metric-${onTimeStatus}`}>
              <div className="metric-label">On-Time %</div>
              <div className="metric-value">
                {onTimePct != null ? onTimePct.toFixed(0) : "--"}
                <span>%</span>
              </div>
              <div className="metric-hint">% milestones on or before plan</div>
            </div>
            <div className={`metric-card metric-${budgetStatus}`}>
              <div className="metric-label">Budget Adherence %</div>
              <div className="metric-value">
                {budgetPct != null ? budgetPct.toFixed(0) : "--"}
                <span>%</span>
              </div>
              <div className="metric-hint">projects within ±10% of plan</div>
            </div>
            <div className={`metric-card metric-${riskStatus}`}>
              <div className="metric-label">Risk Exposure Index</div>
              <div className="metric-value">{riskExp != null ? riskExp.toFixed(2) : "--"}</div>
              <div className="metric-hint">weighted impact × likelihood</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
