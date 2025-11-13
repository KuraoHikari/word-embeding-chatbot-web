import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type { ApiError, Message, CreateMessagePayload } from "../types";

// Create message
export const useCreateMessage = () => {
 return useMutation<Message, ApiError, CreateMessagePayload>({
  mutationFn: async (payload) => {
   const response = await apiClient.post<Message>(endpoints.messages.create, payload);
   console.log("🚀 ~ useCreateMessage ~ response:", response.data);

   return response.data;
  },
  onError: (error) => {
   console.error("Error creating message:", error);
  },
 });
};
