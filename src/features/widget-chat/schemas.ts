import { z } from "zod";

// ============================================================
// Contact form validation
// ============================================================

export const contactFormSchema = z.object({
 name: z.string().min(1, "Name is required"),
 email: z.string().email("Email must be valid"),
 phone: z.string().min(1, "Phone is required"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ============================================================
// Inbound socket payload validation
// ============================================================

export const widgetMessageNewSchema = z.object({
 id: z.number(),
 text: z.string(),
 conversationId: z.number(),
 isBot: z.boolean(),
 senderRole: z.enum(["admin", "bot", "contact"]),
 createdAt: z.string().nullable(),
});
