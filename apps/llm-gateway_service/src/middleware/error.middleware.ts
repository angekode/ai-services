import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { OutputRequest_ErrorBody_Type } from '../requests/output.request.js';
import { BadInputError, ServerError, ProviderError } from '../error.js';


export function handleError(error: any, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof BadInputError) {
    res.status(StatusCodes.BAD_REQUEST);

  } else if (error instanceof ServerError) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);

  } else if (error instanceof ProviderError) {
    res.status(StatusCodes.BAD_GATEWAY);

  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const e : OutputRequest_ErrorBody_Type = {
    error: {
      code:  null,
      message: error.message,
      param: null,
      type: error.name
    }
  };

  res.json(e);
  return;
}
