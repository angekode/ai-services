import type { Request, Response, NextFunction } from 'express';

import { parseInputRequest_completionBody } from '../parsers/completion.parser.ts';
import { createInternalRequest, createInternalRequestInput} from '../requests/internal.request.ts';
import { BadInputError } from '../error.ts';


export function validateChatCompletionHeader(req: Request, res: Response, next: NextFunction) {
  res.locals.ir = createInternalRequest();
  res.locals.ir.context = {
    'traceparent': getStringHeader(req, 'traceparent'),
    'x-run-id': getStringHeader(req, 'x-run-id'),
    'x-user-id': getStringHeader(req, 'x-user-id')
  };
  const input = createInternalRequestInput();

  const keyBearer = req.headers['authorization'];
  if (keyBearer) {
    const matches = keyBearer.match(/^Bearer\s(.+)$/);
    if (!matches || !matches[1]) {
      return next(new BadInputError('Format de la clé Bearer invalide'));
    }
    input.key = matches[1];
  }
  res.locals.ir.input = input;
  next();
}


export function validateChatCompletionBody(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    next(new BadInputError('Pas de données dans le body'));
    return;
  }
  parseInputRequest_completionBody(req, res.locals.ir);
  next();
}


function getStringHeader(req: Request, name: string) : string | undefined {
  const value = req.headers[name];
  if (typeof value === 'string') {
    return value;
  } else {
    return undefined;
  }
}
