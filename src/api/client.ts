// src/api/client.ts
import ky from "ky";

export const apiClient = ky.create({
 prefixUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
 timeout: 10000,
 retry: 2,
 hooks: {
  beforeRequest: [
   (request) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
     request.headers.set("Authorization", `Bearer ${token}`);
    }
   },
  ],
  afterResponse: [
   async (_, __, response) => {
    if (response.status === 401) {
     // Handle unauthorized access
     localStorage.removeItem("auth-token");
     window.location.href = "/login";
    }
    return response;
   },
  ],
 },
});
