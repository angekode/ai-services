import { createController, type Context } from 'service_library';
import { type ConversationCompletionCommand } from './command.ts';
import { ConversationCompletionRequestDecoder } from './request-decoder.ts';

import { type ConversationCompletionUseCaseResultSingleValue, type  ConversationCompletionUseCaseResultStreamValue }from './use-case.ts';
import  { ConversationCompletionUseCase } from './use-case.ts';
import { ConversationCompletionResponseEncoder } from './response-encoder.ts';
import { ConversationCompletionErrorEncoder } from './error.encoder.ts';

export const conversationCompletionController = createController<ConversationCompletionCommand, ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue, Context>(
  new ConversationCompletionRequestDecoder(),
  new ConversationCompletionUseCase(),
  new ConversationCompletionResponseEncoder(),
  new ConversationCompletionErrorEncoder()
);
