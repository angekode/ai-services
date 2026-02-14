import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ServerError } from 'service_library';
import zod from 'zod';

const tokenScheme = zod.object({
  userId: zod.number()
});

type TokenType = zod.infer<typeof tokenScheme>;

export default {
  /**
   * Vérifie si le token dans les cookies token=... est valide 
   * et place l'identificateur dans req.userId.
   */
  validateToken(req: Request, res: Response, next: NextFunction) {
    if (typeof process.env.JWT_SECRET !== 'string') {
      throw new ServerError('JWT_SECRET invalide');
    }

    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const token = tokenScheme.parse(decoded) as TokenType;
    req.userId = token.userId;
    next();
  }
};