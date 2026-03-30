import { useQuery } from "@tanstack/react-query";
import { fetchConversationById } from "../api";
import { useConversationStore } from "../store";
import { useEffect, useRef } from "react";

// ============================================================
// useConversation — fetch single conversation → hydrate messages
// ============================================================

export function useConversation(id: number | null) {
 const setMessages = useConversationStore((s) => s.setMessages);
 const setActiveConversation = useConversationStore((s) => s.setActiveConversation);
 const hydrated = useRef(false);

 const query = useQuery({
  queryKey: ["conversation", id],
  queryFn: () => fetchConversationById(id!),
  enabled: id !== null,
  staleTime: 30_000,
  retry: (failureCount, error) => {
   if (error instanceof Error && error.message === "Unauthorized") return false;
   return failureCount < 2;
  },
 });

 useEffect(() => {
  if (id !== null) {
   setActiveConversation(id);
  }

  return () => {
   // Do not reset active on unmount — let parent control that
  };
 }, [id, setActiveConversation]);

 useEffect(() => {
  if (query.data && !hydrated.current) {
   setMessages(query.data.id, query.data.messages);
   hydrated.current = true;
  }

  return () => {
   hydrated.current = false;
  };
 }, [query.data, setMessages]);

 return query;
}
