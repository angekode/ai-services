import type { Request } from 'express';
import { BadInputError } from '../error.js';
import { inputRequestBody_Completion_Scheme, INPUT_REQUEST_MODEL_PATTERN } from '../requests/input.request.js';
import { createInternalRequestInput } from '../requests/internal.request.js';
import type { InternalRequest } from '../requests/internal.request.js';


export function parseInputRequest_completionBody(req: Request, internalRequest: InternalRequest) {

  const parseResult = inputRequestBody_Completion_Scheme.safeParse(req.body);
  if (!parseResult.success) {
    const issuesStr = parseResult.error.issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new BadInputError(issuesStr);
  }
  const inputRequestBody = parseResult.data;

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
