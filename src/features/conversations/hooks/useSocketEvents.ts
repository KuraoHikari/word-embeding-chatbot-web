import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../socket";
import { useConversationStore } from "../store";
import { messageNewSchema, messageTypingSchema, presenceUpdateSchema, autoReplyUpdatedSchema, conversationNewSchema } from "../schemas";
import type { Message } from "../types";

// ============================================================
// useSocketEvents — connect, subscribe, validate, mutate Zustand
// ============================================================

export function useSocketEvents() {
 const addMessage = useConversationStore((s) => s.addMessage);
 const setTyping = useConversationStore((s) => s.setTyping);
 const setOnlineStatus = useConversationStore((s) => s.setOnlineStatus);
 const setContactOnlineStatus = useConversationStore((s) => s.setContactOnlineStatus);
 const updateAutoReply = useConversationStore((s) => s.updateAutoReply);
 const updateLastMessage = useConversationStore((s) => s.updateLastMessage);
 const replaceTempMessage = useConversationStore((s) => s.replaceTempMessage);
 const incrementUnread = useConversationStore((s) => s.incrementUnread);
 const addConversation = useConversationStore((s) => s.addConversation);
 const activeConversationId = useConversationStore((s) => s.activeConversationId);

 const listenersAttached = useRef(false);

 // ── Socket connection + global event listeners ────────────
 useEffect(() => {
  const socket = connectSocket();

  // Guard against double-attach in StrictMode
  if (listenersAttached.current) return;
  listenersAttached.current = true;

  // On (re)connect, rejoin the active conversation room
  const handleConnect = () => {
   const activeId = useConversationStore.getState().activeConversationId;
   if (activeId !== null) {
    socket.emit("conversation:join", { conversationId: activeId });
   }
  };

  const handleConnectError = (err: Error) => {
   console.error("[socket] connect_error", err.message);
  };

  // ── message:new ──────────────────────────────────────────
  const handleMessageNew = (raw: unknown) => {
   const result = messageNewSchema.safeParse(raw);
   if (!result.success) {
    console.error("[socket] Invalid message:new payload", result.error);
    return;
   }

   const payload = result.data;
   const message: Message = {
    id: payload.id,
    text: payload.text,
    conversationId: payload.conversationId,
    isBot: payload.isBot,
    senderRole: payload.senderRole,
    createdAt: payload.createdAt,
    userId: payload.userId,
    updatedAt: payload.updatedAt,
   };

   // Try to replace a temp message that matches this conversation
   // by checking the store for pending temp messages
   const state = useConversationStore.getState();
   const msgs = state.messagesByConversation[payload.conversationId] ?? [];
   const pendingTemp = msgs.find((m) => "_tempId" in m && m._status === "sending" && m.text === payload.text && !m.isBot);

   if (pendingTemp && "_tempId" in pendingTemp && !payload.isBot) {
    replaceTempMessage(pendingTemp._tempId, message);
   } else {
    addMessage(payload.conversationId, message);
   }

   updateLastMessage(payload.conversationId, message);

   // Increment unread if this conversation is NOT active
   const currentActive = useConversationStore.getState().activeConversationId;
   if (currentActive !== payload.conversationId) {
    incrementUnread(payload.conversationId);
   }
  };

  // ── message:typing ───────────────────────────────────────
  const handleTyping = (raw: unknown) => {
   const result = messageTypingSchema.safeParse(raw);
   if (!result.success) {
    console.error("[socket] Invalid message:typing payload", result.error);
    return;
   }

   setTyping(result.data.conversationId, result.data.isTyping);
  };

  // ── presence:update ──────────────────────────────────────
  const handlePresence = (raw: unknown) => {
   const result = presenceUpdateSchema.safeParse(raw);
   if (!result.success) {
    console.error("[socket] Invalid presence:update payload", result.error);
    return;
   }

   const { isOnline, contactId, userId } = result.data;
   if (contactId) {
    setContactOnlineStatus(contactId, isOnline);
   } else {
    setOnlineStatus(userId, isOnline);
   }
  };

  // ── conversation:autoReplyUpdated ────────────────────────
  const handleAutoReply = (raw: unknown) => {
   const result = autoReplyUpdatedSchema.safeParse(raw);
   if (!result.success) {
    console.error("[socket] Invalid conversation:autoReplyUpdated payload", result.error);
    return;
   }

   updateAutoReply(result.data.conversationId, result.data.autoReply);
  };

  // ── conversation:new ─────────────────────────────────────
  const handleConversationNew = (raw: unknown) => {
   const result = conversationNewSchema.safeParse(raw);
   if (!result.success) {
    console.error("[socket] Invalid conversation:new payload", result.error);
    return;
   }

   addConversation(result.data);
  };

  socket.on("connect", handleConnect);
  socket.on("connect_error", handleConnectError);
  socket.on("message:new", handleMessageNew);
  socket.on("message:typing", handleTyping);
  socket.on("presence:update", handlePresence);
  socket.on("conversation:autoReplyUpdated", handleAutoReply);
  socket.on("conversation:new", handleConversationNew);

  // ── Cleanup — remove only OUR handlers ───────────────────
  return () => {
   socket.off("connect", handleConnect);
   socket.off("connect_error", handleConnectError);
   socket.off("message:new", handleMessageNew);
   socket.off("message:typing", handleTyping);
   socket.off("presence:update", handlePresence);
   socket.off("conversation:autoReplyUpdated", handleAutoReply);
   socket.off("conversation:new", handleConversationNew);
   listenersAttached.current = false;
   disconnectSocket();
  };
 }, [addMessage, setTyping, setOnlineStatus, setContactOnlineStatus, updateAutoReply, updateLastMessage, replaceTempMessage, incrementUnread, addConversation]);

 // ── Room join/leave when active conversation changes ──────
 useEffect(() => {
  if (activeConversationId === null) return;

  const socket = getSocket();
  socket.emit("conversation:join", { conversationId: activeConversationId });

  return () => {
   const s = getSocket();
   s.emit("conversation:leave", { conversationId: activeConversationId });
  };
 }, [activeConversationId]);
}
