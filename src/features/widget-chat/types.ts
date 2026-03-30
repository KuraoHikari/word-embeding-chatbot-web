// ============================================================
// Widget Chat — Domain Types
// ============================================================

export const WIDGET_STATES = ["VALIDATING", "NOT_PUBLIC", "FORM", "CONNECTING", "ACTIVE", "ERROR"] as const;

export type WidgetState = (typeof WIDGET_STATES)[number];

export interface WidgetChatbot {
 id: number;
 title: string;
 isPublic: boolean;
 status?: string;
 welcomeMessage: string;
}

export interface WidgetMessage {
 id: number;
 text: string;
 conversationId: number;
 isBot: boolean;
 senderRole: "admin" | "bot" | "contact";
 createdAt: string | null;
}

export interface TempWidgetMessage extends WidgetMessage {
 _tempId: string;
 _status: "sending" | "sent" | "error";
}

export type DisplayWidgetMessage = WidgetMessage | TempWidgetMessage;

export function isTempWidgetMessage(msg: DisplayWidgetMessage): msg is TempWidgetMessage {
 return "_tempId" in msg;
}

// ============================================================
// Socket Event Payloads
// ============================================================

export interface WidgetMessageSendPayload {
 text: string;
 conversationId: number;
 chatbotId: number;
}

export interface WidgetMessageNewPayload {
 id: number;
 text: string;
 conversationId: number;
 isBot: boolean;
 senderRole: "admin" | "bot" | "contact";
 createdAt: string;
}

export interface WidgetClientToServerEvents {
 "message:send": (payload: WidgetMessageSendPayload) => void;
 "conversation:join": (payload: { conversationId: number }) => void;
}

export interface WidgetServerToClientEvents {
 "message:new": (payload: WidgetMessageNewPayload) => void;
}
