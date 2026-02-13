import { BadInputError, ServerError, ProviderError } from "service_library";
import { StatusCodes } from "http-status-codes";
import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';
import jwt from "jsonwebtoken";
import { ModelError, NotFoundModelError, UniqueConstraintModelError, QueryModelError } from "./database/interfaces/model-errors.ts";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof Error) {

    const bodyJson = {
      error: {
        code: '',
        message: error.message,
        param: '',
        type: error.name
      }
    };

    // Erreurs du service
    if (error instanceof BadInputError) {
      res.status(StatusCodes.BAD_REQUEST);

    } else if (error instanceof ServerError) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);

    } else if (error instanceof ProviderError) {
      res.status(StatusCodes.BAD_GATEWAY);

    } else if (error instanceof ZodError) {
      res.status(StatusCodes.BAD_REQUEST);
      bodyJson.error.message = error.message;
    
    } else if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND);

    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(StatusCodes.UNAUTHORIZED);

    // Erreurs base de données
    } else if (error instanceof NotFoundModelError) {
      res.status(StatusCodes.NOT_FOUND);

    } else if (error instanceof UniqueConstraintModelError) {
      res.status(StatusCodes.CONFLICT);
    
    } else if (error instanceof QueryModelError) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);

    } else if (error instanceof ModelError) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);

    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.write(JSON.stringify(bodyJson));
    res.end();

  } else if (typeof error === 'string') {

    const bodyJson = {
      error: {
        code: '',
        message: error,
        param: '',
        type: 'unknown'
      }
    };
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.write(JSON.stringify(bodyJson));
    res.end();

  } else {

    const bodyJson = {
      error: {
        code: '',
        message: String(error),
        param: '',
        type: 'unknown'
      }
    };
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.write(JSON.stringify(bodyJson));
    res.end();
  }
}


