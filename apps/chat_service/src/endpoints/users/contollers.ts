import { type Request, type Response, type NextFunction } from 'express';
import { UserModel } from '../../database/sequelize/user.model.js';
import database from '../../database/client.js';
import { StatusCodes } from 'http-status-codes';
import { BadInputError, ServerError } from 'service_library';
import { NotFoundError } from '../../error.handler.js';


export default {

  async getAllUsers(req: Request, res: Response): Promise<void> {

    try {
      
      const users = await database.client.userModel?.getAllEntries({ attributes: ['id', 'username'] });
      if (!users) {
        throw new ServerError('Aucun élément retourné');
      }
      res.status(StatusCodes.OK).json(users.map(e => ({ id: e.id, username: e.username })));

    } catch (error) {
      if (error instanceof Error) {
        res.send({ error: error.message });
        return;
      }

      res.send({ error: String(error) });
      return;
    }
  },


  async getUserInformationFromUserName(req: Request, res: Response): Promise<void> {
    if (typeof req.params.username !== 'string') {
      res.status(400);
      res.send({error: 'Nom d\'utilisateur manquant'});
      return;
    }
    if (!req.params.username.match(/^\w+$/)) {
      res.status(400);
      res.send({error: 'Nom d\'utilisateur invalide'});
      return;
    }

    try {
      const user = await database.client.userModel?.getFirstEntry({ username: req.params.username });
      if (!user) {
        res.status(500);
        res.send({error: 'Erreur interne'}); // pour ne pas faire fuiter les utilisateurs existants
        return;
      }
    
      res.status(200);
      res.send({ id: user.id, username: user.username });
      return;
      
    } catch (error) {
      if (error instanceof Error) {
        res.send({ error: error.message });
        return;
      }

      res.send({ error: String(error) });
      return;
    }
  },


  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

      const newUser = await database.client.userModel?.addEntry(req.body);
      if (!newUser) {
        throw new ServerError('Utilisateur non crée dans la BDD');
      }

      res.status(StatusCodes.CREATED);
      res.json({ id: newUser.id, username: newUser.username });
      return;
      
    } catch (error) {
      next(error);
      return;
    }
  },


  async removeUser(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      if (!req.params.userId) {
        throw('req.params.username non défini');
      }
      const count = await database.client.userModel?.removeEntry({ id: Number(req.params.userId) });
      if (count === 0) {
        throw new NotFoundError('Utilisateur non supprimée');
      }
      res.status(StatusCodes.NO_CONTENT);
      res.end();
      return;
      
    } catch (error) {
      next(error);
      return;
    }
  },
};
