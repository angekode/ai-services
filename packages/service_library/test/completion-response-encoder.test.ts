import { test, expect, describe, vi } from 'vitest';
import { CompletionResponseEncoder } from '../src/endpoints/chat-completion/encoders/completion.response-encoder';
import type { UseCaseResultSingleValue, UseCaseResultStreamValue } from '../src/endpoints/chat-completion/use-cases/completion.use-case';
import type { Context } from '../src/endpoint-base/context.type';
import type { Response } from 'express';
import type { InferStreamResult } from 'rag_library/dist/llm-client-interface.js';

describe('CompletionResponseEncoder', () => {
  const encoder = new CompletionResponseEncoder();

  test('encodes single response', async () => {
    const writeMock = vi.fn();
    const mockRes = {
      setHeader: vi.fn(),
      write: writeMock,
      end: vi.fn(),
    } as unknown as Response;

    const result: { kind: 'single'; value: UseCaseResultSingleValue } = {
      kind: 'single',
      value: {
        content: 'Hello world',
        metadata: { tokenUsage: { completionTokens: 5, promptTokens: 3, totalTokens: 8 } },
        id: 'test-id',
        model: 'gpt-4',
      },
    };

    const context: Context = {
      'traceparent': 'abc-123',
      'x-run-id': undefined,
      'x-user-id': 'user-456',
    };

    await encoder.encode(mockRes, result, context);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockRes.setHeader).toHaveBeenCalledWith('traceparent', 'abc-123');
    expect(mockRes.setHeader).toHaveBeenCalledWith('x-user-id', 'user-456');
    expect(mockRes.write).toHaveBeenCalled();
    // calls => tableau avec un élément pour chaque appel à la fonction write
    // calls[0] => tableau avec un élément pour chaque argument donné à la fonction write
    // la on vérifie que le 1er appel à la fonction write contient bien le json de la réponse
    const writtenData = (mockRes.write as any).mock.calls[0][0];
    expect(writtenData).toContain('"content":"Hello world"');
    expect(writtenData).toContain('"model":"gpt-4"');
    expect(mockRes.end).toHaveBeenCalled();
  });

  test('encodes stream response', async () => {
    const writeMock = vi.fn();
    const mockRes = {
      setHeader: vi.fn(),
      write: writeMock,
      flushHeaders: vi.fn(),
      end: vi.fn(),
    } as unknown as Response;

    async function* mockStream(): AsyncIterable<InferStreamResult> {
      yield {
        type: 'message.delta',
        content: 'Hello',
        metadata: { tokenUsage: { completionTokens: 1, promptTokens: 0, totalTokens: 1 } },
        id: 'stream-id',
      } as InferStreamResult;
      yield {
        type: 'message.done',
      } as InferStreamResult;
    }

    const result: { kind: 'stream'; stream: AsyncIterable<UseCaseResultStreamValue> } = {
      kind: 'stream',
      stream: mockStream(),
    };

    const context: Context = {
      'traceparent': undefined,
      'x-run-id': 'run-789',
      'x-user-id': undefined,
    };

    await encoder.encode(mockRes, result, context);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(mockRes.setHeader).toHaveBeenCalledWith('x-run-id', 'run-789');
    expect(mockRes.flushHeaders).toHaveBeenCalled();

    const writtenData = (mockRes.write as any).mock.calls[0][0];
    expect(writtenData).toContain('"content":"Hello');

    expect(mockRes.write).toHaveBeenCalledWith('data: [DONE]\n\n');
    expect(mockRes.end).toHaveBeenCalled();
  });
});