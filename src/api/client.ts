import ky from "ky";
import { useAuthStore } from "@/store/authStore";
import type { ApiError } from "./types";

// Create API client
export const apiClient = ky.create({
 prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:9999",
 timeout: 30000,
 retry: {
  limit: 2,
  methods: ["get"],
  statusCodes: [408, 413, 429, 500, 502, 503, 504],
 },
 hooks: {
  beforeRequest: [
   (request) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
     request.headers.set("Authorization", `Bearer ${token}`);
    }

    // Add common headers
    request.headers.set("Accept", "application/json");
    if (!(request.body instanceof FormData)) {
     request.headers.set("Content-Type", "application/json");
    }
   },
  ],
  afterResponse: [
   async (_, __, response) => {
    // Handle successful responses
    if (response.ok) {
     return response;
    }

    // Handle different error status codes
    if (response.status === 401) {
     // Clear auth state and redirect to login
     const { logout } = useAuthStore.getState();
     logout();
     window.location.href = "/login";
     throw new Error("Unauthorized");
    }

    if (response.status === 403) {
     throw new Error("Forbidden: You do not have permission to perform this action");
    }

    if (response.status === 404) {
     throw new Error("Resource not found");
    }

    if (response.status >= 500) {
     throw new Error("Server error. Please try again later.");
    }

    // Try to get error message from response
    try {
     const errorData: ApiError = await response.json();
     throw new Error(errorData.message || "An unexpected error occurred");
    } catch {
     throw new Error("An unexpected error occurred");
    }
   },
  ],
  beforeError: [
   (error) => {
    console.error("API Error:", error);
    return error;
   },
  ],
 },
});
