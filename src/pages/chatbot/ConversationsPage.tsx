import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ConversationList, ChatPanel, useSocketEvents, useConversationStore } from "@/features/conversations";
import { useGetChatbotDetail } from "@/api/queries/chatbot";
import { getSocket } from "@/features/conversations/socket";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================
// ConversationsPage — full-page realtime conversations view
// Layout: sidebar conversation list (30%) | chat panel (70%)
// ============================================================

export default function ConversationsPage() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const chatbotId = parseInt(id || "0");

 const { data: chatbot, isLoading: chatbotLoading } = useGetChatbotDetail(chatbotId, !!id);

 // Activate socket events for this page
 useSocketEvents();

 // Track socket connection status
 const [connected, setConnected] = useState(false);

 useEffect(() => {
  const socket = getSocket();

  const onConnect = () => setConnected(true);
  const onDisconnect = () => setConnected(false);

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  // Check current state
  setConnected(socket.connected);

  return () => {
   socket.off("connect", onConnect);
   socket.off("disconnect", onDisconnect);
  };
 }, []);

 // Count active conversations
 const conversationCount = useConversationStore((s) => s.conversations.length);

 if (chatbotLoading) {
  return (
   <div className="flex flex-col h-full p-6 gap-4">
    <div className="flex items-center gap-4">
     <Skeleton className="h-10 w-10 rounded" />
     <div className="flex flex-col gap-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-32" />
     </div>
    </div>
    <Skeleton className="flex-1" />
   </div>
  );
 }

 if (!chatbot) {
  return (
   <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
    <Bot className="h-12 w-12 text-muted-foreground" />
    <p className="text-lg font-medium">Chatbot not found</p>
    <Button variant="outline" onClick={() => navigate("/chatbot")}>
     Back to Chatbots
    </Button>
   </div>
  );
 }

 return (
  <div className="flex flex-col h-[calc(100vh-4rem)]">
   {/* Header */}
   <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
    <div className="flex items-center gap-3">
     <Button variant="ghost" size="icon" onClick={() => navigate(`/chatbot/${chatbotId}`)}>
      <ArrowLeft className="h-4 w-4" />
     </Button>
     <Bot className="h-5 w-5 text-blue-600" />
     <div>
      <h1 className="text-sm font-semibold leading-tight">{chatbot.title}</h1>
      <p className="text-xs text-muted-foreground">
       {conversationCount} conversation{conversationCount !== 1 ? "s" : ""}
      </p>
     </div>
    </div>

    <div className="flex items-center gap-2">
     {/* Connection status */}
     <Badge variant={connected ? "default" : "secondary"} className="gap-1 text-xs">
      {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
      {connected ? "Connected" : "Disconnected"}
     </Badge>
    </div>
   </div>

   {/* Main content — resizable split */}
   <ResizablePanelGroup direction="horizontal" className="flex-1">
    <ResizablePanel defaultSize={30} minSize={20} maxSize={45}>
     <ConversationList />
    </ResizablePanel>

    <ResizableHandle withHandle />

    <ResizablePanel defaultSize={70} minSize={40}>
     <ChatPanel />
    </ResizablePanel>
   </ResizablePanelGroup>
  </div>
 );
}
