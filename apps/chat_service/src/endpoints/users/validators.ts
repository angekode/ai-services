import { type Request, type Response, type NextFunction } from 'express';
import zod, { ZodError } from 'zod';
import { BadInputError } from 'service_library';


const createUserBodyScheme = zod.object({
  username: zod.string(),
  password: zod.string()
});


export default {
  validateCreateUserBody(req: Request, res: Response, next: NextFunction): void {
    createUserBodyScheme.parse(req.body);
    next();
  },

  validateUserIdParam(req: Request, res: Response, next: NextFunction): void {
    if (isNaN(Number(req.params.id))) {
      throw new BadInputError('L\'identificateur du user n\'a pas un format valide');
    }
    next();
  }
};
