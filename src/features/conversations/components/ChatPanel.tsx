import { useRef, useEffect } from "react";
import { useConversationStore } from "../store";
import { useConversation } from "../hooks/useConversation";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { AutoReplyToggle } from "./AutoReplyToggle";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DisplayMessage } from "../types";

// Stable reference to prevent useSyncExternalStore snapshot mismatches
// that cause infinite "Maximum update depth exceeded" re-render loops.
const EMPTY_MESSAGES: DisplayMessage[] = [];

// ============================================================
// ChatPanel — message thread + input + header
// ============================================================

export function ChatPanel() {
 const activeConversationId = useConversationStore((s) => s.activeConversationId);
 const messages = useConversationStore((s) => {
  const id = s.activeConversationId;
  return id !== null ? (s.messagesByConversation[id] ?? EMPTY_MESSAGES) : EMPTY_MESSAGES;
 });
 const typingUsers = useConversationStore((s) => s.typingUsers);
 const conversation = useConversationStore((s) => s.conversations.find((c) => c.id === s.activeConversationId));
 const onlineContacts = useConversationStore((s) => s.onlineContacts);

 const { isLoading, isError, refetch } = useConversation(activeConversationId);

 const scrollRef = useRef<HTMLDivElement>(null);

 // Auto-scroll on new messages
 useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  // Small delay to ensure DOM has painted
  const timer = setTimeout(() => {
   el.scrollTop = el.scrollHeight;
  }, 50);

  return () => clearTimeout(timer);
 }, [messages.length]);

 // ── No conversation selected ───────────────────────────────
 if (activeConversationId === null) {
  return (
   <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
    <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
    <p className="text-lg font-medium">Select a Conversation</p>
    <p className="text-sm text-muted-foreground">Choose a conversation from the left panel to start chatting.</p>
   </div>
  );
 }

 // ── Loading messages ───────────────────────────────────────
 if (isLoading) {
  return (
   <div className="flex flex-col gap-3 p-6">
    <p className="text-sm text-muted-foreground">Loading messages...</p>
    {Array.from({ length: 4 }).map((_, i) => (
     <Skeleton key={i} className="h-12 w-3/4" />
    ))}
   </div>
  );
 }

 // ── Error state ────────────────────────────────────────────
 if (isError) {
  return (
   <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
    <AlertTriangle className="h-8 w-8 text-destructive" />
    <p className="text-sm font-medium">Failed to load messages</p>
    <Button variant="outline" size="sm" onClick={() => refetch()}>
     Retry
    </Button>
   </div>
  );
 }

 const isTyping = activeConversationId !== null && typingUsers[activeConversationId];
 const contactOnline = conversation ? (onlineContacts[conversation.contactId] ?? false) : false;

 return (
  <div className="flex flex-col h-full">
   {/* Header */}
   {conversation && (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
     <div className="flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${contactOnline ? "bg-green-500" : "bg-muted-foreground/40"}`} />
      <span className="font-medium text-sm">{conversation.contact.name}</span>
      <span className="text-xs text-muted-foreground">{contactOnline ? "Online" : "Offline"}</span>
     </div>

     <AutoReplyToggle conversationId={conversation.id} chatbotId={conversation.chatbotId} />
    </div>
   )}

   {/* Messages */}
   <ScrollArea className="flex-1 m-4">
    <div className="p-4 flex flex-col h-[300px]">
     {messages.map((msg) => (
      <MessageBubble key={msg.id} message={msg} />
     ))}

     {isTyping && <div className="text-xs text-muted-foreground italic mt-1">Typing...</div>}
    </div>
   </ScrollArea>

   {/* Input */}
   {conversation && <ChatInput conversationId={conversation.id} chatbotId={conversation.chatbotId} />}
  </div>
 );
}
