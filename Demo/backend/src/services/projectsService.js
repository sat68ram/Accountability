import { query } from '../db.js';

/** Panel 1: Portfolio Overview KPIs (single row) */
export async function getPortfolioOverview() {
  const sql = `
WITH active AS (
  SELECT
    PROJECT_ID,
    START_DATE,
    COALESCE(END_DATE_ACTUAL, END_DATE_PLANNED) AS END_DATE_EFFECTIVE
  FROM PMO_DB.DIMENSIONS.DIM_PROJECT
  WHERE IS_ACTIVE = TRUE
),
fin_to_date AS (
  SELECT
    f.PROJECT_ID,
    SUM(f.BUDGET_MONTHLY_USD) AS budget_to_date_usd,
    SUM(f.ACTUAL_SPEND_USD)   AS actual_to_date_usd
  FROM PMO_DB.FACTS.FACT_FINANCIAL f
  JOIN active a ON a.PROJECT_ID = f.PROJECT_ID
  WHERE f.MONTH <= DATE_TRUNC('MONTH', CURRENT_DATE())
  GROUP BY f.PROJECT_ID
),
latest_progress AS (
  SELECT
    fp.PROJECT_ID,
    fp.SNAPSHOT_DATE,
    fp.STATUS,
    fp.SPI,
    fp.CPI
  FROM PMO_DB.FACTS.FACT_PROGRESS fp
  JOIN active a ON a.PROJECT_ID = fp.PROJECT_ID
  QUALIFY fp.SNAPSHOT_DATE = MAX(fp.SNAPSHOT_DATE) OVER (PARTITION BY fp.PROJECT_ID)
),
risk_open AS (
  SELECT
    r.PROJECT_ID,
    SUM(
      (r.PROBABILITY_PCT / 100.0) *
      CASE r.SEVERITY
        WHEN 'LOW'      THEN 1
        WHEN 'MEDIUM'  THEN 2
        WHEN 'HIGH'    THEN 3
        WHEN 'CRITICAL' THEN 5
        ELSE 1
      END
    ) AS risk_exposure_index
  FROM PMO_DB.FACTS.FACT_RISK r
  JOIN active a ON a.PROJECT_ID = r.PROJECT_ID
  WHERE r.STATUS = 'OPEN'
  GROUP BY r.PROJECT_ID
),
project_kpis AS (
  SELECT
    a.PROJECT_ID,
    DATEDIFF('DAY', a.START_DATE, a.END_DATE_EFFECTIVE) AS duration_days,
    COALESCE(f.budget_to_date_usd, 0) AS budget_to_date_usd,
    COALESCE(f.actual_to_date_usd, 0) AS actual_to_date_usd,
    lp.STATUS AS latest_status,
    COALESCE(ro.risk_exposure_index, 0) AS risk_exposure_index
  FROM active a
  LEFT JOIN fin_to_date f ON f.PROJECT_ID = a.PROJECT_ID
  LEFT JOIN latest_progress lp ON lp.PROJECT_ID = a.PROJECT_ID
  LEFT JOIN risk_open ro ON ro.PROJECT_ID = a.PROJECT_ID
)
SELECT
  COUNT(*) AS total_active_projects,
  ROUND(AVG(duration_days), 1) AS avg_duration_days,
  ROUND(SUM(actual_to_date_usd), 2) AS total_spend_so_far_usd,
  ROUND(100 * AVG(IFF(latest_status = 'ON_TRACK', 1, 0)), 1) AS on_time_pct_so_far,
  ROUND(100 * (SUM(actual_to_date_usd) / NULLIF(SUM(budget_to_date_usd), 0)), 1) AS budget_adherence_pct_so_far,
  ROUND(100 * AVG(IFF(budget_to_date_usd > 0 AND ABS(actual_to_date_usd - budget_to_date_usd) / budget_to_date_usd <= 0.10, 1, 0)), 1) AS pct_projects_within_10pct_budget,
  ROUND(SUM(risk_exposure_index), 3) AS risk_exposure_index_so_far
FROM project_kpis
  `;
  const rows = await query(sql);
  return rows[0] || null;
}

/** Panel 1 ring chart: projects per program */
export async function getProjectsByProgram() {
  const sql = `
SELECT
  p.PROGRAM_ID,
  dp.PROGRAM_NAME,
  COUNT(*) AS PROJECT_COUNT
FROM PMO_DB.DIMENSIONS.DIM_PROJECT p
JOIN PMO_DB.DIMENSIONS.DIM_PROGRAM dp ON dp.PROGRAM_ID = p.PROGRAM_ID
WHERE p.IS_ACTIVE = TRUE
GROUP BY p.PROGRAM_ID, dp.PROGRAM_NAME
ORDER BY PROJECT_COUNT DESC
  `;
  return query(sql);
}

/** Panel 2: Schedule Program Health from FACT_PROGRAM_SCHEDULE_HEALTH (latest snapshot) */
export async function getScheduleHealth() {
  const sql = `
SELECT
  h.PROGRAM_ID,
  dp.PROGRAM_NAME,
  h.SNAPSHOT_DATE,
  h.ACTIVE_PROJECTS,
  h.WEIGHTED_AVG_SPI,
  h.DELAYED_PROJECT_PCT,
  h.SCHEDULE_SCORE,
  h.RAG_STATUS,
  h.TREND_4W
FROM PMO_DB.FACTS.FACT_PROGRAM_SCHEDULE_HEALTH h
LEFT JOIN PMO_DB.DIMENSIONS.DIM_PROGRAM dp ON dp.PROGRAM_ID = h.PROGRAM_ID
WHERE h.SNAPSHOT_DATE = (SELECT MAX(SNAPSHOT_DATE) FROM PMO_DB.FACTS.FACT_PROGRAM_SCHEDULE_HEALTH)
ORDER BY h.RAG_STATUS, h.SCHEDULE_SCORE
  `;
  return query(sql);
}

/** Panel 3: Slippage vs Programs (critical path per program) */
export async function getSlippageByProgram() {
  const sql = `
WITH active_projects AS (
  SELECT p.PROJECT_ID, p.PROJECT_NAME, p.PROGRAM_ID, p.START_DATE, p.END_DATE_PLANNED, p.BUDGET_BASELINE_USD
  FROM PMO_DB.DIMENSIONS.DIM_PROJECT p
  WHERE p.IS_ACTIVE = TRUE
),
latest_progress AS (
  SELECT fp.PROJECT_ID, fp.SNAPSHOT_DATE, fp.SPI, fp.STATUS
  FROM PMO_DB.FACTS.FACT_PROGRESS fp
  JOIN active_projects ap ON ap.PROJECT_ID = fp.PROJECT_ID
  QUALIFY fp.SNAPSHOT_DATE = MAX(fp.SNAPSHOT_DATE) OVER (PARTITION BY fp.PROJECT_ID)
),
project_forecast AS (
  SELECT
    ap.PROGRAM_ID, ap.PROJECT_ID, ap.PROJECT_NAME, ap.BUDGET_BASELINE_USD, ap.START_DATE, ap.END_DATE_PLANNED,
    lp.SNAPSHOT_DATE, lp.SPI, lp.STATUS,
    GREATEST(1, DATEDIFF('DAY', ap.START_DATE, ap.END_DATE_PLANNED)) AS planned_duration_days,
    CASE
      WHEN lp.SPI IS NULL OR lp.SPI <= 0 THEN ap.END_DATE_PLANNED
      ELSE DATEADD('DAY', CEIL(DATEDIFF('DAY', ap.START_DATE, ap.END_DATE_PLANNED) / lp.SPI), ap.START_DATE)
    END AS forecast_finish_date,
    DATEDIFF('DAY',
      CASE WHEN lp.SPI IS NULL OR lp.SPI <= 0 THEN ap.END_DATE_PLANNED
           ELSE DATEADD('DAY', CEIL(DATEDIFF('DAY', ap.START_DATE, ap.END_DATE_PLANNED) / lp.SPI), ap.START_DATE) END,
      ap.END_DATE_PLANNED
    ) AS slack_days,
    DATEDIFF('DAY', ap.END_DATE_PLANNED,
      CASE WHEN lp.SPI IS NULL OR lp.SPI <= 0 THEN ap.END_DATE_PLANNED
           ELSE DATEADD('DAY', CEIL(DATEDIFF('DAY', ap.START_DATE, ap.END_DATE_PLANNED) / lp.SPI), ap.START_DATE) END
    ) AS projected_delay_days
  FROM active_projects ap
  LEFT JOIN latest_progress lp ON lp.PROJECT_ID = ap.PROJECT_ID
),
critical_project AS (
  SELECT * FROM project_forecast
  QUALIFY ROW_NUMBER() OVER (PARTITION BY PROGRAM_ID ORDER BY projected_delay_days DESC, BUDGET_BASELINE_USD DESC) = 1
),
program_rollup AS (
  SELECT
    pf.PROGRAM_ID,
    COUNT(*) AS active_projects,
    ROUND(AVG(pf.projected_delay_days), 1) AS avg_project_delay_days,
    MAX(pf.projected_delay_days) AS worst_project_delay_days,
    ROUND(100 * AVG(IFF(pf.STATUS = 'ON_TRACK', 1, 0)), 1) AS on_time_project_pct
  FROM project_forecast pf
  GROUP BY 1
)
SELECT
  pr.PROGRAM_ID,
  dp.PROGRAM_NAME,
  pr.active_projects,
  cp.PROJECT_ID AS critical_project_id,
  cp.PROJECT_NAME AS critical_project_name,
  cp.SNAPSHOT_DATE AS critical_snapshot_date,
  cp.SPI AS critical_spi,
  cp.END_DATE_PLANNED AS critical_planned_finish,
  cp.forecast_finish_date AS critical_forecast_finish,
  cp.slack_days AS critical_slack_days,
  cp.projected_delay_days AS critical_projected_delay_days,
  pr.avg_project_delay_days,
  pr.worst_project_delay_days,
  pr.on_time_project_pct,
  CASE
    WHEN cp.slack_days >= 7  THEN 'GREEN'
    WHEN cp.slack_days >= -7 THEN 'YELLOW'
    ELSE 'RED'
  END AS status
FROM program_rollup pr
JOIN PMO_DB.DIMENSIONS.DIM_PROGRAM dp ON dp.PROGRAM_ID = pr.PROGRAM_ID
JOIN critical_project cp ON cp.PROGRAM_ID = pr.PROGRAM_ID
ORDER BY status, cp.slack_days ASC, dp.PROGRAM_NAME
  `;
  return query(sql);
}

/** Panel 4: Portfolio budget vs actual by month */
export async function getBudgetVsActualByMonth() {
  const sql = `
SELECT
  f.MONTH,
  ROUND(SUM(f.BUDGET_MONTHLY_USD), 2) AS budget_usd,
  ROUND(SUM(f.ACTUAL_SPEND_USD), 2) AS actual_usd,
  ROUND(SUM(f.ACTUAL_SPEND_USD) - SUM(f.BUDGET_MONTHLY_USD), 2) AS variance_usd,
  ROUND(100 * (SUM(f.ACTUAL_SPEND_USD) / NULLIF(SUM(f.BUDGET_MONTHLY_USD), 0)), 1) AS actual_vs_budget_pct
FROM PMO_DB.FACTS.FACT_FINANCIAL f
JOIN PMO_DB.DIMENSIONS.DIM_PROJECT p ON p.PROJECT_ID = f.PROJECT_ID
WHERE p.IS_ACTIVE = TRUE AND f.MONTH <= DATE_TRUNC('MONTH', CURRENT_DATE())
GROUP BY 1
ORDER BY 1
  `;
  return query(sql);
}

/** Panel 5: EV/AC/PV by program */
export async function getEvAcPv() {
  const sql = `
WITH program_month AS (
  WITH active_projects AS (
    SELECT PROJECT_ID, PROGRAM_ID FROM PMO_DB.DIMENSIONS.DIM_PROJECT WHERE IS_ACTIVE = TRUE
  ),
  progress_proj_month AS (
    SELECT ap.PROGRAM_ID, fp.PROJECT_ID, DATE_TRUNC('MONTH', fp.SNAPSHOT_DATE) AS MONTH, fp.SNAPSHOT_DATE, fp.EV_USD, fp.PV_USD
    FROM PMO_DB.FACTS.FACT_PROGRESS fp
    JOIN active_projects ap ON ap.PROJECT_ID = fp.PROJECT_ID
    QUALIFY ROW_NUMBER() OVER (PARTITION BY fp.PROJECT_ID, DATE_TRUNC('MONTH', fp.SNAPSHOT_DATE) ORDER BY fp.SNAPSHOT_DATE DESC) = 1
  ),
  evpv_program_month AS (
    SELECT PROGRAM_ID, MONTH, SUM(EV_USD) AS EV_USD, SUM(PV_USD) AS PV_USD
    FROM progress_proj_month
    GROUP BY 1, 2
  ),
  ac_program_month AS (
    SELECT p.PROGRAM_ID, f.MONTH, SUM(f.ACTUAL_SPEND_USD) AS AC_USD
    FROM PMO_DB.FACTS.FACT_FINANCIAL f
    JOIN PMO_DB.DIMENSIONS.DIM_PROJECT p ON p.PROJECT_ID = f.PROJECT_ID
    WHERE p.IS_ACTIVE = TRUE
    GROUP BY 1, 2
  )
  SELECT e.PROGRAM_ID, e.MONTH, e.PV_USD, e.EV_USD, COALESCE(a.AC_USD, 0) AS AC_USD
  FROM evpv_program_month e
  LEFT JOIN ac_program_month a ON a.PROGRAM_ID = e.PROGRAM_ID AND a.MONTH = e.MONTH
  WHERE e.MONTH <= DATE_TRUNC('MONTH', CURRENT_DATE())
),
program_to_date AS (
  SELECT
    PROGRAM_ID,
    ROUND(SUM(PV_USD), 2) AS PV_TD_USD,
    ROUND(SUM(EV_USD), 2) AS EV_TD_USD,
    ROUND(SUM(AC_USD), 2) AS AC_TD_USD,
    ROUND(SUM(EV_USD) - SUM(PV_USD), 2) AS SV_TD_USD,
    ROUND(SUM(EV_USD) - SUM(AC_USD), 2) AS CV_TD_USD,
    ROUND(SUM(EV_USD) / NULLIF(SUM(PV_USD), 0), 3) AS SPI_TD,
    ROUND(SUM(EV_USD) / NULLIF(SUM(AC_USD), 0), 3) AS CPI_TD
  FROM program_month
  GROUP BY 1
)
SELECT
  t.PROGRAM_ID,
  dp.PROGRAM_NAME,
  t.PV_TD_USD, t.EV_TD_USD, t.AC_TD_USD, t.SV_TD_USD, t.CV_TD_USD, t.SPI_TD, t.CPI_TD,
  CASE WHEN t.CV_TD_USD >= 0 THEN 'UNDER_OR_ON_COST' ELSE 'OVER_COST' END AS COST_POSITION,
  CASE
    WHEN t.SPI_TD >= 0.95 AND t.CPI_TD >= 0.95 THEN 'GREEN'
    WHEN t.SPI_TD >= 0.90 AND t.CPI_TD >= 0.90 THEN 'YELLOW'
    ELSE 'RED'
  END AS STATUS
FROM program_to_date t
JOIN PMO_DB.DIMENSIONS.DIM_PROGRAM dp ON dp.PROGRAM_ID = t.PROGRAM_ID
ORDER BY STATUS, t.CV_TD_USD ASC, t.SV_TD_USD ASC
  `;
  return query(sql);
}

/** Panel 6: Utilization by team by quarter */
export async function getUtilizationByTeamByQuarter() {
  const sql = `
SELECT
  r.TEAM_ID,
  t.TEAM_NAME,
  TO_CHAR(r.MONTH, 'YYYY') || '-Q' || TO_CHAR(r.MONTH, 'Q') AS QUARTER_LABEL,
  DATE_TRUNC('QUARTER', r.MONTH) AS QUARTER_START,
  ROUND(SUM(r.HOURS_ALLOCATED), 2) AS hours_allocated,
  ROUND(SUM(r.HOURS_USED), 2) AS hours_used,
  ROUND(SUM(r.HOURS_USED) / NULLIF(SUM(r.HOURS_ALLOCATED), 0), 3) AS utilization_ratio,
  ROUND(100 * SUM(r.HOURS_USED) / NULLIF(SUM(r.HOURS_ALLOCATED), 0), 1) AS utilization_pct
FROM PMO_DB.FACTS.FACT_RESOURCE r
JOIN PMO_DB.DIMENSIONS.DIM_TEAM t ON t.TEAM_ID = r.TEAM_ID
GROUP BY 1, 2, 3, 4
ORDER BY t.TEAM_NAME, QUARTER_START
  `;
  return query(sql);
}

/** Panel 7: Critical resources / constrained teams (next 2 quarters) */
export async function getConstrainedTeams() {
  const sql = `
WITH next_2q AS (
  SELECT DATE_TRUNC('QUARTER', CURRENT_DATE()) AS q_start,
         DATEADD('QUARTER', 2, DATE_TRUNC('QUARTER', CURRENT_DATE())) AS q_end
),
team_load AS (
  SELECT r.TEAM_ID,
    SUM(r.HOURS_ALLOCATED) AS hours_allocated,
    SUM(r.HOURS_USED) AS hours_used,
    ROUND(SUM(r.HOURS_USED) / NULLIF(SUM(r.HOURS_ALLOCATED), 0), 3) AS utilization_ratio
  FROM PMO_DB.FACTS.FACT_RESOURCE r, next_2q q
  WHERE r.MONTH >= q.q_start AND r.MONTH < q.q_end
  GROUP BY r.TEAM_ID
),
latest_progress AS (
  SELECT fp.PROJECT_ID, fp.SPI
  FROM PMO_DB.FACTS.FACT_PROGRESS fp
  QUALIFY fp.SNAPSHOT_DATE = MAX(fp.SNAPSHOT_DATE) OVER (PARTITION BY fp.PROJECT_ID)
),
at_risk_projects AS (
  SELECT PROJECT_ID, SPI FROM latest_progress WHERE SPI < 0.95
),
team_risk_impact AS (
  SELECT fr.TEAM_ID,
    COUNT(DISTINCT fr.PROJECT_ID) AS at_risk_projects_supported,
    ROUND(AVG(ar.SPI), 3) AS avg_spi_supported
  FROM PMO_DB.FACTS.FACT_RESOURCE fr
  JOIN at_risk_projects ar ON ar.PROJECT_ID = fr.PROJECT_ID
  GROUP BY fr.TEAM_ID
)
SELECT
  tl.TEAM_ID,
  dt.TEAM_NAME,
  ROUND(100 * tl.utilization_ratio, 1) AS utilization_pct_next_2q,
  COALESCE(tr.at_risk_projects_supported, 0) AS at_risk_projects_supported,
  COALESCE(tr.avg_spi_supported, 1.000) AS avg_spi_of_supported_projects,
  ROUND((tl.utilization_ratio - 1) * COALESCE(tr.at_risk_projects_supported, 0), 2) AS constraint_risk_score
FROM team_load tl
JOIN PMO_DB.DIMENSIONS.DIM_TEAM dt ON dt.TEAM_ID = tl.TEAM_ID
LEFT JOIN team_risk_impact tr ON tr.TEAM_ID = tl.TEAM_ID
WHERE tl.utilization_ratio > 1.0
ORDER BY constraint_risk_score DESC NULLS LAST
  `;
  return query(sql);
}

/** Panel 8: Risk bubble (program-level risk exposure) */
export async function getRiskBubble() {
  const sql = `
WITH open_risks AS (
  SELECT
      p.PROGRAM_ID,
      r.PROJECT_ID,
      r.RISK_ID,
      r.PROBABILITY_PCT,
      r.SEVERITY,
      r.IMPACT_USD
  FROM PMO_DB.FACTS.FACT_RISK r
  JOIN PMO_DB.DIMENSIONS.DIM_PROJECT p
      ON p.PROJECT_ID = r.PROJECT_ID
  WHERE UPPER(r.STATUS) = 'OPEN'
),

normalized AS (
  SELECT
      PROGRAM_ID,
      PROBABILITY_PCT,
      IMPACT_USD,

      -- Financial weight (1–5)
      NTILE(5) OVER (ORDER BY IMPACT_USD) AS financial_weight,

      -- Severity weight
      CASE UPPER(SEVERITY)
          WHEN 'LOW' THEN 1
          WHEN 'MEDIUM' THEN 2
          WHEN 'HIGH' THEN 4
          WHEN 'CRITICAL' THEN 5
          ELSE 1
      END AS severity_weight
  FROM open_risks
),

risk_scored AS (
  SELECT
      PROGRAM_ID,
      PROBABILITY_PCT,
      IMPACT_USD,
      -- Combined impact weight (1–5 range)
      ROUND(
          (financial_weight * 0.6) +
          (severity_weight * 0.4)
      , 2) AS impact_weight
  FROM normalized
)

SELECT
  rs.PROGRAM_ID,
  dp.PROGRAM_NAME,

  ROUND(AVG(rs.PROBABILITY_PCT), 1) AS avg_likelihood_pct,
  ROUND(AVG(rs.impact_weight), 2) AS avg_impact_score,
  ROUND(AVG(rs.IMPACT_USD), 0) AS avg_impact_usd,
  COUNT(*) AS open_risk_count,

  ROUND(
      AVG(rs.PROBABILITY_PCT)/100
      * AVG(rs.impact_weight)
      * COUNT(*)
  , 2) AS risk_exposure_index,

  CASE
    WHEN AVG(rs.impact_weight) >= 4 THEN 'HIGH'
    WHEN AVG(rs.impact_weight) >= 2.5 THEN 'MEDIUM'
    ELSE 'LOW'
  END AS risk_level

FROM risk_scored rs
JOIN PMO_DB.DIMENSIONS.DIM_PROGRAM dp
  ON dp.PROGRAM_ID = rs.PROGRAM_ID

GROUP BY rs.PROGRAM_ID, dp.PROGRAM_NAME
ORDER BY risk_exposure_index DESC;

  `;
  return query(sql);
}

/** Panel 9: Project Risks & Exceptions – two bar charts (opened by month + actively open by month) + table */
export async function getProjectRisksExceptions() {
  const sqlOpenedByMonth = `
WITH risk_base AS (
  SELECT
    CASE
      WHEN UPPER(r.SEVERITY) = 'CRITICAL' THEN 'CRITICAL'
      WHEN UPPER(r.SEVERITY) = 'HIGH' AND COALESCE(r.IMPACT_USD, 0) > 10000000 THEN 'MAJOR'
    END AS RISK_LEVEL,
    r.OPEN_DATE,
    r.CLOSE_DATE
  FROM PMO_DB.FACTS.FACT_RISK r
  WHERE (UPPER(r.SEVERITY) = 'CRITICAL' OR (UPPER(r.SEVERITY) = 'HIGH' AND r.IMPACT_USD > 10000000))
    AND r.OPEN_DATE IS NOT NULL
),
bucketed AS (
  SELECT
    DATE_TRUNC('MONTH', OPEN_DATE) AS OPEN_MONTH,
    RISK_LEVEL
  FROM risk_base
  WHERE RISK_LEVEL IS NOT NULL
    AND DATE_TRUNC('MONTH', OPEN_DATE) >= DATEADD('MONTH', -3, DATE_TRUNC('MONTH', CURRENT_DATE()))
    AND DATE_TRUNC('MONTH', OPEN_DATE) <= DATE_TRUNC('MONTH', CURRENT_DATE())
)
SELECT
  OPEN_MONTH,
  COUNT(CASE WHEN RISK_LEVEL = 'CRITICAL' THEN 1 END) AS CRITICAL_COUNT,
  COUNT(CASE WHEN RISK_LEVEL = 'MAJOR' THEN 1 END) AS MAJOR_COUNT
FROM bucketed
GROUP BY OPEN_MONTH
ORDER BY OPEN_MONTH
  `;
  const sqlActivelyOpenByMonth = `
WITH risk_base AS (
  SELECT
    CASE
      WHEN UPPER(r.SEVERITY) = 'CRITICAL' THEN 'CRITICAL'
      WHEN UPPER(r.SEVERITY) = 'HIGH' AND COALESCE(r.IMPACT_USD, 0) > 10000000 THEN 'MAJOR'
    END AS RISK_LEVEL,
    r.OPEN_DATE,
    r.CLOSE_DATE
  FROM PMO_DB.FACTS.FACT_RISK r
  WHERE (UPPER(r.SEVERITY) = 'CRITICAL' OR (UPPER(r.SEVERITY) = 'HIGH' AND r.IMPACT_USD > 10000000))
    AND r.OPEN_DATE IS NOT NULL
),
month_ends AS (
  SELECT DATE_TRUNC('MONTH', CURRENT_DATE()) AS month_start,
         LAST_DAY(DATE_TRUNC('MONTH', CURRENT_DATE()), 'MONTH') AS month_end
  UNION ALL
  SELECT DATEADD('MONTH', -1, DATE_TRUNC('MONTH', CURRENT_DATE())),
         LAST_DAY(DATEADD('MONTH', -1, CURRENT_DATE()), 'MONTH')
  UNION ALL
  SELECT DATEADD('MONTH', -2, DATE_TRUNC('MONTH', CURRENT_DATE())),
         LAST_DAY(DATEADD('MONTH', -2, CURRENT_DATE()), 'MONTH')
  UNION ALL
  SELECT DATEADD('MONTH', -3, DATE_TRUNC('MONTH', CURRENT_DATE())),
         LAST_DAY(DATEADD('MONTH', -3, CURRENT_DATE()), 'MONTH')
),
actively_open AS (
  SELECT
    me.month_start,
    rb.RISK_LEVEL
  FROM month_ends me
  CROSS JOIN risk_base rb
  WHERE rb.RISK_LEVEL IS NOT NULL
    AND rb.OPEN_DATE <= me.month_end
    AND (rb.CLOSE_DATE IS NULL OR rb.CLOSE_DATE > me.month_end)
)
SELECT
  month_start AS MONTH_END,
  COUNT(CASE WHEN RISK_LEVEL = 'CRITICAL' THEN 1 END) AS CRITICAL_COUNT,
  COUNT(CASE WHEN RISK_LEVEL = 'MAJOR' THEN 1 END) AS MAJOR_COUNT
FROM actively_open
GROUP BY month_start
ORDER BY month_start
  `;
  const sqlSummary = `
WITH classified AS (
  SELECT
    r.RISK_ID,
    r.OPEN_DATE,
    r.CLOSE_DATE,
    r.STATUS,
    CASE
      WHEN UPPER(r.SEVERITY) = 'CRITICAL' THEN 'CRITICAL'
      WHEN UPPER(r.SEVERITY) = 'HIGH' AND COALESCE(r.IMPACT_USD, 0) > 10000000 THEN 'MAJOR'
    END AS RISK_LEVEL
  FROM PMO_DB.FACTS.FACT_RISK r
  WHERE r.OPEN_DATE IS NOT NULL
)
SELECT
  COUNT(CASE WHEN RISK_LEVEL = 'CRITICAL' AND OPEN_DATE >= DATEADD('DAY', -30, CURRENT_DATE()) THEN 1 END) AS CRITICAL_LAST_30,
  COUNT(CASE WHEN RISK_LEVEL = 'CRITICAL' AND (CLOSE_DATE IS NULL OR UPPER(STATUS) = 'OPEN') THEN 1 END) AS CRITICAL_OPEN,
  COUNT(CASE WHEN RISK_LEVEL = 'MAJOR' AND OPEN_DATE >= DATEADD('DAY', -30, CURRENT_DATE()) THEN 1 END) AS MAJOR_LAST_30,
  COUNT(CASE WHEN RISK_LEVEL = 'MAJOR' AND (CLOSE_DATE IS NULL OR UPPER(STATUS) = 'OPEN') THEN 1 END) AS MAJOR_OPEN
FROM classified
WHERE RISK_LEVEL IN ('CRITICAL', 'MAJOR')
  `;

  const [openedRows, activelyOpenRows, summaryRows] = await Promise.all([
    query(sqlOpenedByMonth),
    query(sqlActivelyOpenByMonth),
    query(sqlSummary),
  ]);

  const currentMonth = new Date();
  const months = [
    { offset: -3, label: '3mo ago' },
    { offset: -2, label: '2mo ago' },
    { offset: -1, label: '1mo ago' },
    { offset: 0, label: 'Current' },
  ];

  const toMonthStart = (offset) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    return d.toISOString().slice(0, 7);
  };

  const openedByMonth = months.map((m, i) => {
    const monthKey = toMonthStart(m.offset);
    const row = openedRows.find((r) => {
      const openMonth = r.OPEN_MONTH ?? r.open_month;
      if (!openMonth) return false;
      const d = new Date(openMonth);
      const str = d.toISOString().slice(0, 7);
      return str === monthKey;
    });
    return {
      label: m.label,
      monthKey,
      criticalCount: Number(row?.CRITICAL_COUNT ?? row?.critical_count ?? 0),
      majorCount: Number(row?.MAJOR_COUNT ?? row?.major_count ?? 0),
    };
  });

  const activelyOpenByMonth = months.map((m, i) => {
    const row = activelyOpenRows[i] || activelyOpenRows.find((r) => {
      const me = r.MONTH_END ?? r.month_end;
      if (!me) return false;
      const d = new Date(me);
      const str = d.toISOString().slice(0, 7);
      return str === toMonthStart(m.offset);
    });
    return {
      label: m.label,
      criticalCount: Number(row?.CRITICAL_COUNT ?? row?.critical_count ?? 0),
      majorCount: Number(row?.MAJOR_COUNT ?? row?.major_count ?? 0),
    };
  });

  const s = summaryRows[0] || {};
  return {
    openedByMonth,
    activelyOpenByMonth,
    criticalLast30: Number(s.CRITICAL_LAST_30 ?? s.critical_last_30 ?? 0),
    criticalOpen: Number(s.CRITICAL_OPEN ?? s.critical_open ?? 0),
    majorLast30: Number(s.MAJOR_LAST_30 ?? s.major_last_30 ?? 0),
    majorOpen: Number(s.MAJOR_OPEN ?? s.major_open ?? 0),
  };
}

/** Panel 10: Gate / Readiness Summary – stage distribution (current + 1 month ago) */
export async function getGateReadiness() {
  const sqlCurrent = `
WITH latest_stage AS (
  SELECT
    PROJECT_ID,
    STAGE_ID,
    ROW_NUMBER() OVER (PARTITION BY PROJECT_ID ORDER BY GATE_DATE_ACTUAL DESC NULLS LAST) AS rn
  FROM PMO_DB.FACTS.FACT_STAGE_STATUS
  WHERE GATE_DATE_ACTUAL IS NOT NULL
),
current_stage AS (
  SELECT PROJECT_ID, STAGE_ID
  FROM latest_stage
  WHERE rn = 1
)
SELECT
  sg.STAGE_NAME,
  sg.STAGE_ORDER,
  COUNT(cs.PROJECT_ID) AS PROJECT_COUNT
FROM current_stage cs
JOIN PMO_DB.DIMENSIONS.DIM_STAGE_GATE sg ON cs.STAGE_ID = sg.STAGE_ID
GROUP BY sg.STAGE_NAME, sg.STAGE_ORDER
ORDER BY sg.STAGE_ORDER
  `;
  const sqlOneMonthAgo = `
WITH cutoff AS (
  SELECT LAST_DAY(DATEADD('MONTH', -1, CURRENT_DATE()), 'MONTH') AS end_of_last_month
),
latest_stage_before_cutoff AS (
  SELECT
    fp.PROJECT_ID,
    fp.STAGE_ID,
    ROW_NUMBER() OVER (PARTITION BY fp.PROJECT_ID ORDER BY fp.GATE_DATE_ACTUAL DESC NULLS LAST) AS rn
  FROM PMO_DB.FACTS.FACT_STAGE_STATUS fp
  CROSS JOIN cutoff c
  WHERE fp.GATE_DATE_ACTUAL IS NOT NULL
    AND fp.GATE_DATE_ACTUAL <= c.end_of_last_month
),
stage_one_month_ago AS (
  SELECT PROJECT_ID, STAGE_ID
  FROM latest_stage_before_cutoff
  WHERE rn = 1
)
SELECT
  sg.STAGE_NAME,
  sg.STAGE_ORDER,
  COUNT(s.PROJECT_ID) AS PROJECT_COUNT
FROM stage_one_month_ago s
JOIN PMO_DB.DIMENSIONS.DIM_STAGE_GATE sg ON s.STAGE_ID = sg.STAGE_ID
GROUP BY sg.STAGE_NAME, sg.STAGE_ORDER
ORDER BY sg.STAGE_ORDER
  `;

  const [currentRows, oneMonthAgoRows] = await Promise.all([
    query(sqlCurrent),
    query(sqlOneMonthAgo),
  ]);

  const stagesFromDb = currentRows.length > 0 ? currentRows : oneMonthAgoRows;
  const stageOrder = stagesFromDb.length > 0
    ? [...stagesFromDb].sort((a, b) => (a.STAGE_ORDER ?? a.stage_order ?? 0) - (b.STAGE_ORDER ?? b.stage_order ?? 0))
        .map((r) => (r.STAGE_NAME ?? r.stage_name) || 'Unknown')
    : ['Concept', 'Prototype', 'Pilot', 'Release'];

  const mapToStages = (rows) => {
    return stageOrder.map((name) => {
      const row = rows.find((r) =>
        ((r.STAGE_NAME ?? r.stage_name) || '').toLowerCase().includes((name || '').toLowerCase())
      );
      return {
        stageName: name,
        projectCount: Number(row?.PROJECT_COUNT ?? row?.project_count ?? 0),
      };
    });
  };

  return {
    current: mapToStages(currentRows),
    oneMonthAgo: mapToStages(oneMonthAgoRows),
    specsFrozen: null,
    designReviewsClosed: null,
    toolQualYield: null,
    fabAcceptance: null,
  };
}
