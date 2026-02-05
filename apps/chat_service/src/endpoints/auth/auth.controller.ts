import type { Request, Response } from 'express'
import database from '../../database/client.js';
import { ServerError, BadInputError} from "service_library";
import { NotFoundError } from '../../error.handler.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';


export default {
  async login(req: Request, res: Response) {
    const user = await database.client.userModel?.getFirstEntry({ username: req.body.username });
    if (!user) {
      throw new NotFoundError('L\'utilisateur n\'existe pas');
    }
    if (req.body.password !== user.password) {
      throw new BadInputError('Mauvais mot de passe');
    }
    if (typeof process.env.JWT_SECRET !== 'string') {
      throw new ServerError('Variable JWT_SECRET invalide');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(StatusCodes.OK);
    res.cookie('token', token);
    res.end();
  }
}