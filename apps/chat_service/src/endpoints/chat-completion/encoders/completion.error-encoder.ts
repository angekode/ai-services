import { type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { 
  type ErrorEncoder,
  BadInputError,
  ServerError,
  ProviderError
} from 'service_library';

import { type OutputRequest_ErrorBody_Type} from '../requests/completion.error.request.js';


export class CompletionErrorEncoder implements ErrorEncoder<Response> {
  encode(res: Response, error: unknown) {
    throw error;
  }
}
