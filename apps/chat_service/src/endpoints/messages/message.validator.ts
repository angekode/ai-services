import type { Request, Response, NextFunction } from 'express';
import { BadInputError } from 'service_library';
import zod from 'zod';


const createMessageBodyScheme = zod.object({
  role: zod.literal(['user', 'assistant', 'system']),
  content: zod.string(),
  conversation_id: zod.number()
});


export default {

  async validateCreateMessageBody(req: Request, res: Response, next: NextFunction) {
    createMessageBodyScheme.parse(req.body);
    next();
  },
  
  async validateMessageIdParam(req: Request, res: Response, next: NextFunction) {
    if (!req.params.messageId) {
      throw new BadInputError('Identifiant du message manquant');
    }
    if (isNaN(Number(req.params.messageId))) {
      throw new BadInputError('Mauvais format d\identifiant de message');
    }
    next();
  }
};