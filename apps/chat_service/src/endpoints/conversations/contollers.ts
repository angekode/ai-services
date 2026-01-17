import { type Request, type Response } from 'express';
import database from '../../database/client.js';
import zod, { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { BadInputError } from 'service_library';


const createConversationScheme = zod.object({ title: zod.string(), user_id: zod.number() });

export async function createConversation(req: Request, res: Response) : Promise<void> {
  if (!req.body) {
    throw new BadInputError('Mauvais format de données ou json manquant');
  }

  //try {
    
  const bodyJson = createConversationScheme.parse(req.body);
  const newConversation = database.client.conversationModel?.addEntry(bodyJson);

  if (!newConversation) {
    res.status(500);
    res.send({ error: 'Erreur interne'});
    return;
  }

  res.status(200);
  res.send(newConversation);
  return;
/*
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
*/
}

export async function getConversationsFromUserId(req: Request, res: Response): Promise<void> {
  if (typeof req.params.userId !== 'string') {
    throw new BadInputError('Id utilisateur manquant');
  }
  if (!req.params.userId.match(/^\d+$/)) {
    throw new BadInputError('Nom d\'utilisateur invalide');
  }

  //try {
 
    const conversations = await database.client.conversationModel?.getEntries({ user_id: Number(req.params.userId) });
    if (!conversations) {
      res.status(500);
      res.send({error: 'Erreur interne'}); // pour ne pas faire fuiter les utilisateurs existants
      return;
    }

    res.status(200);
    res.send(conversations);
    return;

   /*   
  } catch (error) {
    if (error instanceof Error) {
      res.send({ error: error.message });
      return;
    }

    res.send({ error: String(error) });
    return;
  }*/
}


export async function getMessagesFromConversationId(req: Request, res: Response): Promise<void> {
  if (typeof req.params.conversationId !== 'string') {
    throw new BadInputError('Id conversation manquant');
  }
  if (!req.params.conversationId.match(/^\d+$/)) {
    throw new BadInputError('Id conversation manquant');
  }

  //try {
 
    const conversations = await database.client.messageModel?.getEntries({ conversation_id: Number(req.params.conversationId) });
    if (!conversations) {
      res.status(500);
      res.send({error: 'Erreur interne'}); // pour ne pas faire fuiter les utilisateurs existants
      return;
    }

    res.status(200);
    res.send(conversations);
    return;

      /*
  } catch (error) {
    if (error instanceof Error) {
      res.send({ error: error.message });
      return;
    }

    res.send({ error: String(error) });
    return;
  }*/
}