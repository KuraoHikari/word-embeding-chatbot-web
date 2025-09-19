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

 // User endpoints
 users: {
  list: `users`,
  create: `users`,
  detail: (id: string) => `users/${id}`,
  update: (id: string) => `users/${id}`,
  delete: (id: string) => `users/${id}`,
  avatar: (id: string) => `users/${id}/avatar`,
 },

 // Project endpoints
 projects: {
  list: `projects`,
  create: `projects`,
  detail: (id: string) => `projects/${id}`,
  update: (id: string) => `projects/${id}`,
  delete: (id: string) => `projects/${id}`,
  members: (id: string) => `projects/${id}/members`,
  addMember: (id: string) => `projects/${id}/members`,
  removeMember: (id: string, memberId: string) => `projects/${id}/members/${memberId}`,
  tasks: (id: string) => `projects/${id}/tasks`,
 },

 // Task endpoints
 tasks: {
  list: `tasks`,
  create: `tasks`,
  detail: (id: string) => `tasks/${id}`,
  update: (id: string) => `tasks/${id}`,
  delete: (id: string) => `tasks/${id}`,
  assign: (id: string) => `tasks/${id}/assign`,
  comments: (id: string) => `tasks/${id}/comments`,
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
