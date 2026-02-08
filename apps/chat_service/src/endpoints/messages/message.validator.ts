import type { Request, Response, NextFunction } from 'express';
import { BadInputError } from 'service_library';
import zod from 'zod';


const createMessageBodyScheme = zod.object({
  role: zod.literal(['user', 'assistant', 'system']),
  content: zod.string(),
  conversation_id: zod.number()
});


const createMessageNoConversationIdBodyScheme = zod.object({
  role: zod.literal(['user', 'assistant', 'system']),
  content: zod.string()
});

const conversationCompleteBodyScheme = zod.object({ 
  stream: zod.boolean()
});


export default {

  validateCreateMessageBody(req: Request, res: Response, next: NextFunction) {
    createMessageBodyScheme.parse(req.body);
    next();
  },


  validateCreateMessageNoConversationIdBody(req: Request, res: Response, next: NextFunction) {
    createMessageNoConversationIdBodyScheme.parse(req.body);
    next();
  },


  validateConversationCompleteBody(req: Request, res: Response, next: NextFunction) {
    conversationCompleteBodyScheme.parse(req.body);
    next();
  },
  
  
  validateMessageIdParam(req: Request, res: Response, next: NextFunction) {
    if (!req.params.messageId) {
      throw new BadInputError('Identifiant du message manquant');
    }
    if (isNaN(Number(req.params.messageId))) {
      throw new BadInputError('Mauvais format d\identifiant de message');
    }
    next();
  }
};