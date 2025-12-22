import { type Response } from 'express';

import { ServerError } from '../error.js';
import type { InternalRequest } from '../requests/internal.request.js';
import type { OutputRequest_ErrorBody_Type } from '../requests/output.request.js';

// https://github.com/openai/openai-openapi/blob/manual_spec/openapi.yaml
// ErrorResponse (ligne 40887)
// Error (ligne 40887)
type ErrorResponse = {
  error: {
    code: string | null,
    message: string,
    param: string | null,
    type: string
  }
};


/**
 * A utiliser dans tous les cas d'erreur (Requête entrante, fournisseur de llm, interne au programme).
 */
export function writeOutputRequest_Error(res : Response, internalRequest: InternalRequest, message: string) {
  if (!internalRequest.context) {
    throw new ServerError('L\'objet InternalRequestContext n\'est pas défini');
  }

  const bodyContent : OutputRequest_ErrorBody_Type = {
    error: {
      code: null,
      message: message,
      param: null,
      type: 'error'
    }
  };
  res.write(JSON.stringify(bodyContent));
  for (const [key, value] of Object.entries(internalRequest.context)) {
    res.setHeader(key, value);
  }
  res.status(500);
  return;
};

