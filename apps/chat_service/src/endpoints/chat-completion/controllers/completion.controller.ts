import { createController, type Context } from 'service_library';
import { type CompletionCommand } from '../types/completion.command.js';

import {
  type UseCaseResultSingleValue,
  type UseCaseResultStreamValue,
  CompletionUseCase
} from '../use-cases/completion.use-case.js';

import { CompletionRequestDecoder } from '../decoders/completion.request-decoder.js';
import { CompletionResponseEncoder } from '../encoders/completion.response-encoder.js';
import { CompletionErrorEncoder } from '../encoders/completion.error-encoder.js';

export const completionController = createController<CompletionCommand, UseCaseResultSingleValue, UseCaseResultStreamValue, Context>(
  new CompletionRequestDecoder(),
  new CompletionUseCase(),
  new CompletionResponseEncoder(),
  new CompletionErrorEncoder()
);
