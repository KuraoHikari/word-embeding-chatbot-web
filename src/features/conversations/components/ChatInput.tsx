import { useState, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConversationStore } from "../store";
import { getSocket } from "../socket";
import { messageSendSchema } from "../schemas";
import type { TempMessage } from "../types";

// ============================================================
// ChatInput — compose + optimistic send via socket
// ============================================================

interface ChatInputProps {
 conversationId: number;
 chatbotId: number;
}

export function ChatInput({ conversationId, chatbotId }: ChatInputProps) {
 const [text, setText] = useState("");
 const addMessage = useConversationStore((s) => s.addMessage);
 const markTempMessageError = useConversationStore((s) => s.markTempMessageError);

 const handleSend = useCallback(() => {
  const trimmed = text.trim();
  if (!trimmed) return;

  const payload = { text: trimmed, conversationId, chatbotId, senderRole: "admin" as const };

  // Validate outbound payload
  const result = messageSendSchema.safeParse(payload);
  if (!result.success) {
   console.error("[ChatInput] Invalid payload", result.error);
   return;
  }

  // Create temp message for optimistic UI
  const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const tempMessage: TempMessage = {
   id: -Date.now(), // Negative temp id — will never collide with server ids
   text: trimmed,
   conversationId,
   userId: 0,
   isBot: false,
   senderRole: "admin",
   createdAt: new Date().toISOString(),
   updatedAt: null,
   _tempId: tempId,
   _status: "sending",
  };

  // 1. Optimistically append
  addMessage(conversationId, tempMessage);

  // 2. Emit socket event
  const socket = getSocket();
  if (socket.connected) {
   socket.emit("message:send", result.data);
  } else {
   // Socket not connected — mark as error
   markTempMessageError(tempId);
  }

  // 3. Clear input
  setText("");
 }, [text, conversationId, chatbotId, addMessage, markTempMessageError]);

 const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
   e.preventDefault();
   handleSend();
  }
 };

 return (
  <div className="flex items-center gap-2 p-3 border-t border-border">
   <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your message..." className="flex-1" />
   <Button size="icon" onClick={handleSend} disabled={!text.trim()} aria-label="Send message">
    <Send className="h-4 w-4" />
   </Button>
  </div>
 );
}
