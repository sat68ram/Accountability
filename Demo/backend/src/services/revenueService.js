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

export async function getBusinessSegments(periodType, periodLabel) {
  let dateFilter;
  let periodValue;
  
  if (periodType === 'QUARTER') {
    // periodLabel format: "2025-Q1", need both year and quarter
    const yearMatch = periodLabel.match(/(\d+)-Q/);
    const quarterMatch = periodLabel.match(/Q(\d+)/);
    if (yearMatch && quarterMatch) {
      dateFilter = 'f.YEAR = ? AND f.QUARTER = ?';
      periodValue = [parseInt(yearMatch[1]), parseInt(quarterMatch[1])];
    } else {
      return [];
    }
  } else if (periodType === 'YEAR') {
    dateFilter = 'f.YEAR = ?';
    periodValue = parseInt(periodLabel);
  } else {
    dateFilter = 'f.MONTH = ?';
    periodValue = parseInt(periodLabel.split('-')[1]); // Extract month from "YYYY-MM"
  }

  if (!periodValue) {
    return [];
  }

  // Using PRODUCT_LINE as business segment since there's no explicit business segment dimension
  const sql = `
    SELECT 
      COALESCE(pl.PRODUCT_LINE_NAME, f.PRODUCT_LINE_ID) AS BUSINESS_SEGMENT,
      SUM(f.NET_REVENUE_USD) AS REVENUE,
      AVG((1 - COALESCE(f.DISCOUNT_RATE, 0)) * 100) AS OPERATING_MARGIN
    FROM EM_DB.REVENUE.FACT_REVENUE f
    LEFT JOIN EM_DB.REVENUE.DIM_PRODUCT_LINE pl ON f.PRODUCT_LINE_ID = pl.PRODUCT_LINE_ID
    WHERE f.NET_REVENUE_USD IS NOT NULL
      AND ${dateFilter}
    GROUP BY COALESCE(pl.PRODUCT_LINE_NAME, f.PRODUCT_LINE_ID)
    ORDER BY REVENUE DESC;
  `;
  return Array.isArray(periodValue) ? query(sql, periodValue) : query(sql, [periodValue]);
}

export async function getProductLines(periodType, periodLabel) {
  let dateFilter;
  let periodValue;
  
  if (periodType === 'QUARTER') {
    const yearMatch = periodLabel.match(/(\d+)-Q/);
    const quarterMatch = periodLabel.match(/Q(\d+)/);
    if (yearMatch && quarterMatch) {
      dateFilter = 'f.YEAR = ? AND f.QUARTER = ?';
      periodValue = [parseInt(yearMatch[1]), parseInt(quarterMatch[1])];
    } else {
      return [];
    }
  } else if (periodType === 'YEAR') {
    dateFilter = 'f.YEAR = ?';
    periodValue = parseInt(periodLabel);
  } else {
    dateFilter = 'f.MONTH = ?';
    periodValue = parseInt(periodLabel.split('-')[1]);
  }

  if (!periodValue) {
    return [];
  }

  const sql = `
    SELECT 
      COALESCE(pl.PRODUCT_LINE_NAME, f.PRODUCT_LINE_ID) AS PRODUCT_LINE,
      SUM(f.NET_REVENUE_USD) AS REVENUE,
      AVG(f.GROSS_PRICE_USD) AS AVG_SELLING_PRICE,
      COUNT(DISTINCT f.ORDER_ID) AS SHIPMENT_COUNT
    FROM EM_DB.REVENUE.FACT_REVENUE f
    LEFT JOIN EM_DB.REVENUE.DIM_PRODUCT_LINE pl ON f.PRODUCT_LINE_ID = pl.PRODUCT_LINE_ID
    WHERE f.NET_REVENUE_USD IS NOT NULL
      AND f.PRODUCT_LINE_ID IS NOT NULL
      AND ${dateFilter}
    GROUP BY COALESCE(pl.PRODUCT_LINE_NAME, f.PRODUCT_LINE_ID)
    ORDER BY REVENUE DESC;
  `;
  return Array.isArray(periodValue) ? query(sql, periodValue) : query(sql, [periodValue]);
}

export async function getProductSKUs(periodType, periodLabel) {
  let dateFilter;
  let periodValue;
  
  if (periodType === 'QUARTER') {
    const yearMatch = periodLabel.match(/(\d+)-Q/);
    const quarterMatch = periodLabel.match(/Q(\d+)/);
    if (yearMatch && quarterMatch) {
      dateFilter = 'f.YEAR = ? AND f.QUARTER = ?';
      periodValue = [parseInt(yearMatch[1]), parseInt(quarterMatch[1])];
    } else {
      return [];
    }
  } else if (periodType === 'YEAR') {
    dateFilter = 'f.YEAR = ?';
    periodValue = parseInt(periodLabel);
  } else {
    dateFilter = 'f.MONTH = ?';
    periodValue = parseInt(periodLabel.split('-')[1]);
  }

  if (!periodValue) {
    return [];
  }

  const sql = `
    SELECT 
      COALESCE(p.PRODUCT_NAME, f.PRODUCT_ID) AS SKU,
      f.GROSS_PRICE_USD AS SELLING_PRICE,
      COALESCE(f.DISCOUNT_RATE * 100, 0) AS DISCOUNT_APPLIED
    FROM EM_DB.REVENUE.FACT_REVENUE f
    LEFT JOIN EM_DB.REVENUE.DIM_PRODUCT p ON f.PRODUCT_ID = p.PRODUCT_ID
    WHERE f.NET_REVENUE_USD IS NOT NULL
      AND f.PRODUCT_ID IS NOT NULL
      AND ${dateFilter}
    ORDER BY f.GROSS_PRICE_USD DESC
    LIMIT 20;
  `;
  return Array.isArray(periodValue) ? query(sql, periodValue) : query(sql, [periodValue]);
}

export async function getRevenueByRegion(periodType, periodLabel) {
  let dateFilter;
  let periodValue;
  
  if (periodType === 'QUARTER') {
    const yearMatch = periodLabel.match(/(\d+)-Q/);
    const quarterMatch = periodLabel.match(/Q(\d+)/);
    if (yearMatch && quarterMatch) {
      dateFilter = 'f.YEAR = ? AND f.QUARTER = ?';
      periodValue = [parseInt(yearMatch[1]), parseInt(quarterMatch[1])];
    } else {
      return [];
    }
  } else if (periodType === 'YEAR') {
    dateFilter = 'f.YEAR = ?';
    periodValue = parseInt(periodLabel);
  } else {
    dateFilter = 'f.MONTH = ?';
    periodValue = parseInt(periodLabel.split('-')[1]);
  }

  if (!periodValue) {
    return [];
  }

  const sql = `
    SELECT 
      COALESCE(r.REGION_NAME, f.REGION_ID) AS REGION,
      SUM(f.NET_REVENUE_USD) AS REVENUE
    FROM EM_DB.REVENUE.FACT_REVENUE f
    LEFT JOIN EM_DB.REVENUE.DIM_REGION r ON f.REGION_ID = r.REGION_ID
    WHERE f.NET_REVENUE_USD IS NOT NULL
      AND f.REGION_ID IS NOT NULL
      AND ${dateFilter}
    GROUP BY COALESCE(r.REGION_NAME, f.REGION_ID)
    ORDER BY REVENUE DESC;
  `;
  return Array.isArray(periodValue) ? query(sql, periodValue) : query(sql, [periodValue]);
}

export async function getRevenueByCustomer(periodType, periodLabel) {
  let dateFilter;
  let periodValue;
  
  if (periodType === 'QUARTER') {
    const yearMatch = periodLabel.match(/(\d+)-Q/);
    const quarterMatch = periodLabel.match(/Q(\d+)/);
    if (yearMatch && quarterMatch) {
      dateFilter = 'f.YEAR = ? AND f.QUARTER = ?';
      periodValue = [parseInt(yearMatch[1]), parseInt(quarterMatch[1])];
    } else {
      return [];
    }
  } else if (periodType === 'YEAR') {
    dateFilter = 'f.YEAR = ?';
    periodValue = parseInt(periodLabel);
  } else {
    dateFilter = 'f.MONTH = ?';
    periodValue = parseInt(periodLabel.split('-')[1]);
  }

  if (!periodValue) {
    return [];
  }

  const sql = `
    SELECT 
      COALESCE(c.CUSTOMER_NAME, f.CUSTOMER_ID) AS CUSTOMER,
      SUM(f.NET_REVENUE_USD) AS REVENUE
    FROM EM_DB.REVENUE.FACT_REVENUE f
    LEFT JOIN EM_DB.REVENUE.DIM_CUSTOMER c ON f.CUSTOMER_ID = c.CUSTOMER_ID
    WHERE f.NET_REVENUE_USD IS NOT NULL
      AND f.CUSTOMER_ID IS NOT NULL
      AND ${dateFilter}
    GROUP BY COALESCE(c.CUSTOMER_NAME, f.CUSTOMER_ID)
    ORDER BY REVENUE DESC
    LIMIT 10;
  `;
  return Array.isArray(periodValue) ? query(sql, periodValue) : query(sql, [periodValue]);
}

export async function getRevenueSummary(periodType, periodLabel) {
  const [metrics, businessSegments, productLines, productSKUs, revenueByRegion, revenueByCustomer] = await Promise.all([
    getMetrics(periodType, periodLabel),
    getBusinessSegments(periodType, periodLabel),
    getProductLines(periodType, periodLabel),
    getProductSKUs(periodType, periodLabel),
    getRevenueByRegion(periodType, periodLabel),
    getRevenueByCustomer(periodType, periodLabel)
  ]);

  return {
    metrics,
    businessSegments,
    productLines,
    productSKUs,
    revenueByRegion,
    revenueByCustomer
  };
}



