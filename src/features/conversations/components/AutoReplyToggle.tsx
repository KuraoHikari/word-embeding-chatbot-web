import { useMutation } from "@tanstack/react-query";
import { toggleAutoReply } from "../api";
import { useConversationStore } from "../store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// ============================================================
// AutoReplyToggle — REST mutation, Zustand updated via socket
// ============================================================

interface AutoReplyToggleProps {
 conversationId: number;
 chatbotId: number;
}

export function AutoReplyToggle({ conversationId }: AutoReplyToggleProps) {
 const conversation = useConversationStore((s) => s.conversations.find((c) => c.id === conversationId));

 const mutation = useMutation({
  mutationFn: (autoReply: boolean) => toggleAutoReply(conversationId, autoReply),
  onSuccess: (data) => {
   // Update Zustand directly from API response as reliable fallback.
   // The socket event may also arrive — updateAutoReply is idempotent.
   useConversationStore.getState().updateAutoReply(conversationId, data.autoReply);
  },
 });

 if (!conversation) return null;

 const isToggling = mutation.isPending;

 return (
  <div className="flex items-center gap-2">
   <Label htmlFor={`auto-reply-${conversationId}`} className="text-xs font-medium">
    AutoReply
   </Label>

   {isToggling ? (
    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
   ) : (
    <Switch id={`auto-reply-${conversationId}`} checked={conversation.autoReply} onCheckedChange={(checked) => mutation.mutate(checked)} disabled={isToggling} />
   )}
  </div>
 );
}
