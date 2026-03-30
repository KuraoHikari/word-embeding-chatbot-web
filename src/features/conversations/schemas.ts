import { z } from "zod";

// ============================================================
// Inbound socket event schemas — validate before Zustand mutation
// ============================================================

export const messageNewSchema = z.object({
 id: z.number(),
 text: z.string(),
 conversationId: z.number(),
 userId: z.number(),
 isBot: z.boolean(),
 senderRole: z.enum(["admin", "bot", "contact"]),
 createdAt: z.string().nullable(),
 updatedAt: z.string().nullable(),
});

export const messageTypingSchema = z.object({
 conversationId: z.number(),
 userId: z.number(),
 isTyping: z.boolean(),
});

export const presenceUpdateSchema = z.object({
 userId: z.number(),
 contactId: z.number().optional(),
 isOnline: z.boolean(),
});

export const autoReplyUpdatedSchema = z.object({
 conversationId: z.number(),
 autoReply: z.boolean(),
});

export const conversationNewSchema = z.object({
 id: z.number(),
 userId: z.number(),
 chatbotId: z.number(),
 contactId: z.number(),
 autoReply: z.boolean(),
 createdAt: z.string().nullable(),
 updatedAt: z.string().nullable(),
 lastMessage: z.null(),
 contact: z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  userId: z.number(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
 }),
});

// ============================================================
// Outbound socket event schemas — validate before emitting
// ============================================================

export const messageSendSchema = z.object({
 text: z.string().min(1).max(500),
 conversationId: z.number().min(1),
 chatbotId: z.number().min(1),
 senderRole: z.enum(["admin", "contact"]).optional(),
});
