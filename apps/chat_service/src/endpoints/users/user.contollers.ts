import { StatusCodes } from 'http-status-codes';
import { type Request, type Response, type NextFunction } from 'express';
import { BadInputError, ServerError } from 'service_library';

import database from '../../database/client.js';
import { NotFoundError } from '../../error.handler.js';


export default {


  async getAllUsers(req: Request, res: Response): Promise<void> {

    const users = await database.client.userModel?.getAllEntries({ attributes: ['id', 'username'] });
    if (!users) {
      throw new ServerError('Aucun élément retourné');
    }

    res.status(StatusCodes.OK).json(users.map(e => ({ id: e.id, username: e.username })));
  },


  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {

    if (!req.params.userId) {
      throw new BadInputError('req.params.username non défini');
    }

    const user = await database.client.userModel?.getEntryWithId(Number(req.params.userId));
    if (!user) {
      throw new NotFoundError('Utilisateur inconnu');
    }

    res.status(StatusCodes.OK);
    res.json({ id: user.id, username: user.username });

  },


  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {

    const newUser = await database.client.userModel?.addEntry(req.body);
    if (!newUser) {
      throw new ServerError('Utilisateur non crée dans la BDD');
    }

    res.status(StatusCodes.CREATED);
    res.json({ id: newUser.id, username: newUser.username });
  },


  async removeUser(req: Request, res: Response, next: NextFunction): Promise<void> {

    if (!req.params.userId) {
      throw new BadInputError('req.params.username non défini');
    }

    const count = await database.client.userModel?.removeEntry({ id: Number(req.params.userId) });
    if (count === 0) {
      throw new NotFoundError('Utilisateur non supprimée');
    }

    res.status(StatusCodes.NO_CONTENT);
    res.end();
  },
};
