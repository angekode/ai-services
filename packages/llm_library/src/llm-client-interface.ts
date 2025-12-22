export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type InferOptions = {
  apiKey?: string;
};

export type InferResult = 
{ 
  type: 'message',
  content: string,
  metadata: Record<string, any>,
  id: string | undefined,
} |
{ 
  type: 'error',
  message: string 
};

export type InferStreamResult = 
  { type: "message.delta", content: string, metadata: Record<string, any>, id: string | undefined } | 
  { type: "message.done" } |
  { type: "error", message: string };

export type TextChunk = {
  content: string;
  metaData: Record<string, string>;
};

export type EmbedOptions = {
  apiKey?: string;
}

export type EmbedVector = number[];

export type EmbedResult = number[][];

export type SimilarityResult = {
  index: number;
  similarity: number;
};

export type SimilarEmbeddingsOptions = { 
  apiKey?: string;
  maxResultCount?: number;
};

export interface LLMClientInterface {
  infer(messages: Message[], provider: string, model: string, options?: InferOptions) : Promise<InferResult>;
  inferStream(messages: Message[], provider: string, model: string, options?: InferOptions) : AsyncGenerator<InferStreamResult>;
  embed(texts: TextChunk[], provider: string, model: string, options?: EmbedOptions) : Promise<EmbedResult>;
  calculateSimilarity(target: string, vectors: EmbedVector[], provider: string, model: string, options?: SimilarEmbeddingsOptions): Promise<SimilarityResult[]>;
}
