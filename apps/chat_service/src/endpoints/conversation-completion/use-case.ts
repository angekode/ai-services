import { LangchainLLMClient } from 'rag_library';
import type { InferStreamResult } from 'rag_library/dist/llm-client-interface.js';

import { ServerError, type UseCase, type UseCaseResult, ProviderError } from "service_library";
import { type ConversationCompletionCommand } from "./command.js";
import type { Infer } from 'zod';
import dbClient  from '../../database/client.js';

export type ConversationCompletionUseCaseResultSingleValue = {
  content: string;
  metadata: unknown;
  id: string | undefined;
  model: string;
};

export type ConversationCompletionUseCaseResultStreamValue = InferStreamResult;

type Message = {
  role: 'user' | 'system' | 'assistant';
  content : string;
};

export class ConversationCompletionUseCase implements UseCase<ConversationCompletionCommand, ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue> {
  async execute(command: ConversationCompletionCommand): Promise<UseCaseResult<ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue>> {

    if (!process.env.LLM_PROVIDER || !process.env.LLM_MODEL) {
      throw new ServerError('Variables d\' environnement llm non définies');
    }

    const conversations = await dbClient.messageModel?.getEntries({ conversation_id: Number(command.conversationId) });
    if (!conversations) {
      throw new ServerError(`Conversation non trouvée: ${command.conversationId}`);
    }
    let messages : Message[] = conversations.map(m => { 
      if (!['user', 'system', 'assistant'].includes(m.role)) {
        throw new ServerError('Role de message invalide');
      }
      return {
        role : m.role as 'user' | 'system' | 'assistant', 
        content: m.content 
      }
    });


    messages = [...messages, ...command.messages];

    if (command.stream === false) {

      const client = new LangchainLLMClient();
      const result = await client.infer(
        messages,
        process.env.LLM_PROVIDER,
        process.env.LLM_MODEL,
        process.env.LLM_KEY  ? { apiKey: process.env.LLM_KEY } : {}
      );

      if (result.type === 'error') {
        throw new ProviderError(result.message);
      }

      return {
        kind: 'single',
        value: {
          content: result.content,
          metadata: result.metadata,
          id: result.id,
          model: process.env.LLM_MODEL
        }
      };

    } else {

      const client = new LangchainLLMClient();
      const result = await client.inferStream(
        messages,
        process.env.LLM_PROVIDER,
        process.env.LLM_MODEL,
        process.env.LLM_KEY  ? { apiKey: process.env.LLM_KEY } : {}
      );

      return {
        kind: 'stream',
        stream: result
      };

    }
  }
}
