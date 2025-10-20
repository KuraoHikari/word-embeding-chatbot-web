import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type { ApiError, ApiResponse, Chatbot, CreateChatbotPayload, UpdateChatbotPayload } from "../types";

// Query keys
export const chatbotKeys = {
 all: ["chatbots"] as const,
 lists: () => [...chatbotKeys.all, "list"] as const,
 list: (filters?: Record<string, unknown>) => [...chatbotKeys.lists(), filters] as const,
 details: () => [...chatbotKeys.all, "detail"] as const,
 detail: (id: number) => [...chatbotKeys.details(), id] as const,
};

// Get all chatbots
export const useGetChatbots = () => {
 return useQuery<Chatbot[], ApiError>({
  queryKey: chatbotKeys.lists(),
  queryFn: async () => {
   const response = await apiClient.get(endpoints.chatbots.list).json<Chatbot[]>();
   return response;
  },
 });
};

// Get chatbot by ID
export const useGetChatbotById = (id: number, enabled = true) => {
 return useQuery<Chatbot, ApiError>({
  queryKey: chatbotKeys.detail(id),
  queryFn: async () => {
   const response = await apiClient.get(endpoints.chatbots.getById(id)).json<Chatbot>();
   return response;
  },
  enabled,
 });
};

// Create chatbot
export const useCreateChatbot = () => {
 const queryClient = useQueryClient();

 return useMutation<ApiResponse<Chatbot>, ApiError, CreateChatbotPayload>({
  mutationFn: async (payload) => {
   const formData = new FormData();

   // Append all fields to FormData - boolean values as strings
   formData.append("title", payload.title);
   formData.append("description", payload.description || "");
   formData.append("welcomeMessage", payload.welcomeMessage);
   formData.append("suggestionMessage", payload.suggestionMessage);
   formData.append("systemPrompt", payload.systemPrompt);
   formData.append("aiModel", payload.aiModel);
   formData.append("embeddingModel", payload.embeddingModel);
   formData.append("temperature", payload.temperature.toString());
   formData.append("maxTokens", payload.maxTokens.toString());
   formData.append("isPublic", payload.isPublic ? "true" : "false");
   formData.append("isProposedModel", payload.isProposedModel ? "true" : "false");
   formData.append("pdf", payload.pdf, payload.pdf.name);

   // Debug log - show what we're sending
   console.log("🚀 ~ Payload before FormData:", payload);
   console.log("🚀 ~ FormData being sent:");
   for (const [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
   }

   const response = await apiClient
    .post(endpoints.chatbots.create, {
     body: formData,
    })
    .json<ApiResponse<Chatbot>>();
   console.log("🚀 ~ useCreateChatbot ~ response:", response);

   return response;
  },
  onSuccess: () => {
   // Invalidate chatbots list to refetch
   queryClient.invalidateQueries({ queryKey: chatbotKeys.lists() });
  },
  onError: (error) => {
   console.error("Error creating chatbot:", error);
  },
 });
};

// Update chatbot
export const useUpdateChatbot = (id: number) => {
 const queryClient = useQueryClient();

 return useMutation<ApiResponse<{ message: string }>, ApiError, UpdateChatbotPayload>({
  mutationFn: async (payload) => {
   const formData = new FormData();

   // Append only provided fields to FormData
   if (payload.title !== undefined) formData.append("title", payload.title);
   if (payload.isPublic !== undefined) formData.append("isPublic", String(payload.isPublic));
   if (payload.welcomeMessage !== undefined) formData.append("welcomeMessage", payload.welcomeMessage);
   if (payload.suggestionMessage !== undefined) formData.append("suggestionMessage", payload.suggestionMessage);
   if (payload.systemPrompt !== undefined) formData.append("systemPrompt", payload.systemPrompt);
   if (payload.aiModel !== undefined) formData.append("aiModel", payload.aiModel);
   if (payload.isProposedModel !== undefined) formData.append("isProposedModel", String(payload.isProposedModel));
   if (payload.embeddingModel !== undefined) formData.append("embeddingModel", payload.embeddingModel);
   if (payload.temperature !== undefined) formData.append("temperature", String(payload.temperature));
   if (payload.maxTokens !== undefined) formData.append("maxTokens", String(payload.maxTokens));
   if (payload.pdf !== undefined) formData.append("pdf", payload.pdf);
   if (payload.description !== undefined) formData.append("description", payload.description);

   const response = await apiClient
    .patch(endpoints.chatbots.update(id), {
     body: formData,
    })
    .json<ApiResponse<{ message: string }>>();
   console.log("🚀 ~ useUpdateChatbot ~ response:", response);

   return response;
  },
  onSuccess: () => {
   // Invalidate both the list and the specific chatbot detail
   queryClient.invalidateQueries({ queryKey: chatbotKeys.lists() });
   queryClient.invalidateQueries({ queryKey: chatbotKeys.detail(id) });
  },
 });
};

// Delete chatbot
export const useDeleteChatbot = () => {
 const queryClient = useQueryClient();

 return useMutation<ApiResponse<{ message: string }>, ApiError, number>({
  mutationFn: async (id) => {
   const response = await apiClient.delete(endpoints.chatbots.delete(id)).json<ApiResponse<{ message: string }>>();

   return response;
  },
  onSuccess: () => {
   // Invalidate chatbots list to refetch
   queryClient.invalidateQueries({ queryKey: chatbotKeys.lists() });
  },
 });
};
