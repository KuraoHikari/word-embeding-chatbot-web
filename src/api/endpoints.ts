// src/api/endpoints.ts

export const endpoints = {
 // Auth endpoints
 auth: {
  login: `auth/login`,
  register: `auth/register`,
  logout: `auth/logout`,
  refresh: `auth/refresh`,
  me: `auth/me`,
  forgotPassword: `auth/forgot-password`,
  resetPassword: `auth/reset-password`,
 },

 // Dashboard endpoints
 dashboard: {
  stats: `dashboard/stats`,
  recentActivities: `dashboard/activities`,
  upcomingTasks: `dashboard/upcoming-tasks`,
 },

 // File upload endpoints
 files: {
  upload: `files/upload`,
  delete: (id: string) => `files/${id}`,
 },

 // Chatbot endpoints
 chatbots: {
  list: `chatbots`,
  create: `chatbots`,
  getById: (id: number) => `chatbots/${id}`,
  update: (id: number) => `chatbots/${id}`,
  delete: (id: number) => `chatbots/${id}`,
 },
} as const;

// Helper function to build query string
export const buildQueryString = (params: Record<string, unknown>): string => {
 const searchParams = new URLSearchParams();

 Object.entries(params).forEach(([key, value]) => {
  if (value !== undefined && value !== null && value !== "") {
   if (Array.isArray(value)) {
    value.forEach((item) => searchParams.append(key, item.toString()));
   } else {
    searchParams.append(key, value.toString());
   }
  }
 });

 const queryString = searchParams.toString();
 return queryString ? `?${queryString}` : "";
};
