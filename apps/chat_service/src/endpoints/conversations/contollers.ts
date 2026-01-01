import { type Request, type Response } from 'express';
import dbClient from '../../database/client.js';


export async function getConversationsFromUserId(req: Request, res: Response): Promise<void> {
  if (typeof req.params.userId !== 'string') {
    res.status(400);
    res.send({error: 'Id utilisateur manquant'});
    return;
  }
  if (!req.params.userId.match(/^\d+$/)) {
    res.status(400);
    res.send({error: 'Nom d\'utilisateur invalide'});
    return;
  }

  try {
 
    const conversations = await dbClient.conversationModel?.getEntries({ user_id: Number(req.params.userId) });
    if (!conversations) {
      res.status(500);
      res.send({error: 'Erreur interne'}); // pour ne pas faire fuiter les utilisateurs existants
      return;
    }

    res.status(200);
    res.send(conversations);
    return;

      
  } catch (error) {
    if (error instanceof Error) {
      res.send({ error: error.message });
      return;
    }

    res.send({ error: String(error) });
    return;
  }
}
