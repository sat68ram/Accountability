import { query } from '../db.js';

export async function getMetrics(periodType, periodLabel) {
  const sql = `
    SELECT METRIC_NAME, VALUE_NUM, VALUE_UNIT, TARGET_NUM, TARGET_UNIT, HEALTH_STATUS
    FROM EM_DB.METRICS.FACT_PORTFOLIO_METRIC
    WHERE PERIOD_TYPE = ? AND PERIOD_LABEL = ?
    ORDER BY METRIC_NAME;
  `;
  return query(sql, [periodType, periodLabel]);
}


export async function getActionItems() {
  const sql = `
    SELECT
      ACTION_ID,
      TITLE,
      DESCRIPTION,
      STATUS,
      PRIORITY,
      ASSIGNEE_NAME,
      ASSIGNER_NAME,
      DUE_DATE,
      CONTEXT_SCREEN,
      CONTEXT_METRIC_NAME
    FROM EM_DB.GOVERNANCE.ACTION_ITEMS
    WHERE IS_DELETED = FALSE
      AND STATUS NOT IN ('DONE', 'CANCELED')
    ORDER BY
      DUE_DATE,
      PRIORITY,
      STATUS;
  `;

  return await query(sql);
}

export async function createActionItem(action) {
  const sql = `
    INSERT INTO EM_DB.GOVERNANCE.ACTION_ITEMS (
      TITLE,
      DESCRIPTION,
      STATUS,
      PRIORITY,
      ASSIGNEE_NAME,
      ASSIGNEE_EMAIL,
      ASSIGNER_NAME,
      ASSIGNER_EMAIL,
      DUE_DATE,
      CONTEXT_SCREEN,
      CONTEXT_METRIC_NAME
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    action.title,                              // required
    action.description ?? null,
    action.status ?? "OPEN",
    action.priority ?? "MEDIUM",
    action.assigneeName,                       // required
    action.assigneeEmail ?? null,
    action.assignerName ?? null,
    action.assignerEmail ?? null,
    action.dueDate,                            // required
    action.contextScreen ?? null,
    action.contextMetricName ?? null
  ].map(v => (v === undefined ? null : v));     // <-- critical

  console.log("Received Params:", params);
  await query(sql, params);
}

export async function getYearMetrics(periodType, periodLabel) {
  const [metrics] = await Promise.all([
    getMetrics(periodType, periodLabel)
  ]);

  return {
    metrics
  };
}


export async function getVisionSummary(periodType, periodLabel) {
  const [metrics, actionItems] = await Promise.all([
    getMetrics(periodType, periodLabel),
    getActionItems()
  ]);

  return {
    metrics,
    actionItems
  };
}
