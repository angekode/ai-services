import { LangchainLLMClient } from 'rag_library';
import type { InferStreamResult } from 'rag_library/dist/llm-client-interface.js';
import { type UseCaseResult, type UseCase, ProviderError, ServerError } from 'service_library';
import type { CompletionCommand } from '../types/completion.command.js';


export type UseCaseResultSingleValue = {
  content: string | undefined,
  metadata: Record<string, any>,
  id: string | undefined,
  model: string
};

export type UseCaseResultStreamValue = InferStreamResult;

export class CompletionUseCase implements UseCase<CompletionCommand, UseCaseResultSingleValue, UseCaseResultStreamValue> {

  async execute(command: CompletionCommand): Promise<UseCaseResult<UseCaseResultSingleValue, UseCaseResultStreamValue>> {

    if (command.responseMode === 'single') {

      const client = new LangchainLLMClient();
      const result = await client.infer(
        command.messages,
        command.provider,
        command.model,
        command.key ? { apiKey: command.key } : {}
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
          model: command.model
        }
      };

    } else if (command.responseMode === 'stream') {

      const client = new LangchainLLMClient();
      const result = await client.inferStream(
        command.messages,
        command.provider,
        command.model,
        command.key ? { apiKey: command.key } : {}
      );

      return {
        kind: 'stream',
        stream: result
      };

    } else {
      throw new ServerError('Mode de réponse inconnu');
    }
  }
}
