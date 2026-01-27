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

//REvenue by Business Segment
export async function getRevenueBySegment(periodType, periodLabel) {
  const sql = `
    select REVENUE_TYPE, SUM(NET_REVENUE_USD)/1000000, SUM(COGS_USD), 100 * SUM(NET_REVENUE_USD-COGS_USD) / SUM(NET_REVENUE_USD)
      from EM_DB.REVENUE.FACT_REVENUE
      WHERE PERIOD_TYPE = ? AND PERIOD_LABEL = ?
      GROUP BY REVENUE_TYPE ORDER BY REVENUE_TYPE;
  `;
  return query(sql, [periodType, periodLabel]);
}


