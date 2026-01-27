import { query } from '../db.js';

export async function getMetrics(periodType, periodLabel) {
  const sql = `
    SELECT METRIC_NAME, VALUE_NUM, VALUE_UNIT, TARGET_NUM, TARGET_UNIT, HEALTH_STATUS
    FROM EM_DB.METRICS.FACT_PORTFOLIO_METRIC
    WHERE PERIOD_TYPE = ? AND PERIOD_LABEL = ?
      AND METRIC_NAME IN ( 'YoY Growth', 'QoQ Growth', 'YTD Revenue' )
    ORDER BY METRIC_NAME;
  `;
  return query(sql, [periodType, periodLabel]);
}



