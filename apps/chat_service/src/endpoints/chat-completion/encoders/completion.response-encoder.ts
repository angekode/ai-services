import { type Response } from 'express';

import { 
  type Context, 
  type ResponseEncoder, 
  type UseCaseResult, 
  encodeHeaders
} from 'service_library';

import { type OutputRequest_ErrorBody_Type } from '../requests/completion.error.request.js';
import { type OutputRequest_CompletionBody_Type, type OutputRequest_StreamCompletionBody_Type } from '../requests/completion.output.request.js';
import { type UseCaseResultSingleValue, type UseCaseResultStreamValue } from '../use-cases/completion.use-case.js';


export class CompletionResponseEncoder implements ResponseEncoder<Response, UseCaseResultSingleValue, UseCaseResultStreamValue, Context> {

  async encode(res: Response, result: UseCaseResult<UseCaseResultSingleValue, UseCaseResultStreamValue>, context: Context): Promise<void> {

    if (result.kind === 'single') {
      encodeSingle(res, result, context);

    } else if (result.kind === 'stream') {
      await encodeStream(res, result, context);

    }
  }
}


type SingleResult<TOut, TChunk> = Extract<
  UseCaseResult<TOut, TChunk>,
  { kind: 'single' }
>;

function encodeSingle(res: Response, result: SingleResult<UseCaseResultSingleValue, UseCaseResultStreamValue>, context: Context) {

  const bodyContent : OutputRequest_CompletionBody_Type = {
    id: result.value.id ?? '',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: result.value.content ?? null
        },
        finish_reason: 'stop'
      }
    ],
    created: Date.now() / 1000,
    model: result.value.model,
    object: 'chat.completion',
    usage: {
      completion_tokens: result.value.metadata?.tokenUsage?.completionTokens ?? 0,
      prompt_tokens: result.value.metadata?.tokenUsage?.promptTokens ?? 0,
      total_tokens: result.value.metadata?.tokenUsage?.totalTokens ?? 0
    }
  };

  encodeHeaders(res, context);
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(bodyContent));
  res.end();
}


type StreamResult<TOut, TChunk> = Extract<
  UseCaseResult<TOut, TChunk>,
  { kind: 'stream' }
>;

async function encodeStream(res: Response, result: StreamResult<UseCaseResultSingleValue, UseCaseResultStreamValue>, context: Context) {
  encodeHeaders(res, context); // headers de tracking
  res.setHeader('Content-Type', 'text/event-stream');
  res.flushHeaders(); // envoie les headers immédiatement et pas seulement au moment du 1er write (important pour 'text/event-stream')

  try {
    for await (const chunk of result.stream) {
      if (chunk.type === 'message.delta') {
        const bodyContent : OutputRequest_StreamCompletionBody_Type = {
          id: chunk.id ?? '',
          choices: [{
            index: 0,
            delta: { role: 'assistant', content: chunk.content },
            finish_reason: 'stop'
          }],
          created: Date.now() / 1000,
          model: '',
          object: 'chat.completion',
          usage: {
            completion_tokens: chunk.metadata?.tokenUsage?.completionTokens ?? 0,
            prompt_tokens: chunk.metadata?.tokenUsage?.promptTokens ?? 0,
            total_tokens: chunk.metadata?.tokenUsage?.totalTokens ?? 0
          }
        };

        res.write(`data: ${JSON.stringify(bodyContent)}\n\n`);

      } else if (chunk.type === 'message.done') {
        res.write('data: [DONE]\n\n');

      } else if (chunk.type === 'error') {
        const bodyContent : OutputRequest_ErrorBody_Type = {
          error: {
            code: null,
            message: chunk.message,
            param: null,
            type: 'ProviderError'
          }
        };
        res.write(`data: ${JSON.stringify(bodyContent)}\n\n`);
        return res.end();
      }
    }
  } catch (error) {
    const bodyContent : OutputRequest_ErrorBody_Type = {
      error: {
        code: null,
        message: error instanceof Error ? error.message : String(error),
        param: null,
        type: 'ProviderError'
      }
    };
    res.write(`data: ${JSON.stringify(bodyContent)}\n\n`);
    return res.end();
  }
  res.end();
}
