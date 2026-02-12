import { Router } from "express";
import {
  getPortfolioOverview,
  getProjectsByProgram,
  getScheduleHealth,
  getSlippageByProgram,
  getBudgetVsActualByMonth,
  getEvAcPv,
  getUtilizationByTeamByQuarter,
  getConstrainedTeams,
  getRiskBubble,
} from "../services/projectsService.js";

const router = Router();

const handleQuery = (handler, errorLabel) => async (_req, res) => {
  try {
    const data = await handler();
    res.json(data);
  } catch (err) {
    console.error(`${errorLabel}:`, err);
    res.status(500).json({ error: `Failed to fetch ${errorLabel}` });
  }
};

router.get("/portfolio-overview", handleQuery(getPortfolioOverview, "Portfolio overview"));
router.get("/projects-by-program", handleQuery(getProjectsByProgram, "Projects by program"));
router.get("/schedule-health", handleQuery(getScheduleHealth, "Schedule health"));
router.get("/slippage-by-program", handleQuery(getSlippageByProgram, "Slippage by program"));
router.get("/budget-vs-actual-by-month", handleQuery(getBudgetVsActualByMonth, "Budget vs actual by month"));
router.get("/ev-ac-pv", handleQuery(getEvAcPv, "EV/AC/PV"));
router.get("/utilization-by-team-by-quarter", handleQuery(getUtilizationByTeamByQuarter, "Utilization by team by quarter"));
router.get("/constrained-teams", handleQuery(getConstrainedTeams, "Constrained teams"));
router.get("/risk-bubble", handleQuery(getRiskBubble, "Risk bubble"));

export default router;
