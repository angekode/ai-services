import { type Response } from 'express';
import type { OutputRequest_ErrorBody_Type } from '../requests/output.request.js';


/**
 * A utiliser dans tous les cas d'erreur (Requête entrante, fournisseur de llm, interne au programme).
 * Utilise le context s'il existe bien dans Request.locals.internalRequest.context
 */
export function writeOutputRequest_Error(res : Response, message: string, type: string) {
  const context = res.locals?.ir?.context;
  if (context) {
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        res.setHeader(key, value);
      }
    }
  }
  const bodyContent : OutputRequest_ErrorBody_Type = {
    error: {
      code: null,
      message: message,
      param: null,
      type: type
    }
  };
  res.write(JSON.stringify(bodyContent));
};
