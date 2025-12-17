export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type InferOptions = {
  apiKey?: string;
};

export type InferResult = 
  { type: 'message',  content: string } |
  { type: 'error', message: string };

export type InferStreamResult = 
  { type: "message.delta", content: string } | 
  { type: "message.done" } |
  { type: "error", message: string };

export type TextChunk = {
  content: string;
  metaData: Record<string, string>;
};

export type EmbedOptions = Record<string, unknown>;

export type EmbedVector = {
  index: number;
  vector: number[];
}

export type EmbedResult = {
  embeddings: EmbedVector[];
}

export type SimilarEmbeddingsResult = {
  index: number;
  similarity: number;
};

export type SimilarEmbeddingsOptions = {
  maxResultCount: number;
};

export interface LLMClientInterface {
  infer(messages: Message[], provider: string, model: string, options?: InferOptions) : Promise<InferResult>;
 /* 
  inferStream(messages: Message[], provider: string, model: string, options?: InferOptions) : AsyncGenerator<InferStreamResult>;
  embed(texts: TextChunk[], provider: string, model: string, options?: EmbedOptions) : Promise<EmbedResult>;
  getSimilarEmbeddings(target: string, vectors: EmbedVector[], options?: SimilarEmbeddingsOptions): SimilarEmbeddingsResult[];
*/
}
