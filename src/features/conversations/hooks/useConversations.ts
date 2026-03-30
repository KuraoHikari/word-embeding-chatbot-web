import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "../api";
import { useConversationStore } from "../store";
import { useEffect } from "react";

// ============================================================
// useConversations — REST fetch → hydrate Zustand
// Returns only loading/error status. Components MUST read from
// Zustand, never from query.data.
//
// IMPORTANT: Hydration happens in useEffect, NOT inside queryFn.
// Calling set() inside queryFn triggers useSyncExternalStore
// snapshot mismatch during commit → infinite "Maximum update
// depth exceeded" loop.
// ============================================================

export function useConversations() {
 const query = useQuery({
  queryKey: ["conversations"],
  queryFn: fetchConversations,
  staleTime: 30_000,
  retry: (failureCount, error) => {
   // Don't retry auth errors — prevents repeated 401s
   if (error instanceof Error && error.message === "Unauthorized") return false;
   return failureCount < 2;
  },
 });

 // Hydrate Zustand when query data arrives or updates.
 // Uses getState() to avoid subscribing this hook to the store.
 useEffect(() => {
  if (query.data) {
   useConversationStore.getState().setConversations(query.data);
  }

  return () => {
   // cleanup placeholder (FE_RULES_STRICT)
  };
 }, [query.data]);

 // Expose only status — never expose `data`
 return { isLoading: query.isLoading, isError: query.isError, error: query.error, refetch: query.refetch };
}
