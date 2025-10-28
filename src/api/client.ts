import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import type { ApiError } from "./types";

// Create API client with axios
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9999",
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Axios automatically handles Content-Type for FormData
    // No need to manually set it!

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Return the data directly
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      const status = error.response.status;

      // Handle different error status codes
      if (status === 401) {
        // Clear auth state and redirect to login
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = "/login";
        return Promise.reject(new Error("Unauthorized"));
      }

      if (status === 403) {
        return Promise.reject(
          new Error(
            "Forbidden: You do not have permission to perform this action"
          )
        );
      }

      if (status === 404) {
        return Promise.reject(new Error("Resource not found"));
      }

      if (status >= 500) {
        return Promise.reject(
          new Error("Server error. Please try again later.")
        );
      }

      // Try to get error message from response
      const errorData: ApiError = error.response.data;
      return Promise.reject(
        new Error(errorData.message || "An unexpected error occurred")
      );
    }

    return Promise.reject(new Error("An unexpected error occurred"));
  }
);
