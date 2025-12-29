import { type Request } from 'express';
import { ZodError } from 'zod';

import { 
  type RequestDecoder,
  BadInputError,
  type Context,
  createContext
} from 'service_library';


import {
  inputRequestBody_Completion_Scheme,
  INPUT_REQUEST_MODEL_PATTERN
} from '../requests/completion.input.request.js';

import { type CompletionCommand } from '../types/completion.command.js';


export class CompletionRequestDecoder implements RequestDecoder<
  Request,
  CompletionCommand,
  Context
> {
  async decode(req: Request): Promise<{ command: CompletionCommand, context: Context }> {
    let bodyJson;

    try {
      bodyJson = inputRequestBody_Completion_Scheme.parse(req.body);
    } catch (error : unknown) {
      if (error instanceof ZodError) {
        throw new BadInputError(error.message);
      } else {
        throw error;
      }
    }

    const matches = bodyJson.model.match(INPUT_REQUEST_MODEL_PATTERN);
    if (!matches || matches.length !== 3 || !matches[1] || !matches[2]) {
      throw new BadInputError('Format du nom de modèle invalide');
    }
    const authorizationHeader = req.headers['authorization'];
    let key : string | null = null;
    if (authorizationHeader) {
      const matches = authorizationHeader.match(/Bearer (.+)/);
      if (matches && matches[1]) {
        key = matches[1];
      }
    }

    return {
      command: {
        model: matches[2],
        provider: matches[1],
        messages: bodyJson.messages,
        responseMode: bodyJson.stream ? 'stream' : 'single',
        key: key
      },
      context: createContextFromRequest(req)
    };
  }
}

function createContextFromRequest(req: Request): Context {
  const context = createContext();

  for (const header of Object.keys(context) as (keyof Context)[]) {
    const v = req.headers[header as string];
    if (typeof v === 'string') {
      context[header] = v;
    }
  }

  return context;
}
