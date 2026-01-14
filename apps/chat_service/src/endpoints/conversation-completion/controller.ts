import { createController, type Context } from 'service_library';
import { type ConversationCompletionCommand } from './command.js';
import { ConversationCompletionRequestDecoder } from './request-decoder.js';

import { type ConversationCompletionUseCaseResultSingleValue, type  ConversationCompletionUseCaseResultStreamValue }from './use-case.js';
import  { ConversationCompletionUseCase } from './use-case.js';
import { ConversationCompletionResponseEncoder } from './response-encoder.js';
import { ConversationCompletionErrorEncoder } from './error.encoder.js';

export const conversationCompletionController = createController<ConversationCompletionCommand, ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue, Context>(
  new ConversationCompletionRequestDecoder(),
  new ConversationCompletionUseCase(),
  new ConversationCompletionResponseEncoder(),
  new ConversationCompletionErrorEncoder()
);
