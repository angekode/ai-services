import type { Request } from 'express';

import { BadInputError } from '../error.js';
import { inputRequestBody_Completion_Scheme, INPUT_REQUEST_MODEL_PATTERN } from '../requests/input.request.js';
import { createInternalRequestInput } from '../requests/internal.request.js';
import type { InternalRequest } from '../requests/internal.request.js';


export function parseInputRequest_completionBody(req: Request, internalRequest: InternalRequest) {
  const inputRequestBody = inputRequestBody_Completion_Scheme.parse(req.body);

  const matches = inputRequestBody.model.match(INPUT_REQUEST_MODEL_PATTERN);
  if (!matches || !matches[1] || !matches[2]) {
    throw new BadInputError('Modèle ou Fournisseur non indiqué');
  }
  if (!internalRequest.input) {
    internalRequest.input = createInternalRequestInput();
  }

  internalRequest.input.provider = matches[1];
  internalRequest.input.model = matches[2];
  internalRequest.input.messages = inputRequestBody.messages;
  internalRequest.input.stream = inputRequestBody.stream ? true : false;
}
