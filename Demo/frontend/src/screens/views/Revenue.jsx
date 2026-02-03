import React from "react";
import {
  CompanyRevenueOverview,
  RevenueByBusinessSegment,
  RevenueByProductLine,
  RevenueByProductSku,
  RevenueByRegion,
  RevenueByCustomer,
} from "../../components/revenue";

export default function Revenue() {
  return (
    <div className="vision-layout">
      <CompanyRevenueOverview />
      <RevenueByBusinessSegment />
      <RevenueByProductLine />
      <RevenueByProductSku />
      <div className="vision-row vision-row-2" style={{ overflow: "auto" }}>
        <RevenueByRegion />
        <RevenueByCustomer />
      </div>
    </div>
  );
}
