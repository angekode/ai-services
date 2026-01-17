import { type Request, type Response, type NextFunction } from 'express';
import { UserModel } from '../../database/sequelize/user.model.js';
import database from '../../database/client.js';
import { StatusCodes } from 'http-status-codes';
import { BadInputError } from 'service_library';


export default {

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
      
      res.status(StatusCodes.CREATED);
      res.json({ id: newUser?.id, username: newUser?.username });
      return;
      
    } catch (error) {
      next(error);
      return;
    }
  },


  async removeUser(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      if (!req.params.username) {
        throw('req.params.username non défini');
      }
      const count = await database.client.userModel?.removeEntry({ username: req.params.username });
      if (count === 0) {
        throw new BadInputError('Utilisateur non trouvé');
      }
      res.status(StatusCodes.OK);
      res.json({ removedCount: count });
      return;
      
    } catch (error) {
      next(error);
      return;
    }
  },
};
