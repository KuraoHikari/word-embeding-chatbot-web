export interface ApiError {
 message: string;
 error?: {
  issues: Array<{
   code: string;
   expected?: string;
   received?: string;
   path: string[];
   message: string;
  }>;
  name: string;
 };
 success?: boolean;
}

export interface ApiResponse<T = unknown> {
 data: T;
 message?: string;
}

// Chatbot types
export interface Chatbot {
 id: number;
 title: string;
 description: string | null;
 isPublic: boolean;
 welcomeMessage: string;
 suggestionMessage: string;
 systemPrompt: string;
 aiModel: string;
 isProposedModel: boolean;
 embeddingModel: string;
 temperature: number;
 maxTokens: number;
 pdfTitle: string;
 pdfLink: string;
 userId: number;
 createdAt: string | null;
 updatedAt: string | null;
}

export interface CreateChatbotPayload {
 title: string;
 isPublic: boolean;
 welcomeMessage: string;
 suggestionMessage: string;
 systemPrompt: string;
 aiModel: string;
 isProposedModel: boolean;
 embeddingModel: string;
 temperature: number;
 maxTokens: number;
 pdf: File;
 description?: string;
}

export interface UpdateChatbotPayload {
 title?: string;
 isPublic?: boolean;
 welcomeMessage?: string;
 suggestionMessage?: string;
 systemPrompt?: string;
 aiModel?: string;
 isProposedModel?: boolean;
 embeddingModel?: string;
 temperature?: number;
 maxTokens?: number;
 pdf?: File;
 description?: string;
}
