import { Router } from "express";
import {
  getMetrics

} from "../services/profitabilityService.js"

const router = Router();




//Monthly Margin trend by product line

router.get("/revBySeg", async (req, res) => {
  const { periodType, periodLabel } = req.query;
  const data = await getMetrics(periodType, periodLabel);
  res.json(data);
});


export default router;