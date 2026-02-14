import { createController, type Context } from 'service_library';
import { type CompletionCommand } from '../types/completion.command.ts';

import {
  type UseCaseResultSingleValue,
  type UseCaseResultStreamValue,
  CompletionUseCase
} from '../use-cases/completion.use-case.ts';

import { CompletionRequestDecoder } from '../decoders/completion.request-decoder.ts';
import { CompletionResponseEncoder } from '../encoders/completion.response-encoder.ts';
import { CompletionErrorEncoder } from '../encoders/completion.error-encoder.ts';

export const completionController = createController<CompletionCommand, UseCaseResultSingleValue, UseCaseResultStreamValue, Context>(
  new CompletionRequestDecoder(),
  new CompletionUseCase(),
  new CompletionResponseEncoder(),
  new CompletionErrorEncoder()
);
