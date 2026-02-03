import { useQuery } from "@tanstack/react-query";

const revenueApi = (path, periodType, periodLabel) => {
  const url = `/api/revenue/${path}?periodType=${periodType}&periodLabel=${encodeURIComponent(periodLabel ?? "")}`;
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
  });
};

export function useRevenueMetrics(periodType, periodLabel) {
  return useQuery({
    queryKey: ["revenueMetrics", periodType, periodLabel],
    queryFn: () => revenueApi("metrics", periodType, periodLabel),
    enabled: Boolean(periodLabel),
  });
}

export function useBusinessSegments(periodType, periodLabel) {
  return useQuery({
    queryKey: ["revenueBusinessSegments", periodType, periodLabel],
    queryFn: () => revenueApi("business-segments", periodType, periodLabel),
    enabled: Boolean(periodLabel),
  });
}

export function useProductLines(periodType, periodLabel) {
  return useQuery({
    queryKey: ["revenueProductLines", periodType, periodLabel],
    queryFn: () => revenueApi("product-lines", periodType, periodLabel),
    enabled: Boolean(periodLabel),
  });
}

export function useProductSKUs(periodType, periodLabel) {
  return useQuery({
    queryKey: ["revenueProductSKUs", periodType, periodLabel],
    queryFn: () => revenueApi("product-skus", periodType, periodLabel),
    enabled: Boolean(periodLabel),
  });
}

export function useRevenueByRegion(periodType, periodLabel) {
  return useQuery({
    queryKey: ["revenueByRegion", periodType, periodLabel],
    queryFn: () => revenueApi("by-region", periodType, periodLabel),
    enabled: Boolean(periodLabel),
  });
}

export function useRevenueByCustomer(periodType, periodLabel) {
  return useQuery({
    queryKey: ["revenueByCustomer", periodType, periodLabel],
    queryFn: () => revenueApi("by-customer", periodType, periodLabel),
    enabled: Boolean(periodLabel),
  });
}

export function useRevenueSummary(periodType, periodLabel) {
  return useQuery({
    queryKey: ["revenueSummary", periodType, periodLabel],
    queryFn: () => revenueApi("summary", periodType, periodLabel),
    enabled: Boolean(periodLabel),
  });
}
