// ============================================================
// Conversations Feature — Public API
// ============================================================

// Types
export type {
 Conversation,
 ConversationDetail,
 Contact,
 Message,
 DisplayMessage,
 TempMessage,
 MessageSendPayload,
 MessageNewPayload,
 MessageTypingPayload,
 PresenceUpdatePayload,
 AutoReplyUpdatedPayload,
 ClientToServerEvents,
 ServerToClientEvents,
} from "./types";

// Store
export { useConversationStore } from "./store";

// Hooks
export { useConversations } from "./hooks/useConversations";
export { useConversation } from "./hooks/useConversation";
export { useSocketEvents } from "./hooks/useSocketEvents";

// Socket
export { connectSocket, disconnectSocket, getSocket } from "./socket";

// Components
export { ConversationList } from "./components/ConversationList";
export { ConversationItem } from "./components/ConversationItem";
export { ChatPanel } from "./components/ChatPanel";
export { MessageBubble } from "./components/MessageBubble";
export { ChatInput } from "./components/ChatInput";
export { AutoReplyToggle } from "./components/AutoReplyToggle";
export { ConversationsTab } from "./components/ConversationsTab";
