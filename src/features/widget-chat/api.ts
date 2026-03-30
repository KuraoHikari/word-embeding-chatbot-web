import axios from "axios";

// ============================================================
// Widget Chat — REST API (dedicated axios instance, no admin token)
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:9999";

const widgetClient = axios.create({
 baseURL: BASE_URL,
 headers: { Accept: "application/json" },
});

// ── Fetch chatbot (public, no auth) ────────────────────────

export interface FetchChatbotResponse {
 id: number;
 title: string;
 isPublic: boolean;
 status?: string;
 welcomeMessage: string;
}

export async function fetchChatbot(chatbotId: number): Promise<FetchChatbotResponse> {
 const res = await widgetClient.get<FetchChatbotResponse>(`chatbots/${chatbotId}`);
 return res.data;
}

// ── Create contact ─────────────────────────────────────────

export interface CreateContactPayload {
 name: string;
 email: string;
 phone?: string;
 chatbotId: number;
}

export interface CreateContactResponse {
 access_token: string;
}

export async function createContact(payload: CreateContactPayload): Promise<CreateContactResponse> {
 const res = await widgetClient.post<CreateContactResponse>("contacts", payload);
 return res.data;
}

// ── Create conversation ────────────────────────────────────

export interface CreateConversationPayload {
 chatbotId: number;
 autoReply: boolean;
}

export interface CreateConversationResponse {
 id: number;
}

export async function createConversation(payload: CreateConversationPayload, token: string): Promise<CreateConversationResponse> {
 const res = await widgetClient.post<CreateConversationResponse>("conversations", payload, { headers: { Authorization: `Bearer ${token}` } });
 return res.data;
}
