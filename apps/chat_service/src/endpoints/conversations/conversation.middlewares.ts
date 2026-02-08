import type { Request, Response, NextFunction } from 'express';
import { BadInputError } from 'service_library';
import zod from 'zod';


const createBodyScheme = zod.object({
  title: zod.string(),
  user_id: zod.number()
});

const updateBodyScheme = zod.object({
  title: zod.string().optional(),
  user_id: zod.number().optional()
});


export default {
  
  validateConversationIdParam(req: Request, res: Response, next: NextFunction) {
    if (!req.params.conversationId) {
      throw new BadInputError('Identifiant de la conversation manquant');
    }
    
    if (isNaN(Number(req.params.conversationId))) {
      throw new BadInputError('Identifiant de la conversaiton invalide');
    }
    
    next();
  },


  validateCreateBody(req: Request, res: Response, next: NextFunction) {
    createBodyScheme.parse(req.body);
    next();
  },
  

  validateUpdateBody(req: Request, res: Response, next: NextFunction) {
    updateBodyScheme.parse(req.body);
    next();
  }
};