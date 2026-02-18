import React from "react";
import {
  PortfolioOverview,
  ScheduleHealth,
  SlippageCriticalPath,
  BudgetVsActual,
  EvAcPv,
  UtilizationHeatmap,
  ConstrainedSkills,
  RiskBubbleChart,
  ProjectRisksExceptions,
  GateReadinessSummary,
} from "../../components/projects";

export default function Projects() {
  return (
    <div className="vision-layout">
      <PortfolioOverview />

      <div className="vision-row vision-row-2">
        <ScheduleHealth />
        <SlippageCriticalPath />
      </div>

      <div className="vision-row vision-row-2">
        <BudgetVsActual />
        <EvAcPv />
      </div>

      <div className="vision-row vision-row-2">
        <UtilizationHeatmap />
        <ConstrainedSkills />
      </div>

      <div className="vision-row vision-row-2">
        <RiskBubbleChart />
        <ProjectRisksExceptions />
      </div>

      <GateReadinessSummary />
    </div>
  );
}
