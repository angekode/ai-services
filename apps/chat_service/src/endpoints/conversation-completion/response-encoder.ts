import { type Response } from 'express';

import { 
  type Context, 
  type ResponseEncoder, 
  type UseCaseResult, 
  encodeHeaders
} from 'service_library';


import { type ConversationCompletionUseCaseResultSingleValue, type ConversationCompletionUseCaseResultStreamValue } from './use-case.js';
import { 
  type ConversationCompletionOutputRequestType, 
  type ConversationCompletionOutputRequestStreamType,
  type OutputRequest_ErrorBody_Type
} from './output.request.js';


export class ConversationCompletionResponseEncoder implements ResponseEncoder<Response, ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue, Context> {

  async encode(res: Response, result: UseCaseResult<ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue>, context: Context): Promise<void> {

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




function encodeSingle(res: Response, result: SingleResult<ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue>, context: Context) {

  const bodyContent : ConversationCompletionOutputRequestType = {
    id: result.value.id ?? '',
    choices: [
      {
        index: 0,
        finish_reason: 'stop',
        message: {
          role: 'assistant',
          content: result.value.content ?? ''
        }
      }
    ]
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


async function encodeStream(res: Response, result: StreamResult<ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue>, context: Context) {
  encodeHeaders(res, context); // headers de tracking
  res.setHeader('Content-Type', 'text/event-stream');
  res.flushHeaders(); // envoie les headers immédiatement et pas seulement au moment du 1er write (important pour 'text/event-stream')

  let abordRequested = false;
  res.on('close', () => abordRequested = true );

  try {
    for await (const chunk of result.stream) {
      if (abordRequested) {
        break;
      }
      if (chunk.type === 'message.delta') {
        const bodyContent : ConversationCompletionOutputRequestStreamType = {
          id: Number(chunk.id),
          choices: [{
            index: 0,
            delta: { role: 'assistant', content: chunk.content },
            finish_reason: 'stop'
          }],
          model: ''
        }

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
