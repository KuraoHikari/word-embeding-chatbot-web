import { create } from "zustand";
import type { WidgetState, WidgetChatbot, DisplayWidgetMessage, TempWidgetMessage, WidgetMessage } from "./types";

// ============================================================
// Widget Chat Store — single source of truth for customer widget
// ============================================================

const WIDGET_TOKEN_KEY = "widget-chat-token";

interface WidgetChatState {
 // State
 widgetState: WidgetState;
 chatbot: WidgetChatbot | null;
 token: string | null;
 activeConversationId: number | null;
 messages: DisplayWidgetMessage[];
 errorMessage: string | null;

 // Actions
 setWidgetState: (state: WidgetState) => void;
 setChatbot: (chatbot: WidgetChatbot) => void;
 setToken: (token: string) => void;
 setActiveConversation: (id: number) => void;
 addMessage: (message: DisplayWidgetMessage) => void;
 replaceTempMessage: (tempId: string, message: WidgetMessage) => void;
 markTempMessageError: (tempId: string) => void;
 setErrorMessage: (msg: string | null) => void;
 reset: () => void;
}

const initialState = {
 widgetState: "VALIDATING" as WidgetState,
 chatbot: null,
 token: null,
 activeConversationId: null,
 messages: [] as DisplayWidgetMessage[],
 errorMessage: null,
};

export const useWidgetChatStore = create<WidgetChatState>()((set) => ({
 ...initialState,

 setWidgetState: (widgetState) => set(() => ({ widgetState })),

 setChatbot: (chatbot) => set(() => ({ chatbot })),

 setToken: (token) => {
  localStorage.setItem(WIDGET_TOKEN_KEY, token);
  set(() => ({ token }));
 },

 setActiveConversation: (id) => set(() => ({ activeConversationId: id })),

 addMessage: (message) =>
  set((state) => {
   // Prevent duplicate by id
   const exists = state.messages.some((m) => m.id === message.id);
   if (exists) return state;
   return { messages: [...state.messages, message] };
  }),

 replaceTempMessage: (tempId, message) =>
  set((state) => ({
   messages: state.messages.map((m) => ("_tempId" in m && (m as TempWidgetMessage)._tempId === tempId ? message : m)),
  })),

 markTempMessageError: (tempId) =>
  set((state) => ({
   messages: state.messages.map((m) => ("_tempId" in m && (m as TempWidgetMessage)._tempId === tempId ? { ...m, _status: "error" as const } : m)),
  })),

 setErrorMessage: (msg) => set(() => ({ errorMessage: msg })),

 reset: () => {
  localStorage.removeItem(WIDGET_TOKEN_KEY);
  set(() => ({ ...initialState }));
 },
}));
