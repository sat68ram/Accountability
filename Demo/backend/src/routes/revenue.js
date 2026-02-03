import { Router } from "express";
import {
  getMetrics,
  getBusinessSegments,
  getProductLines,
  getProductSKUs,
  getRevenueByRegion,
  getRevenueByCustomer,
  getRevenueSummary,
} from "../services/revenueService.js";

const router = Router();

const handleQuery = (handler, errorLabel) => async (req, res) => {
  const periodType = req.query.periodType || "QUARTER";
  const periodLabel = req.query.periodLabel;
  try {
    const data = await handler(periodType, periodLabel);
    res.json(data);
  } catch (err) {
    console.error(`${errorLabel}:`, err);
    res.status(500).json({ error: `Failed to fetch ${errorLabel}` });
  }
};

router.get("/metrics", handleQuery(getMetrics, "Revenue metrics"));
router.get("/business-segments", handleQuery(getBusinessSegments, "Revenue business segments"));
router.get("/product-lines", handleQuery(getProductLines, "Revenue product lines"));
router.get("/product-skus", handleQuery(getProductSKUs, "Revenue product SKUs"));
router.get("/by-region", handleQuery(getRevenueByRegion, "Revenue by region"));
router.get("/by-customer", handleQuery(getRevenueByCustomer, "Revenue by customer"));

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

export default router;
