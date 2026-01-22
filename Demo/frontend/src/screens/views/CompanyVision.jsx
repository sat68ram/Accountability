import React, { useState } from "react";
import { useVisionSummary, getCurrentYearAndQuarter, useMetrics } from "../../hooks/useVisionSummary";
import { createActionItem } from "../../api/actionItem.js";
import ActionItemsPanel from "../../components/ActionItemPanel";


export default function CompanyVision({ setScreen }) {
  // --- period state ---
  const [periodType, setPeriodType] = useState("QUARTER");

  const { year, quarter } = getCurrentYearAndQuarter();
  const [periodLabel, setPeriodLabel] = useState(quarter); // default
  
  
  const yearLabel = year;
  
  const quarterQuery = useVisionSummary(periodType, periodLabel);
  
  // 2) Year data (always YEAR + derived label)

  const yearQuery = useMetrics('YEAR', yearLabel);

 
  

  
  const isLoading = quarterQuery.isLoading || yearQuery.isLoading;
  const error = quarterQuery.error || yearQuery.error;

  // const { data, isLoading, error } = useVisionSummary(periodType, periodLabel);

  if (isLoading) {
    return <div className="screen company-vision">Loading…</div>;
  }

  if (error) {
    return (
      <div className="screen company-vision">
        <div className="panel-light">Failed to load Company Vision</div>
      </div>
    );
  }

  // Use these in UI:
  const quarterData = quarterQuery.data;
  const yearData = yearQuery.data.metrics;
  
 const people = [
    { name: "Alice Johnson", email: "alice.johnson@company.com" },
    { name: "Bob Smith", email: "bob.smith@company.com" }
  ];

  const currentUser = {
    name: "COO",
    email: "coo@company.com"
  };

 // const actionItems = []; // replace with API data
 console.log("yearQuery:", yearQuery.status, yearQuery.isLoading, yearQuery.error,yearData);


  const { metrics = [], actionItems = {} } = quarterData;
 

  const yearMetricByName = (metricName) =>
  	(yearData ?? []).find(m => m.METRIC_NAME === metricName) ?? null;

  const metricByName = (name) =>
    metrics.find((m) => m.METRIC_NAME === name) || {};  

  return (
    <div className="screen company-vision">
      <div className="vision-layout">

        {/* ----------------- Row 1 ----------------- */}
        <div className="vision-row ">
          

          <section className="panel-light">
            <div className="panel-header">AI Assistant</div>
            <a href="#" className="link-pill">
              <span>Chat with</span> Enterprise Memory (RAG/LLM)
            </a>
            <div className="panel-sub">
              Ask portfolio questions, drill into programs, and recall decisions
              from your enterprise memory.
            </div>
          </section>
        </div>

        

        {/* ----------------- Row 2 : Financial / Delivery ----------------- */}
        <div className="vision-row vision-row-4">
          <MetricCard
            label="Revenue"
            metric={metricByName("Revenue")}
            yearMetric={yearMetricByName("Revenue")}
            onClick={() => setScreen("revenue")}
          />

          <MetricCard
            label="Profitability"
            metric={metricByName("Profitability")}
            yearMetric={yearMetricByName("Profitability")}
            onClick={() => setScreen("profitability")}
          />

          <MetricCard
            label="Timelines"
            metric={metricByName("Timelines")}
            yearMetric={yearMetricByName("Timelines")}
            onClick={() => setScreen("projects")}
          />
          <MetricCard
	      label="SupplyChain"
	      metric={metricByName("Supply Chain")}
	      yearMetric={yearMetricByName("Supply Chain")}
	      onClick={() => setScreen("supplychain")}
          />
        </div>

        {/* ----------------- Row 4 : People / Governance ----------------- */}
        <div className="vision-row vision-row-4">
          <MetricCard
            label="Customer Happiness"
            metric={metricByName("Customer Happiness")}
            yearMetric={yearMetricByName("Customer Happiness")}
            onClick={() => setScreen("customer-happiness")}
          />
          <MetricCard
	      label="Marketing"
	      metric={metricByName("Marketing")}
	      yearMetric={yearMetricByName("Marketing")}
	      onClick={() => setScreen("marketing")}
          />

          <MetricCard
            label="Human Capital"
            metric={metricByName("Human Capital")}
            yearMetric={yearMetricByName("Human Capital")}
            onClick={() => setScreen("human-capital")}
          />

          <MetricCard
            label="Governance"
            metric={metricByName("Governance")}
            yearMetric={yearMetricByName("Governance")}
            onClick={() => setScreen("risks")}
          />
        </div>

        {/* ----------------- Bottom Row ----------------- */}
        <div className="vision-row vision-row">

         <ActionItemsPanel
        items={actionItems}
        people={people}
        currentUser={currentUser}
        onCreate={createActionItem}
      /> 

         
        </div>
      </div>
    </div>
  );
}

/* ----------------- Metric Card Component ----------------- */

function MetricCard({ label, metric, yearMetric, onClick }) {
  const value = metric?.VALUE_NUM ?? "--";
    const target = metric?.TARGET_NUM ?? "--";
    const val_unit = metric?.VALUE_UNIT ?? "%";
    const tgt_unit = metric?.TARGET_UNIT ?? "%";
  
    const yr_value = yearMetric?.VALUE_NUM ?? "--";
    const yr_target = yearMetric?.TARGET_NUM ?? "--";
    const yr_val_unit = yearMetric?.VALUE_UNIT ?? "%";
    const yr_tgt_unit = yearMetric?.TARGET_UNIT ?? "%";
  
    const status = metric?.HEALTH_STATUS?.toLowerCase() ?? "good";

  return (
    <section
      className={`metric-card metric-${status}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="metric-label">{label} (Q / YTD)</div>
      <div className="metric-value">{value}{val_unit} / {target}{tgt_unit}</div>
      <div className="metric-value">{yr_value}{yr_val_unit} / {yr_target}{yr_tgt_unit}</div>
    </section>
  );
}
