import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadInputError, ServerError } from './error.js';
import { handleCompletionRequest } from './controllers/completion.controller.js';
import { validateChatCompletionHeader, validateChatCompletionBody } from './controllers/validation.controller.js';
import type { Error_Type } from './requests/output.request.js';


const server = express();
server.use(express.json());
server.use((req, res, next) => { console.log('Requête reçue: ' + req.url); next(); });

server.get('/', (_req : Request, res: Response) => res.send('Serveur à l\'écoute'));
server.post(
  '/chat/completions',
  catchError(validateChatCompletionHeader),
  catchError(validateChatCompletionBody),
  catchError(handleCompletionRequest)
);

server.listen(process.env.PORT, () => console.log(`Serveur lancé sur le port ${process.env.PORT}`));


function catchError(f: (req: Request, res: Response, next: NextFunction) => void) :  (req: Request, res: Response, next: NextFunction) => void {
  const foo = (req: Request, res: Response, next: NextFunction) => {
    try {
      f(req, res, next);

    } catch(error: unknown) {
      if (error instanceof Error) {
        handleError(req, res, error as Error);
      } else if (error) {
        handleError(req, res, new ServerError('Erreur inconnue'));
      }
    }
  };

  return foo;
}


function handleError(req: Request, res: Response, error: Error) {
  if (error instanceof BadInputError) {
    res.status(StatusCodes.BAD_REQUEST);
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const e : Error_Type = {
    code:  null,
    message: error.message,
    param: null,
    type: error.name
  };
  res.json(e);
  res.end();
  return;
}
