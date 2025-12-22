import type { Request, Response, NextFunction } from 'express';

import { parseInputRequest_completionBody } from '../parsers/completion.parser.js';
import { createInternalRequest, createInternalRequestInput} from '../requests/internal.request.js';
import { BadInputError } from '../error.js';


export function validateChatCompletionHeader(req: Request, res: Response, next: NextFunction) {
  res.locals.ir = createInternalRequest();
  res.locals.ir.context = {
    'traceparent': req.headers['traceparent'],
    'x-run-id': req.headers['x-run-id'],
    'x-user-id': req.headers['x-user-id']
  };
  const input = createInternalRequestInput();

  const keyBearer = req.headers['authorization'];
  if (keyBearer) {
    const matches = keyBearer.match(/^Bearer\s(.+)$/);
    if (!matches || !matches[1]) {
      throw new BadInputError('Format de la clé Bearer invalide');
    }
    input.key = matches[1];
  }
  res.locals.ir.input = input;
  next();
}


export function validateChatCompletionBody(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    throw new BadInputError('Pas de données dans le body');
  }
  parseInputRequest_completionBody(req, res.locals.ir);
  next();
}
