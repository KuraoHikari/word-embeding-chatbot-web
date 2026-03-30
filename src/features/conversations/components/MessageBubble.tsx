import { cn } from "@/lib/utils";
import type { DisplayMessage } from "../types";
import { isTempMessage } from "../types";
import { format } from "date-fns";
import { Bot, User, Shield } from "lucide-react";

// ============================================================
// MessageBubble — single chat message with alignment + status
// Supports 3 sender roles: admin (right), bot (left), contact (left)
// ============================================================

interface MessageBubbleProps {
 message: DisplayMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
 const role = message.senderRole ?? (message.isBot ? "bot" : "contact");
 const isAdmin = role === "admin";
 const isBot = role === "bot";
 const isContact = role === "contact";
 const isTemp = isTempMessage(message);
 const isError = isTemp && message._status === "error";

 const timestamp = message.createdAt ? format(new Date(message.createdAt), "HH:mm") : "";

 // Admin messages align right, bot & contact align left
 const alignRight = isAdmin;

 return (
  <div className={cn("flex w-full mb-2 gap-2", alignRight ? "justify-end" : "justify-start")}>
   {/* Avatar for left-aligned messages */}
   {!alignRight && (
    <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-1", isBot ? "bg-blue-100 text-blue-600" : "bg-muted text-muted-foreground")}>
     {isBot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
    </div>
   )}

   <div
    className={cn(
     "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
     isAdmin && "bg-primary text-primary-foreground rounded-br-sm",
     isBot && "bg-blue-50 text-foreground rounded-bl-sm border border-blue-200",
     isContact && "bg-muted text-foreground rounded-bl-sm",
     isTemp && !isError && "opacity-60",
     isError && "bg-destructive/20 text-destructive border border-destructive/30",
    )}
   >
    {/* Role label */}
    <p className={cn("text-[10px] font-medium mb-0.5", isAdmin && "text-primary-foreground/70", isBot && "text-blue-600", isContact && "text-muted-foreground")}>
     {isAdmin ? "You" : isBot ? "Bot" : "Customer"}
    </p>

    <p className="whitespace-pre-wrap break-words">{message.text}</p>

    <div className={cn("flex items-center gap-1 mt-1", alignRight ? "justify-end" : "justify-start")}>
     {timestamp && <span className="text-[10px] opacity-60">{timestamp}</span>}

     {/* Delivery status for admin messages */}
     {isAdmin && <span className="text-[10px] opacity-60">{isError ? "✖ Failed" : isTemp ? "Sending…" : "✓"}</span>}
    </div>
   </div>

   {/* Avatar for right-aligned messages */}
   {alignRight && (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
     <Shield className="h-3.5 w-3.5" />
    </div>
   )}
  </div>
 );
}
