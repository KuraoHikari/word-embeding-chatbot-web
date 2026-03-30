// ============================================================
// Conversations Feature — Domain Types
// ============================================================

export interface Contact {
 id: number;
 name: string;
 email: string;
 phone: string | null;
 userId: number;
 createdAt: string | null;
 updatedAt: string | null;
}

export interface Message {
 id: number;
 text: string;
 conversationId: number;
 userId: number;
 isBot: boolean;
 senderRole: "admin" | "bot" | "contact";
 createdAt: string | null;
 updatedAt: string | null;
}

export interface Conversation {
 id: number;
 userId: number;
 chatbotId: number;
 contactId: number;
 autoReply: boolean;
 createdAt: string | null;
 updatedAt: string | null;
 lastMessage: Message | null;
 contact: Contact;
}

export interface ConversationDetail {
 id: number;
 userId: number;
 chatbotId: number;
 contactId: number;
 autoReply: boolean;
 createdAt: string | null;
 updatedAt: string | null;
 messages: Message[];
}

// ============================================================
// Temporary message for optimistic UI
// ============================================================

export interface TempMessage extends Omit<Message, "id"> {
 id: number;
 _tempId: string;
 _status: "sending" | "sent" | "error";
}

export type DisplayMessage = Message | TempMessage;

export function isTempMessage(msg: DisplayMessage): msg is TempMessage {
 return "_tempId" in msg;
}

// ============================================================
// Socket Event Payloads
// ============================================================

export interface MessageSendPayload {
 text: string;
 conversationId: number;
 chatbotId: number;
 senderRole?: "admin" | "contact";
}

export interface MessageNewPayload {
 id: number;
 text: string;
 conversationId: number;
 userId: number;
 isBot: boolean;
 senderRole: "admin" | "bot" | "contact";
 createdAt: string | null;
 updatedAt: string | null;
}

export interface MessageTypingPayload {
 conversationId: number;
 userId: number;
 isTyping: boolean;
}

export interface PresenceUpdatePayload {
 userId: number;
 isOnline: boolean;
}

export interface AutoReplyUpdatedPayload {
 conversationId: number;
 autoReply: boolean;
}

export interface ConversationNewPayload {
 id: number;
 userId: number;
 chatbotId: number;
 contactId: number;
 autoReply: boolean;
 createdAt: string | null;
 updatedAt: string | null;
 lastMessage: null;
 contact: Contact;
}

// ============================================================
// Socket Events Map
// ============================================================

export interface ClientToServerEvents {
 "message:send": (payload: MessageSendPayload) => void;
 "message:typing": (payload: { conversationId: number }) => void;
 "conversation:join": (payload: { conversationId: number }) => void;
 "conversation:leave": (payload: { conversationId: number }) => void;
}

export interface ServerToClientEvents {
 "message:new": (payload: MessageNewPayload) => void;
 "message:typing": (payload: MessageTypingPayload) => void;
 "presence:update": (payload: PresenceUpdatePayload) => void;
 "conversation:autoReplyUpdated": (payload: AutoReplyUpdatedPayload) => void;
 "conversation:new": (payload: ConversationNewPayload) => void;
}
