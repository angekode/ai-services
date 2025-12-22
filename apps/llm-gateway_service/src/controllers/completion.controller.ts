import type { Request, Response, NextFunction } from 'express';

import { ServerError } from '../error.js';
import type { InternalRequest } from '../requests/internal.request.js';
import { generateCompletion, generateCompletionStream } from '../services/llm.service.js';
import { writeOutputRequest_Completion, writeOutputRequests_StreamCompletion } from '../writers/completion.writer.js';
import { writeOutputRequest_Error } from '../writers/errors.writer.js';


export async function handleCompletionRequest(_req: Request, res: Response, next: NextFunction) {
  if (!res.locals.ir) {
    return next(new ServerError('Pas d\'objet InternalRequest dans l\'objet Response'));
  }
  const ir : InternalRequest = res.locals.ir;
  if (!ir.input) {
    return next(new ServerError('Pas d\'objet InternalRequestInput dans l\'objet InternalRequest'));
  }

  try {

    if (ir.input.stream) {
      const stream = generateCompletionStream(ir);
      await writeOutputRequests_StreamCompletion(res, ir, stream);

    } else {
      const result = await generateCompletion(ir);
      if (result.type === 'error') {
        writeOutputRequest_Error(res, ir, 'erreur');
        res.end();
        return;
      }

      writeOutputRequest_Completion(res, ir, result);
      res.end();
      return;
    }

  } catch (error) {
    return next(error);
  }
}
