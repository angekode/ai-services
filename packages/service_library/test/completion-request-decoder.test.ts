import { test, expect, describe } from 'vitest';

import { CompletionRequestDecoder } from '../src/endpoints/chat-completion/decoders/completion.request-decoder';
import { BadInputError } from '../src/endpoint-base/error';
import { Request } from 'express';

describe('CompletionRequestDecoder', () => {
  const decoder = new CompletionRequestDecoder();

  test('parses valid request', async () => {

    const mockReq = {
      body: { model: 'openai/gpt-4', messages: [{ role: 'user', content: 'Hello' }], stream: false },
      headers: { authorization: 'Bearer key123' }
    } as unknown as Request;

    const result = await decoder.decode(mockReq);
    expect(result.command.model).toBe('gpt-4');
    expect(result.command.provider).toBe('openai');
    expect(result.context['traceparent']).toBeUndefined(); // pas de header
  });

  test('throws BadInputError on invalid Zod', async () => {
    const mockReq = { body: { model: 'invalid', messages: [] } } as unknown as Request;
    await expect(decoder.decode(mockReq)).rejects.toThrow(BadInputError);
  });
});

/**
 * CompletionRequestDecoder, CompletionUseCase, CompletionResponseEncoder, CompletionErrorEncoder, et le controller factory.
 */