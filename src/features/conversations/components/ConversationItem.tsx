import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Conversation } from "../types";
import { useConversationStore } from "../store";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

// ============================================================
// ConversationItem — single row in the conversation list
// Memoized to prevent unnecessary re-renders (FE_RULES_STRICT).
// Uses shallow selectors from Zustand.
// ============================================================

interface ConversationItemProps {
 conversation: Conversation;
}

export const ConversationItem = memo(function ConversationItem({ conversation }: ConversationItemProps) {
 const activeConversationId = useConversationStore((s) => s.activeConversationId);
 const setActiveConversation = useConversationStore((s) => s.setActiveConversation);
 const resetUnread = useConversationStore((s) => s.resetUnread);
 const isOnline = useConversationStore((s) => s.onlineContacts[conversation.contactId] ?? false);
 const unreadCount = useConversationStore((s) => s.unreadByConversation[conversation.id] ?? 0);

 const isActive = activeConversationId === conversation.id;
 const hasUnread = unreadCount > 0;

 const lastMessageText = conversation.lastMessage?.text ?? "No messages yet";
 const truncatedText = lastMessageText.length > 40 ? `${lastMessageText.slice(0, 40)}…` : lastMessageText;

 const lastMessageTime = conversation.lastMessage?.createdAt
  ? formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
     addSuffix: true,
    })
  : null;

 const handleClick = useCallback(() => {
  setActiveConversation(conversation.id);
  resetUnread(conversation.id);
 }, [setActiveConversation, resetUnread, conversation.id]);

 return (
  <button
   type="button"
   onClick={handleClick}
   className={cn("w-full text-left px-4 py-3 border-b border-border transition-colors", "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", isActive && "bg-accent")}
  >
   <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-2 min-w-0">
     {/* Online indicator */}
     <span className={cn("inline-block h-2 w-2 rounded-full shrink-0", isOnline ? "bg-green-500" : "bg-muted-foreground/40")} />

     <span className={cn("text-sm truncate", hasUnread ? "font-semibold" : "font-medium")}>{conversation.contact.name}</span>
    </div>

    {/* Unread badge */}
    {hasUnread && (
     <Badge variant="destructive" className="shrink-0 h-5 min-w-5 flex items-center justify-center text-[10px] px-1.5">
      {unreadCount > 99 ? "99+" : unreadCount}
     </Badge>
    )}
   </div>

   <p className={cn("text-xs text-muted-foreground truncate mt-1", hasUnread && "font-medium text-foreground")}>{truncatedText}</p>

   {lastMessageTime && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{lastMessageTime}</p>}
  </button>
 );
});
