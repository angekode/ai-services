import { 
  type LLMClientInterface,
  type Message,
  type InferOptions,
  type InferResult,
  type InferStreamResult,
  type TextChunk,
  type EmbedOptions,
  type EmbedResult,
  type EmbedVector,
  type SimilarEmbeddingsOptions,
  type SimilarityResult

} from "../llm-client-interface.js";

import ChatsModels from "./chat/chat-models.js";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BaseMessage } from "@langchain/core/messages";
import EmbeddingsModels from "../langchain/embeddings/embeddings-models.js";
import { cosineSimilarity } from "@langchain/core/utils/math";


/**
 * Permet d'envoyer des requêtes et recevoir des réponses d'inférence et d'embeddings
 * sur des API de LLM de manière générique en indiquant le nom du fournisseur et du 
 * modèle en chaines de caractère.
 */
export default class LangchainLLMClient implements LLMClientInterface {

    async infer(
      messages: Message[], 
      provider: string, 
      model: string, options?: InferOptions
    ) : Promise<InferResult> {

      const chatModel = ChatsModels.create(
        provider,
        model,
        options?.apiKey ?? '',
        options?.gatewayUrl ? { gatewayUrl: options.gatewayUrl } : undefined
      );
      if (!chatModel) {
        throw new Error('Model not created');
      }
      const chunk = await chatModel.invoke(messages.map(m => this.langChainMessage(m)));

      if (typeof chunk.content === 'string') {
        return { 
          type: 'message', 
          content: chunk.content, 
          metadata: chunk.response_metadata,
          id: chunk.id
        };
      
      } else if (Array.isArray(chunk.content)) {
        const text = chunk.content
          .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
          .join('');

        if (!text) {
          return { type: 'error', message: 'No text content' };
        }

        return { 
          type: 'message', 
          content: text, 
          metadata: chunk.response_metadata,
          id: chunk.id 
        };

      } else {
        return { type: 'error', message: 'No text content' };
      }
    }


    async * inferStream(
      messages: Message[], 
      provider: string, model: string, 
      options?: InferOptions
    ) : AsyncGenerator<InferStreamResult> {

      const chatModel = ChatsModels.create(
        provider, 
        model, 
        options?.apiKey ?? '', 
        options?.gatewayUrl ? { gatewayUrl: options.gatewayUrl } : undefined);
      if (!chatModel) {
        throw new Error('Model not created');
      }
      const stream = await chatModel.stream(messages.map(m => this.langChainMessage(m)));
      for await (const chunk of stream) {
        if (typeof chunk.content === 'string') {
          if (chunk.content === '') {
            continue;
          }
          yield { type: 'message.delta', content: chunk.content, metadata: chunk.response_metadata, id: chunk.id };
        
        } else if (Array.isArray(chunk.content)) {
          const text = chunk.content
            .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
            .join('');

          if (!text) {
            yield { type: 'error', message: 'No text content' };
            continue;
          }

          yield { type: 'message.delta', content: text, metadata: chunk.response_metadata, id: chunk.id };
          continue;

        } else {
          yield { type: 'error', message: 'No text content' };
          continue;
        }
      }
      yield { type: 'message.done' };
      return;
    }


    async embed(texts: TextChunk[], provider: string, model: string, options?: EmbedOptions) : Promise<EmbedResult> {
      const embeddingsModel = EmbeddingsModels.create(provider, model, options?.apiKey ?? '');
      // const vectorStore = await MemoryVectorStore.fromTexts(texts.map(t => t.content), {}, embeddingsModel);
      return await embeddingsModel.embedDocuments(texts.map(chunk => chunk.content));
    }

    async calculateSimilarity(target: string, vectors: EmbedVector[], provider: string, model: string, options?: SimilarEmbeddingsOptions): Promise<SimilarityResult[]> {
      const embeddingsModel = EmbeddingsModels.create(provider, model, options?.apiKey ?? '');
      const targetVector = await embeddingsModel.embedQuery(target);
      return vectors.map(
        (vector, index) => ({
          index: index,
          similarity: cosineSimilarity([vector], [targetVector])[0]![0]!
        })
      ).toSorted((resA, resB) => resB.similarity - resA.similarity)
      .slice(0,options?.maxResultCount ?? vectors.length);
    }

    private langChainMessage(message: Message) :  BaseMessage  {
      switch (message.role) {
        case 'user':
          return new HumanMessage(message.content);
        case 'assistant':
          return new AIMessage(message.content);
        case 'system':
          new SystemMessage(message.content);
        default: 
          throw new Error(`Unhandheld role ${message.role}`);   
      }
    }
}