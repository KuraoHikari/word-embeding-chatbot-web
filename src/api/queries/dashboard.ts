import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type { ApiError, DashboardResponse } from "../types";

export const dashboardKeys = {
 all: ["dashboard"] as const,
 me: () => [...dashboardKeys.all, "me"] as const,
};

export const useDashboardQuery = () => {
 return useQuery<DashboardResponse, ApiError>({
  queryKey: dashboardKeys.me(),
  queryFn: async () => {
   const response = await apiClient.get<DashboardResponse>(endpoints.auth.dashboard);
   return response.data;
  },
  staleTime: 60 * 1000,
 });
};
