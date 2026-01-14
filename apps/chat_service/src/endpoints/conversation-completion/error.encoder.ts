import { type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { 
  type ErrorEncoder,
  BadInputError,
  ServerError,
  ProviderError
} from 'service_library';

import { type OutputRequest_ErrorBody_Type} from './output.request.js';


export class ConversationCompletionErrorEncoder implements ErrorEncoder<Response> {
  encode(res: Response, error: unknown) {
    if (error instanceof Error) {

      const bodyJson : OutputRequest_ErrorBody_Type = {
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

      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      }

      res.write(JSON.stringify(bodyJson));
      res.end();

    } else if (typeof error === 'string') {

      const bodyJson : OutputRequest_ErrorBody_Type = {
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

      const bodyJson : OutputRequest_ErrorBody_Type = {
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
}
