import { Router } from "express";
import {
  getMetrics
  
} from "../services/revenueService.js"

const router = Router();


// Individual endpoints if needed
router.get("/metrics", async (req, res) => {
  const { periodType, periodLabel } = req.query;
  const data = await getMetrics(periodType, periodLabel);
  res.json(data);
});


export default router;
