import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadInputError, ServerError, ProviderError } from '../error.js';
import { writeOutputRequest_Error } from '../writers/errors.writer.js';

export function handleError(error: any, _req: Request, res: Response, _next: NextFunction) {
  /*
    Si jamais une exception est levée pendant un stream,
    alors les headers sont déjà envoyés.
  */
  if (res.headersSent) {
    return res.end();
  }

  if (error instanceof BadInputError) {
    res.status(StatusCodes.BAD_REQUEST);

  } else if (error instanceof ServerError) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);

  } else if (error instanceof ProviderError) {
    res.status(StatusCodes.BAD_GATEWAY);

  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  writeOutputRequest_Error(res, error.message, error.name);
  res.end();
}
