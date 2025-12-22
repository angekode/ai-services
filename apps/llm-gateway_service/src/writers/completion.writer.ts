import type { Response } from 'express';

import { ServerError } from '../error.js';
import type { InternalRequest } from '../requests/internal.request.js';
import type { OutputRequest_CompletionBody_Type } from '../requests/output.request.js';
import type { CompletionResult, CompletionStreamResult } from '../services/llm.service.js';


/**
 * Pour les réponse de completion non stream, écris dans le corps de la requête de sortie et les entêtes
 * avec le format fourni par outpout.request.js partiellement conforme au standard OpenAI.
 *
 * @param res - objet express dans lequel la réponse sera écrite
 * @param internalRequest - informations de tacking principalement
 * @param result - contient les données de complétion
 */
export function writeOutputRequest_Completion(res: Response, internalRequest: InternalRequest, result: CompletionResult) {

  if (result.type !== 'message') {
    throw new Error('Résultat invalide');
  }

  if (!internalRequest.input) {
    throw new ServerError('L\'objet InternalRequestInput n\'est pas défini');
  }
  if (!internalRequest.context) {
    throw new ServerError('L\'objet InternalRequestContext n\'est pas défini');
  }

  const bodyContent : OutputRequest_CompletionBody_Type = {
    id: result.id ?? '',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: result.content ?? null
        },
        finish_reason: 'stop'
      }
    ],
    created: Date.now(),
    model: internalRequest.input.model,
    object: 'chat.completion',
    usage: {
      completion_tokens: result.metadata?.tokenUsage?.completionTokens ?? 0,
      prompt_tokens: result.metadata?.tokenUsage?.promptTokens ?? 0,
      total_tokens: result.metadata?.tokenUsage?.totalTokens ?? 0
    }
  };

  for (const [key, value] of Object.entries(internalRequest.context)) {
    if (value) {
      res.setHeader(key, value);
    }
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.write(JSON.stringify(bodyContent));
  return;
}


/**
 * Pour les réponses de completion stream, envoie dans un 1er temps les entêtes http utiles aux tracking.
 * Ensuite envoie le texte de la réponse par morceaux avec des évènements SSE avec le format fourni par
 * outpout.request.js partiellement conforme au standard OpenAI.
 *
 * @param res - objet express dans lequel la réponse sera écrite
 * @param internalRequest - informations de tacking principalement
 * @param result - contient les données de complétion
 */
export async function  writeOutputRequests_StreamCompletion(res: Response, internalRequest: InternalRequest, stream: AsyncGenerator<CompletionStreamResult>) {
  if (!internalRequest.context) {
    throw new ServerError('L\'objet InternalRequestContext n\'est pas défini');
  }

  for (const [key, value] of Object.entries(internalRequest.context)) {
    if (value) {
      res.setHeader(key, value);
    }
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.flushHeaders(); // envoie les headers immédiatement et pas seulement au moment du 1er write (important pour 'text/event-stream')

  for await (const chunk of stream) {
    res.write(JSON.stringify(chunk));
  }

  res.end();
}
