import { test, expect, describe, vi, beforeEach } from 'vitest';
import { CompletionUseCase } from '../src/endpoints/chat-completion/use-cases/completion.use-case';
import { ProviderError } from '../src/endpoint-base/error';
import type { CompletionCommand } from '../src/endpoints/chat-completion/types/completion.command';

import { LangchainLLMClient } from 'rag_library';
import type { InferStreamResult } from 'rag_library/dist/llm-client-interface.js';


const mockInfer = vi.fn();
const mockInferStream = vi.fn();


vi.mock('rag_library', () => ({
  LangchainLLMClient: class {
    infer = mockInfer;
    inferStream = mockInferStream;
  },
}));

describe('CompletionUseCase', () => {
  let useCase: CompletionUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new CompletionUseCase();
  });

  test('type single valide', async () => {
    mockInfer.mockResolvedValue({
      type: 'message',
      content: 'Message test en mode single',
      metadata: { tokenUsage: { completionTokens: 10, promptTokens: 5, totalTokens: 15 } },
      id: 'mock-id',
    });

    const command: CompletionCommand = {
      model: 'gpt-4',
      provider: 'openai',
      messages: [{ role: 'user', content: 'Hello' }],
      responseMode: 'single',
      key: 'test-key',
    };

    const result = await useCase.execute(command);

    expect(result.kind).toBe('single');
    if (result.kind === 'single') {
      expect(result.value.content).toBe('Message test en mode single');
      expect(result.value.metadata).toEqual({ tokenUsage: { completionTokens: 10, promptTokens: 5, totalTokens: 15 } });
      expect(result.value.id).toBe('mock-id');
      expect(result.value.model).toBe('gpt-4');
    }

    expect(mockInfer).toHaveBeenCalledWith(
      [{ role: 'user', content: 'Hello' }],
      'openai',
      'gpt-4',
      { apiKey: 'test-key' }
    );
  });

  test('type stream valide', async () => {
    async function* mockStream() {
      yield { type: 'message.delta' as const, content: 'Mock', metadata: {}, id: 'stream-id' };
      yield { type: 'message.done' as const };
    }
    mockInferStream.mockReturnValue(mockStream());

    const command: CompletionCommand = {
      model: 'gpt-4',
      provider: 'openai',
      messages: [{ role: 'user', content: 'Hello' }],
      responseMode: 'stream',
      key: 'test-key',
    };

    const result = await useCase.execute(command);

    expect(result.kind).toBe('stream');
    if (result.kind === 'stream') {
      expect(result.stream).toBeDefined();

      const chunks: InferStreamResult[] = [];
      for await (const chunk of result.stream) {
        chunks.push(chunk);
      }
      expect(chunks).toHaveLength(2);
      expect(chunks[0].type).toBe('message.delta');
      if (chunks[0].type === 'message.delta') {
        expect(chunks[0].content).toBe('Mock');
      }
      expect(chunks[1].type).toBe('message.done');
    }

    expect(mockInferStream).toHaveBeenCalledWith(
      [{ role: 'user', content: 'Hello' }],
      'openai',
      'gpt-4',
      { apiKey: 'test-key' }
    );
  });

  test('envoie d\'erreur du fournisseur', async () => {
    mockInfer.mockResolvedValue({
      type: 'error',
      message: 'API key invalid',
    });

    const command: CompletionCommand = {
      model: 'gpt-4',
      provider: 'openai',
      messages: [{ role: 'user', content: 'Hello' }],
      responseMode: 'single',
      key: 'invalid-key',
    };

    await expect(useCase.execute(command)).rejects.toThrow(ProviderError);
  });
});