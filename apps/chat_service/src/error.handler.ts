import { BadInputError, ServerError, ProviderError } from "service_library";
import { StatusCodes } from "http-status-codes";
import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';


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

    if (error instanceof BadInputError) {
      res.status(StatusCodes.BAD_REQUEST);

    } else if (error instanceof ServerError) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);

    } else if (error instanceof ProviderError) {
      res.status(StatusCodes.BAD_GATEWAY);

    } else if (error instanceof ZodError) {
      res.status(StatusCodes.BAD_REQUEST);
      bodyJson.error.message = error.message;

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


