import { type Request, type Response } from 'express';
import { UserModel } from '../../database/sequelize/user.model.js';
import dbClient from '../../database/client.js';


export async function getUserFromUserNameController(req: Request, res: Response): Promise<void> {
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

  const user = await dbClient.userModel?.getFirstEntry({ username: req.params.username });
  if (!user) {
    res.status(500);
    res.send({error: 'Erreur interne'}); // pour ne pas faire fuiter les utilisateurs existants
    return;
  }

  res.status(200);
  res.send({ id: user.id, username: user.username });
  return;
}
