import zod from 'zod';
import type { Request, Response, NextFunction } from 'express';


const loginBodyScheme = zod.object({
  username: zod.string(),
  password: zod.string()
});

export default {
  validateLoginBody(req: Request, res: Response, next: Function) {
    loginBodyScheme.parse(req.body);
    next();
  }
};

