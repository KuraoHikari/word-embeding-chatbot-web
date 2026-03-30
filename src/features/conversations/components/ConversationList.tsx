import { useConversationStore } from "../store";
import { useConversations } from "../hooks/useConversations";
import { ConversationItem } from "./ConversationItem";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

// ============================================================
// ConversationList — sidebar list with search, loading, empty, error
// Reads ONLY from Zustand. React Query is just for fetch status.
// ============================================================

export function ConversationList() {
 // Zustand — single source of truth
 const conversations = useConversationStore((s) => s.conversations);

 // React Query — fetch status only (no data exposure)
 const { isLoading, isError } = useConversations();

 const queryClient = useQueryClient();
 const [search, setSearch] = useState("");

 const filtered = useMemo(() => {
  if (!search.trim()) return conversations;
  const q = search.toLowerCase();
  return conversations.filter((c) => c.contact.name.toLowerCase().includes(q) || (c.lastMessage?.text ?? "").toLowerCase().includes(q));
 }, [conversations, search]);

 const handleRetry = useCallback(() => {
  queryClient.invalidateQueries({ queryKey: ["conversations"] });
 }, [queryClient]);

 // ── Loading state ──────────────────────────────────────────
 if (isLoading) {
  return (
   <div className="flex flex-col gap-1 p-4">
    <Skeleton className="h-9 w-full mb-2" />
    {Array.from({ length: 3 }).map((_, i) => (
     <div key={i} className="flex flex-col gap-2 py-3 px-4">
      <div className="flex items-center gap-2">
       <Skeleton className="h-2 w-2 rounded-full" />
       <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-2.5 w-16" />
     </div>
    ))}
   </div>
  );
 }

 // ── Error state ────────────────────────────────────────────
 if (isError) {
  return (
   <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
    <AlertTriangle className="h-8 w-8 text-destructive" />
    <p className="text-sm font-medium">Failed to load conversations</p>
    <p className="text-xs text-muted-foreground">Please check your connection</p>
    <Button variant="outline" size="sm" onClick={handleRetry}>
     Retry
    </Button>
   </div>
  );
 }

 return (
  <div className="flex flex-col h-full">
   {/* Search */}
   <div className="p-3 border-b border-border">
    <Input placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" />
   </div>

   {/* List */}
   <div className="flex-1 overflow-y-auto">
    {filtered.length === 0 ? (
     <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
      <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
      <p className="text-sm font-medium">No Conversations Yet</p>
      <p className="text-xs text-muted-foreground">Conversations will appear when users start chatting with your bot.</p>
     </div>
    ) : (
     filtered.map((c) => <ConversationItem key={c.id} conversation={c} />)
    )}
   </div>
  </div>
 );
}
