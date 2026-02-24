import { useQuery } from "@tanstack/react-query";

const projectsApi = (path) => {
  return fetch(`/api/projects/${path}`).then((res) => {
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
  });
};

export function usePortfolioOverview() {
  return useQuery({
    queryKey: ["projects", "portfolioOverview"],
    queryFn: () => projectsApi("portfolio-overview"),
    enabled: true,
  });
}

export function useProjectsByProgram() {
  return useQuery({
    queryKey: ["projects", "projectsByProgram"],
    queryFn: () => projectsApi("projects-by-program"),
    enabled: true,
  });
}

export function useScheduleHealth() {
  return useQuery({
    queryKey: ["projects", "scheduleHealth"],
    queryFn: () => projectsApi("schedule-health"),
    enabled: true,
  });
}

export function useTaskBurndown() {
  return useQuery({
    queryKey: ["projects", "taskBurndown"],
    queryFn: () => projectsApi("task-burndown"),
    enabled: true,
  });
}

export function useSlippageByProgram() {
  return useQuery({
    queryKey: ["projects", "slippageByProgram"],
    queryFn: () => projectsApi("slippage-by-program"),
    enabled: true,
  });
}

export function useBudgetVsActualByMonth() {
  return useQuery({
    queryKey: ["projects", "budgetVsActualByMonth"],
    queryFn: () => projectsApi("budget-vs-actual-by-month"),
    enabled: true,
  });
}

export function useEvAcPv() {
  return useQuery({
    queryKey: ["projects", "evAcPv"],
    queryFn: () => projectsApi("ev-ac-pv"),
    enabled: true,
  });
}

export function useUtilizationByTeamByQuarter() {
  return useQuery({
    queryKey: ["projects", "utilizationByTeamByQuarter"],
    queryFn: () => projectsApi("utilization-by-team-by-quarter"),
    enabled: true,
  });
}

export function useConstrainedTeams() {
  return useQuery({
    queryKey: ["projects", "constrainedTeams"],
    queryFn: () => projectsApi("constrained-teams"),
    enabled: true,
  });
}

export function useRiskBubble() {
  return useQuery({
    queryKey: ["projects", "riskBubble"],
    queryFn: () => projectsApi("risk-bubble"),
    enabled: true,
  });
}

export function useProjectRisksExceptions() {
  return useQuery({
    queryKey: ["projects", "projectRisksExceptions"],
    queryFn: () => projectsApi("project-risks-exceptions"),
    enabled: true,
  });
}

export function useGateReadiness() {
  return useQuery({
    queryKey: ["projects", "gateReadiness"],
    queryFn: () => projectsApi("gate-readiness"),
    enabled: true,
  });
}
