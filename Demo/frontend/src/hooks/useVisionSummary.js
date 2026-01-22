import { useQuery } from "@tanstack/react-query";

export function getCurrentYearAndQuarter() {
  const date = new Date();
  const year = date.getFullYear();

  // JS months are 0-based (0 = Jan, 11 = Dec)
  const quarter = Math.floor(date.getMonth() / 3) + 1;

  return {
    year: `${year}`,
    quarter: `${year}-Q${quarter}`
  };
}

export function useMetrics(periodType, periodLabel) {
  return useQuery({
    queryKey: ["metrics", periodType, periodLabel],
    queryFn: async () => {
      console.log("?? calling /api/vision/metrics");

      const url = `/api/vision/metrics?periodType=${periodType}&periodLabel=${periodLabel}`;
      const res = await fetch(
        url
      );

      if (!res.ok) {
        throw new Error("Failed to load vmetrics");
      }

      const data = await res.json();          // ? parse once
	  console.log("metrics response:", data); // ? safe log

      return data;


    },
    enabled: true
  });
}

export function useVisionSummary(periodType, periodLabel) {
  return useQuery({
    queryKey: ["visionSummary", periodType, periodLabel],
    queryFn: async () => {
      console.log("?? calling /api/vision/summary");

      const url = `/api/vision/summary?periodType=${periodType}&periodLabel=${periodLabel}`;
      const res = await fetch(
        url
      );

      if (!res.ok) {
        throw new Error("Failed to load vision summary");
      }

      return await res.json();
    },
    enabled: true
  });
}
