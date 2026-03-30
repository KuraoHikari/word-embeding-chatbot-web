import { useEffect, useRef, useCallback } from "react";
import { connectWidgetSocket, disconnectWidgetSocket } from "../socket";
import { useWidgetChatStore } from "../store";
import { widgetMessageNewSchema } from "../schemas";
import type { WidgetMessageNewPayload } from "../types";
import type { Socket } from "socket.io-client";

// ============================================================
// useWidgetSocket — manages socket lifecycle + event listeners
// ============================================================

export function useWidgetSocket() {
 const { token, activeConversationId, chatbot, setWidgetState, addMessage, replaceTempMessage } = useWidgetChatStore();

 const socketRef = useRef<Socket | null>(null);

 // ── Connect + join room ──────────────────────────────────
 useEffect(() => {
  if (!token || !activeConversationId) return;

  const socket = connectWidgetSocket(token);
  socketRef.current = socket;

  const handleConnect = () => {
   socket.emit("conversation:join", {
    conversationId: activeConversationId,
   });
   setWidgetState("ACTIVE");
  };

  const handleDisconnect = () => {
   setWidgetState("ERROR");
  };

  const handleMessageNew = (payload: WidgetMessageNewPayload) => {
   const parsed = widgetMessageNewSchema.safeParse(payload);
   if (!parsed.success) return;

   const msg = parsed.data;

   const confirmedMessage = {
    id: msg.id,
    text: msg.text,
    conversationId: msg.conversationId,
    isBot: msg.isBot,
    senderRole: msg.senderRole,
    createdAt: msg.createdAt,
   };

   // If it's a bot message, add directly
   if (msg.isBot) {
    addMessage(confirmedMessage);
    return;
   }

   // User message — find matching temp message by text content
   const state = useWidgetChatStore.getState();
   const pendingTemp = state.messages.find((m) => "_tempId" in m && m._status === "sending" && m.text === msg.text && !m.isBot);

   if (pendingTemp && "_tempId" in pendingTemp) {
    replaceTempMessage(pendingTemp._tempId, confirmedMessage);
   } else {
    addMessage(confirmedMessage);
   }
  };

  const handleConnectError = (err: Error) => {
   console.error("[widget-socket] connect_error", err.message);
   setWidgetState("ERROR");
  };

  socket.on("connect", handleConnect);
  socket.on("disconnect", handleDisconnect);
  socket.on("connect_error", handleConnectError);
  socket.on("message:new", handleMessageNew);

  if (socket.connected) {
   handleConnect();
  }

  return () => {
   socket.off("connect", handleConnect);
   socket.off("disconnect", handleDisconnect);
   socket.off("connect_error", handleConnectError);
   socket.off("message:new", handleMessageNew);
   disconnectWidgetSocket();
   socketRef.current = null;
  };
 }, [token, activeConversationId, setWidgetState, addMessage, replaceTempMessage]);

 // ── Send message ─────────────────────────────────────────
 const sendMessage = useCallback(
  (text: string) => {
   if (!socketRef.current?.connected || !activeConversationId || !chatbot) return;

   const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

   // Optimistic UI
   addMessage({
    id: -Date.now(),
    text,
    conversationId: activeConversationId,
    isBot: false,
    senderRole: "contact",
    createdAt: new Date().toISOString(),
    _tempId: tempId,
    _status: "sending",
   });

   socketRef.current.emit("message:send", {
    text,
    conversationId: activeConversationId,
    chatbotId: chatbot.id,
   });
  },
  [activeConversationId, chatbot, addMessage],
 );

 return { sendMessage };
}
