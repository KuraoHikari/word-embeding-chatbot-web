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

// Chatbot Details with stats (for detail page)
export interface ChatbotDetail extends Chatbot {
 totalMessages: number;
 totalConversations: number;
 totalAiResponses: number;
 testConversationId: number;
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

// Message types
export interface Message {
 id: number;
 text: string;
 conversationId: number;
 userId: number;
 isBot: boolean;
 createdAt: string | null;
 updatedAt: string | null;
 results?: QueryProposedModelResponse | QueryBaselineModelResponse;
}

export interface CreateMessagePayload {
 text: string;
 conversationId: number;
 chatbotId: number;
}

export interface QueryProposedModelResponse {
 status: "success";
 query: string;
 processing_time: number;
 complexity_analysis: {
  type: string;
  score: number;
  word_count: number;
  unique_words: number;
  question_words: number;
  weights_used: Record<string, number>;
 };
 search_pipeline: {
  hybrid_search_results: number;
  mmr_reranked_results: number;
  mmr_lambda: number;
  similarity_threshold: number;
 };
 results: Array<{
  rank: number;
  text: string;
  doc_index: number;
  final_score: number;
  diversity_penalty: number;
  original_rank: number;
  detailed_scores?: {
   fasttext_similarity: number;
   bm25_score: number;
   context_score: number;
   weighted_score: number;
  };
  context_range?: string;
 }>;
 metadata: {
  model_type: string;
  documents_count: number;
  features_used: {
   semantic_search: boolean;
   keyword_search: boolean;
   context_scoring: boolean;
   mmr_reranking: boolean;
   gpt_generation: boolean;
   ragas_evaluation: boolean;
  };
 };
 gpt_generation?: {
  answer?: string;
  model_used?: string;
  tokens_used?: number;
  prompt_tokens?: number;
  completion_tokens?: number;
  error?: string;
 };
 ragas_evaluation?: {
  context_relevance?: number;
  faithfulness?: number;
  answer_relevance?: number;
  overall_score?: number;
  error?: string;
 };
 message?: string;
}

export interface QueryBaselineModelResponse {
 status: "success";
 query: string;
 processing_time: number;
 model_approach: string;
 pipeline_steps: string[];
 results: Array<{
  rank: number;
  text: string;
  similarity_score: number;
  doc_index: number;
  method: string;
 }>;
 metadata: {
  model_type: string;
  documents_count: number;
  embedding_dimension: number;
  hyperparameters: Record<string, unknown>;
  features_used: {
   semantic_search: boolean;
   keyword_search: boolean;
   context_scoring: boolean;
   mmr_reranking: boolean;
   gpt_generation: boolean;
   ragas_evaluation: boolean;
  };
 };
 gpt_generation?: {
  answer?: string;
  model_used?: string;
  tokens_used?: number;
  prompt_tokens?: number;
  completion_tokens?: number;
  error?: string;
 };
 ragas_evaluation?: {
  context_relevance?: number;
  faithfulness?: number;
  answer_relevance?: number;
  overall_score?: number;
  error?: string;
 };
}
