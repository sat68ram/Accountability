import React, { useState } from "react";
import { useRevenueSummary } from "../../hooks/useRevenue";
import { getCurrentYearAndQuarter } from "../../hooks/useVisionSummary";
import {
  CompanyRevenueOverview,
  RevenueByBusinessSegment,
  RevenueByProductLine,
  RevenueByProductSku,
  RevenueByRegion,
  RevenueByCustomer,
} from "../../components/revenue";

export default function Revenue() {
  const [periodType, setPeriodType] = useState("QUARTER");

  const { year, quarter } = getCurrentYearAndQuarter();
  const [periodLabel, setPeriodLabel] = useState(quarter);
  const yearLabel = year;

  const quarterQuery = useRevenueSummary(periodType, periodLabel);
  const yearQuery = useRevenueSummary("YEAR", yearLabel);

  const isLoading = quarterQuery.isLoading || yearQuery.isLoading;
  const error = quarterQuery.error || yearQuery.error;

  if (isLoading) {
    return <div className="screen company-vision">Loading…</div>;
  }

  if (error) {
    return (
      <div className="screen company-vision">
        <div className="panel-light">Failed to load Revenue data</div>
      </div>
    );
  }

  const quarterData = quarterQuery.data ?? {};
  const yearData = yearQuery.data ?? {};

  const metrics = quarterData.metrics ?? [];
  const yearMetrics = yearData.metrics ?? [];

  const metricByName = (name) =>
    metrics.find((m) => m.METRIC_NAME === name) || {};
  const yearMetricByName = (name) =>
    yearMetrics.find((m) => m.METRIC_NAME === name) || {};

  const ytdMetric = yearMetricByName("YTD Revenue");
  const yoyMetric = metricByName("YoY Growth");
  const qoqMetric = metricByName("QoQ Growth");

  const businessSegments = quarterData.businessSegments ?? [];
  const productLines = quarterData.productLines ?? [];
  const productSKUs = quarterData.productSKUs ?? [];
  const revenueByRegion = quarterData.revenueByRegion ?? [];
  const revenueByCustomer = quarterData.revenueByCustomer ?? [];

  return (
    <div className="vision-layout">
      <CompanyRevenueOverview
        ytdMetric={ytdMetric}
        yoyMetric={yoyMetric}
        qoqMetric={qoqMetric}
      />

      <RevenueByBusinessSegment businessSegments={businessSegments} />

      <RevenueByProductLine productLines={productLines} />

      <RevenueByProductSku productSKUs={productSKUs} />

      <div className="vision-row vision-row-2" style={{ overflow: "auto" }}>
        <RevenueByRegion revenueByRegion={revenueByRegion} />
        <RevenueByCustomer revenueByCustomer={revenueByCustomer} />
      </div>
    </div>
  );
}
