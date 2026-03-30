import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useChatbot, useWidgetChatStore, useWidgetSocket, NotPublicState, ContactForm, ConnectingState, ChatWindow, ErrorState } from "@/features/widget-chat";

// ============================================================
// ChatbotCustomerPage — standalone page rendered at
// /chatbot-costumer/:chatbotId
// ============================================================

export default function ChatbotCustomerPage() {
 const { chatbotId } = useParams<{ chatbotId: string }>();
 const parsedId = Number(chatbotId);
 const widgetState = useWidgetChatStore((s) => s.widgetState);
 const reset = useWidgetChatStore((s) => s.reset);

 // Validate chatbot on mount — syncs to store
 useChatbot(parsedId);

 // Connect socket at page level so it fires during CONNECTING state
 // (not only when ChatWindow renders at ACTIVE state)
 const { sendMessage } = useWidgetSocket();

 // Cleanup store on unmount
 useEffect(() => {
  return () => {
   reset();
  };
 }, [reset]);

 // ── Render by state ──────────────────────────────────────
 switch (widgetState) {
  case "VALIDATING":
   return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
     <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
   );
  case "NOT_PUBLIC":
   return <NotPublicState />;
  case "FORM":
   return <ContactForm />;
  case "CONNECTING":
   return <ConnectingState />;
  case "ACTIVE":
   return <ChatWindow sendMessage={sendMessage} />;
  case "ERROR":
   return <ErrorState />;
  default:
   return <ErrorState />;
 }
}
