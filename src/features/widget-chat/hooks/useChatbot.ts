import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchChatbot } from "../api";
import { useWidgetChatStore } from "../store";

// ============================================================
// useChatbot — validates chatbot on mount, syncs to store
// ============================================================

export function useChatbot(chatbotId: number) {
 const { setWidgetState, setChatbot } = useWidgetChatStore();

 const query = useQuery({
  queryKey: ["widget-chatbot", chatbotId],
  queryFn: () => fetchChatbot(chatbotId),
  enabled: chatbotId > 0,
  retry: 1,
  staleTime: Infinity,
 });

 useEffect(() => {
  if (query.isLoading) {
   setWidgetState("VALIDATING");
   return;
  }

  if (query.isError) {
   setWidgetState("ERROR");
   return;
  }

  if (query.data) {
   if (query.data.isPublic !== true) {
    setWidgetState("NOT_PUBLIC");
    return;
   }

   if (query.data.status && query.data.status !== "active") {
    setWidgetState("ERROR");
    return;
   }

   setChatbot({
    id: query.data.id,
    title: query.data.title,
    isPublic: query.data.isPublic,
    status: query.data.status,
    welcomeMessage: query.data.welcomeMessage,
   });
   setWidgetState("FORM");
  }
 }, [query.data, query.isLoading, query.isError, setWidgetState, setChatbot]);

 return query;
}
