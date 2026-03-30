import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ConversationList, ChatPanel, useSocketEvents, useConversationStore } from "@/features/conversations";
import { getSocket } from "@/features/conversations/socket";

// ============================================================
// ConversationsTab — embedded inside ChatbotDetailsMock tabs
// Self-contained: activates socket, renders split layout
// ============================================================

interface ConversationsTabProps {
 chatbotId: number;
}

export function ConversationsTab({ chatbotId: _chatbotId }: ConversationsTabProps) {
 // Activate socket events
 useSocketEvents();

 // Track socket connection status
 const [connected, setConnected] = useState(false);

 useEffect(() => {
  const socket = getSocket();

  const onConnect = () => setConnected(true);
  const onDisconnect = () => setConnected(false);

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  setConnected(socket.connected);

  return () => {
   socket.off("connect", onConnect);
   socket.off("disconnect", onDisconnect);
  };
 }, []);

 const conversationCount = useConversationStore((s) => s.conversations.length);

 return (
  <div className="flex flex-col h-[600px] border border-border rounded-lg overflow-hidden">
   {/* Mini header */}
   <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 shrink-0">
    <p className="text-sm font-medium">
     {conversationCount} Conversation{conversationCount !== 1 ? "s" : ""}
    </p>
    <Badge variant={connected ? "default" : "secondary"} className="gap-1 text-xs">
     {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
     {connected ? "Live" : "Offline"}
    </Badge>
   </div>

   {/* Split layout */}
   <ResizablePanelGroup direction="horizontal" className="flex-1">
    <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
     <ConversationList />
    </ResizablePanel>

    <ResizableHandle withHandle />

    <ResizablePanel defaultSize={65} minSize={40}>
     <ChatPanel />
    </ResizablePanel>
   </ResizablePanelGroup>
  </div>
 );
}
