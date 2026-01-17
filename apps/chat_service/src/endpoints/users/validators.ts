import { type Request, type Response, type NextFunction } from 'express';
import zod, { ZodError } from 'zod';

const createUserBodyScheme = zod.object({
  username: zod.string(),
  password: zod.string()
});


export default {
  validateCreateUserBody(req: Request, res: Response, next: NextFunction): void {
    try {
      createUserBodyScheme.parse(req.body);
    } catch (error: unknown) {
      next(error);
    }

    next();
  },

  validateUsernameParam(req: Request, res: Response, next: NextFunction): void {
    if (typeof req.params.username !== 'string') {
      next('Le nom d\'utilisateur n\'a pas un format valide');
      return;
    }
    next();
  }
};
