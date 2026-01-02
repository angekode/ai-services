import { type Request, type Response } from 'express';
import dbClient from '../../database/client.js';
import zod, { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';


const createConversationScheme = zod.object({ title: zod.string(), user_id: zod.number() });

export async function createConversation(req: Request, res: Response) : Promise<void> {
  if (!req.body) {
    res.status(400);
    res.send({ error: 'Mauvais format de données'});
    return;
  }

  try {
    
    const bodyJson = createConversationScheme.parse(req.body);
    const newConversation = dbClient.conversationModel?.addEntry(bodyJson);

    if (!newConversation) {
      res.status(500);
      res.send({ error: 'Erreur interne'});
      return;
    }

    res.status(200);
    res.send(newConversation);
    return;

  } catch(error) {
    if (error instanceof ZodError) {
      res.status(StatusCodes.BAD_REQUEST);
      res.send({ error: error.message });
      return;
      
    } else if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.send({ error: error.message});
      return;

    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.send({ error: String(error)});
      return;
    }
  }

}

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


export async function getMessagesFromConversationId(req: Request, res: Response): Promise<void> {
    if (typeof req.params.conversationId !== 'string') {
    res.status(400);
    res.send({error: 'Id conversation manquant'});
    return;
  }
  if (!req.params.conversationId.match(/^\d+$/)) {
    res.status(400);
    res.send({error: 'Id conversation invalide'});
    return;
  }

  try {
 
    const conversations = await dbClient.messageModel?.getEntries({ conversation_id: Number(req.params.conversationId) });
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