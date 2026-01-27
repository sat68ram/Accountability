import { Router } from "express";
import {
  getMetrics,
  getRevenueSummary
} from "../services/revenueService.js"

const router = Router();

// Full summary for Revenue view
router.get("/summary", async (req, res) => {
  const periodType = req.query.periodType || "QUARTER";
  const periodLabel = req.query.periodLabel;

  try {
    const data = await getRevenueSummary(periodType, periodLabel);
    res.json(data);
  } catch (err) {
    console.error("Revenue summary error:", err);
    res.status(500).json({ error: "Failed to fetch revenue summary" });
  }
});

// Individual endpoints if needed
router.get("/metrics", async (req, res) => {
  const { periodType, periodLabel } = req.query;
  try {
    const data = await getMetrics(periodType, periodLabel);
    res.json(data);
  } catch (err) {
    console.error("Revenue metrics error:", err);
    res.status(500).json({ error: "Failed to fetch revenue metrics" });
  }
});

export default router;
