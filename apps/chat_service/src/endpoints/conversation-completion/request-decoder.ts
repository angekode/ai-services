import { BadInputError, type RequestDecoder } from 'service_library';
import { type Request } from 'express';
import { type ConversationCompletionCommand } from './command.js';
import { type Context } from 'service_library';
import { conversationCompletionScheme } from './input.request.js';


export class ConversationCompletionRequestDecoder implements RequestDecoder<Request, ConversationCompletionCommand, Context> {
  async decode(req: Request): Promise<{ command: ConversationCompletionCommand, context: Context }> {
    if (!req.body) {
      throw new BadInputError('Pas de données dans le corps de la requête');
    }
    if (!req.params.conversationId) {
      throw new BadInputError('l\'id de la conversation n\'est pas valide');
    }
    const validatedRequest = conversationCompletionScheme.parse(req.body);
    const command : ConversationCompletionCommand = {
      messages: validatedRequest.messages,
      stream: validatedRequest.stream,
      conversationId: req.params.conversationId
    };
    const context : Context = {
      traceparent: '',
      'x-run-id': '1',
      'x-user-id': ''
    };
    return { command: command, context: context };
  }
};
