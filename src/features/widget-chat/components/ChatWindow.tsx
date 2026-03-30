import { useRef, useEffect } from "react";
import { useWidgetChatStore } from "../store";
import { ChatInput } from "./ChatInput";
import { isTempWidgetMessage, type DisplayWidgetMessage } from "../types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ============================================================
// MessageBubble
// ============================================================

function MessageBubble({ message }: { message: DisplayWidgetMessage }) {
 const role = message.senderRole ?? (message.isBot ? "bot" : "contact");
 const isContact = role === "contact";
 const isAdmin = role === "admin";
 const isBot = role === "bot";
 const isTemp = isTempWidgetMessage(message);
 const isError = isTemp && message._status === "error";
 const isSending = isTemp && message._status === "sending";

 // In widget view: contact (customer) messages on right, admin+bot on left
 const alignRight = isContact;

 return (
  <div className={cn("flex w-full", alignRight ? "justify-end" : "justify-start")}>
   <div
    className={cn(
     "max-w-[80%] rounded-xl px-4 py-2 text-sm leading-relaxed",
     isContact && "rounded-br-sm bg-blue-600 text-white",
     isBot && "rounded-bl-sm bg-gray-100 text-gray-900",
     isAdmin && "rounded-bl-sm bg-emerald-50 text-gray-900 border border-emerald-200",
     isError && "bg-red-100 text-red-700",
     isSending && "opacity-70",
    )}
   >
    {/* Role label for admin messages */}
    {isAdmin && <p className="text-[10px] font-semibold text-emerald-600 mb-0.5">Admin</p>}

    <p className="whitespace-pre-wrap break-words">{message.text}</p>
    {isSending && (
     <span className="mt-1 flex items-center gap-1 text-[10px] opacity-60">
      <Loader2 className="h-3 w-3 animate-spin" />
      Sending…
     </span>
    )}
    {isError && <span className="mt-1 block text-[10px] font-medium text-red-600">Failed to send</span>}
   </div>
  </div>
 );
}

// ============================================================
// ChatWindow — main active chat view
// ============================================================

interface ChatWindowProps {
 sendMessage: (text: string) => void;
}

export function ChatWindow({ sendMessage }: ChatWindowProps) {
 const chatbot = useWidgetChatStore((s) => s.chatbot);
 const messages = useWidgetChatStore((s) => s.messages);

 const scrollRef = useRef<HTMLDivElement>(null);

 // Auto-scroll on new messages
 useEffect(() => {
  const el = scrollRef.current;
  if (el) {
   el.scrollTop = el.scrollHeight;
  }
 }, [messages]);

 return (
  <div className="flex h-screen w-full flex-col bg-white">
   {/* Header */}
   <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-gray-100 bg-blue-600 px-5">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">🤖</div>
    <div className="flex flex-col">
     <span className="text-sm font-semibold text-white">{chatbot?.title ?? "Chat"}</span>
     <span className="text-xs text-blue-100">● Online</span>
    </div>
   </div>

   {/* Messages */}
   <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
    {/* Welcome message */}
    {chatbot?.welcomeMessage && (
     <div className="flex w-full justify-start">
      <div className="max-w-[80%] rounded-xl rounded-bl-sm bg-gray-100 px-4 py-2 text-sm leading-relaxed text-gray-900">
       <p className="whitespace-pre-wrap break-words">{chatbot.welcomeMessage}</p>
      </div>
     </div>
    )}

    {messages.map((msg, idx) => (
     <MessageBubble key={isTempWidgetMessage(msg) ? msg._tempId : (msg.id ?? idx)} message={msg} />
    ))}
   </div>

   {/* Input */}
   <ChatInput onSend={sendMessage} />
  </div>
 );
}
