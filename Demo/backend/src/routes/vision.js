import { Router } from "express";
import {
  getYearMetrics,
  getActionItems,
  getVisionSummary,
  createActionItem
} from "../services/visionService.js";

const router = Router();

// Full summary for Company Vision view
router.get("/summary", async (req, res) => {
  const periodType = req.query.periodType || "MONTH";
  const periodLabel = req.query.periodLabel; // e.g., 2025-01

  try {
    const data = await getVisionSummary(periodType, periodLabel);
    res.json(data);
  } catch (err) {
    console.error("Vision summary error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// Individual endpoints if needed
router.get("/metrics", async (req, res) => {
  const { periodType, periodLabel } = req.query;
  const data = await getYearMetrics(periodType, periodLabel);
  res.json(data);
});


router.get("/actionItems", async (req, res) => {
  try {
      const items = await getActionItems();
      res.json({ items });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load action items" });
  }
});

router.post("/action-items", async (req, res) => {
  try {
    await createActionItem(req.body);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create action item" });
  }
});


export default router;
