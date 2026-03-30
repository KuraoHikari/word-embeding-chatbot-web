import { apiClient } from "@/api/client";
import type { Conversation, ConversationDetail } from "./types";

const CONVERSATIONS_BASE = "conversations";

// ============================================================
// REST API functions — used exclusively by React Query
// ============================================================

export async function fetchConversations(): Promise<Conversation[]> {
 const response = await apiClient.get<Conversation[]>(CONVERSATIONS_BASE);
 return response.data;
}

export async function fetchConversationById(id: number): Promise<ConversationDetail> {
 const response = await apiClient.get<ConversationDetail>(`${CONVERSATIONS_BASE}/${id}`);
 return response.data;
}

export async function toggleAutoReply(id: number, autoReply: boolean): Promise<Conversation> {
 const response = await apiClient.patch<Conversation>(`${CONVERSATIONS_BASE}/${id}`, { autoReply });
 return response.data;
}
