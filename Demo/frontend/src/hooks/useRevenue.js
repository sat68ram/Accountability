import { useQuery } from "@tanstack/react-query";

export function useRevenueMetrics(periodType, periodLabel) {
  return useQuery({
    queryKey: ["revenueMetrics", periodType, periodLabel],
    queryFn: async () => {
      console.log("?? calling /api/revenue/metrics");

      const url = `/api/revenue/metrics?periodType=${periodType}&periodLabel=${periodLabel}`;
      const res = await fetch(
        url
      );

      if (!res.ok) {
        throw new Error("Failed to load revenue metrics");
      }

      const data = await res.json();
      console.log("revenue metrics response:", data);

      return data;
    },
    enabled: true
  });
}

export function useRevenueSummary(periodType, periodLabel) {
  return useQuery({
    queryKey: ["revenueSummary", periodType, periodLabel],
    queryFn: async () => {
      console.log("?? calling /api/revenue/summary");

      const url = `/api/revenue/summary?periodType=${periodType}&periodLabel=${periodLabel}`;
      const res = await fetch(
        url
      );

      if (!res.ok) {
        throw new Error("Failed to load revenue summary");
      }

      const data = await res.json();
      console.log("revenue summary response:", data);

      return data;
    },
    enabled: true
  });
}
