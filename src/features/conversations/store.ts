import { create } from "zustand";
import type { Conversation, Message, DisplayMessage, TempMessage } from "./types";

// ============================================================
// Conversation Store — single source of truth for realtime state
// ============================================================

interface ConversationState {
 // Data
 conversations: Conversation[];
 activeConversationId: number | null;
 messagesByConversation: Record<number, DisplayMessage[]>;
 typingUsers: Record<number, boolean>;
 onlineUsers: Record<number, boolean>;
 onlineContacts: Record<number, boolean>;
 unreadByConversation: Record<number, number>;

 // Actions
 setConversations: (conversations: Conversation[]) => void;
 setActiveConversation: (id: number | null) => void;
 setMessages: (conversationId: number, messages: Message[]) => void;
 addMessage: (conversationId: number, message: DisplayMessage) => void;
 replaceTempMessage: (tempId: string, message: Message) => void;
 markTempMessageError: (tempId: string) => void;
 updateAutoReply: (conversationId: number, autoReply: boolean) => void;
 setTyping: (conversationId: number, isTyping: boolean) => void;
 setOnlineStatus: (userId: number, online: boolean) => void;
 setContactOnlineStatus: (contactId: number, online: boolean) => void;
 updateLastMessage: (conversationId: number, message: Message) => void;
 incrementUnread: (conversationId: number) => void;
 resetUnread: (conversationId: number) => void;
 addConversation: (conversation: Conversation) => void;
}

export const useConversationStore = create<ConversationState>()((set) => ({
 // ── Initial state ──────────────────────────────────────────
 conversations: [],
 activeConversationId: null,
 messagesByConversation: {},
 typingUsers: {},
 onlineUsers: {},
 onlineContacts: {},
 unreadByConversation: {},

 // ── Actions ────────────────────────────────────────────────

 setConversations: (conversations) =>
  set((state) => {
   // Prevent duplicates by id — keep latest
   const seen = new Set<number>();
   const deduped: Conversation[] = [];
   for (const c of conversations) {
    if (!seen.has(c.id)) {
     seen.add(c.id);
     deduped.push(c);
    }
   }
   // Sort by updatedAt descending — newest activity first
   deduped.sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bTime - aTime;
   });
   // Preserve existing unread counts
   return { conversations: deduped, unreadByConversation: state.unreadByConversation };
  }),

 setActiveConversation: (id) => set(() => ({ activeConversationId: id })),

 setMessages: (conversationId, messages) =>
  set((state) => ({
   messagesByConversation: {
    ...state.messagesByConversation,
    [conversationId]: messages,
   },
  })),

 addMessage: (conversationId, message) =>
  set((state) => {
   const existing = state.messagesByConversation[conversationId] ?? [];

   // Prevent duplicate by id
   const alreadyExists = existing.some((m) => m.id === message.id);
   if (alreadyExists) return state;

   return {
    messagesByConversation: {
     ...state.messagesByConversation,
     [conversationId]: [...existing, message],
    },
   };
  }),

 replaceTempMessage: (tempId, message) =>
  set((state) => {
   const entries = Object.entries(state.messagesByConversation);
   const updated: Record<number, DisplayMessage[]> = {};

   for (const [key, msgs] of entries) {
    updated[Number(key)] = msgs.map((m) => ("_tempId" in m && (m as TempMessage)._tempId === tempId ? message : m));
   }

   return { messagesByConversation: updated };
  }),

 markTempMessageError: (tempId) =>
  set((state) => {
   const entries = Object.entries(state.messagesByConversation);
   const updated: Record<number, DisplayMessage[]> = {};

   for (const [key, msgs] of entries) {
    updated[Number(key)] = msgs.map((m) => ("_tempId" in m && (m as TempMessage)._tempId === tempId ? { ...m, _status: "error" as const } : m));
   }

   return { messagesByConversation: updated };
  }),

 updateAutoReply: (conversationId, autoReply) =>
  set((state) => ({
   conversations: state.conversations.map((c) => (c.id === conversationId ? { ...c, autoReply } : c)),
  })),

 setTyping: (conversationId, isTyping) =>
  set((state) => ({
   typingUsers: {
    ...state.typingUsers,
    [conversationId]: isTyping,
   },
  })),

 setOnlineStatus: (userId, online) =>
  set((state) => ({
   onlineUsers: {
    ...state.onlineUsers,
    [userId]: online,
   },
  })),

 setContactOnlineStatus: (contactId, online) =>
  set((state) => ({
   onlineContacts: {
    ...state.onlineContacts,
    [contactId]: online,
   },
  })),

 updateLastMessage: (conversationId, message) =>
  set((state) => {
   const updated = state.conversations.map((c) => (c.id === conversationId ? { ...c, lastMessage: message, updatedAt: message.createdAt ?? new Date().toISOString() } : c));
   // Re-sort so the conversation with new message moves to top
   updated.sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bTime - aTime;
   });
   return { conversations: updated };
  }),

 incrementUnread: (conversationId) =>
  set((state) => ({
   unreadByConversation: {
    ...state.unreadByConversation,
    [conversationId]: (state.unreadByConversation[conversationId] ?? 0) + 1,
   },
  })),

 resetUnread: (conversationId) =>
  set((state) => ({
   unreadByConversation: {
    ...state.unreadByConversation,
    [conversationId]: 0,
   },
  })),

 addConversation: (conversation) =>
  set((state) => {
   // Prevent duplicate
   if (state.conversations.some((c) => c.id === conversation.id)) return state;

   const updated = [conversation, ...state.conversations];
   // Sort by updatedAt descending
   updated.sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bTime - aTime;
   });
   return { conversations: updated };
  }),
}));
