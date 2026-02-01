import { type Request, type Response, type NextFunction } from 'express';
import database from '../../database/client.js';
import zod, { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { BadInputError } from 'service_library';


const createConversationScheme = zod.object({ title: zod.string(), user_id: zod.number() });

export default {

  async createConversation(req: Request, res: Response) : Promise<void> {
    if (!req.body) {
      throw new BadInputError('Mauvais format de données ou json manquant');
    }
      
    const bodyJson = createConversationScheme.parse(req.body);
    const newConversation = await database.client.conversationModel?.addEntry(bodyJson);

    if (!newConversation) {
      res.status(500);
      res.send({ error: 'Erreur interne'});
      return;
    }

    res.status(StatusCodes.CREATED);
    res.send(newConversation);
    return;
  },


  async getConversationsFromUserId(req: Request, res: Response): Promise<void> {
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
  },


  async getMessagesFromConversationId(req: Request, res: Response): Promise<void> {
    if (typeof req.params.conversationId !== 'string') {
      throw new BadInputError('Id conversation manquant');
    }
    if (!req.params.conversationId.match(/^\d+$/)) {
      throw new BadInputError('Id conversation manquant');
    }

    const messagesHistory = await database.client.messageModel?.getEntries(
      { conversation_id: Number(req.params.conversationId) },
      { ordering: { order: 'ascending', columnName: 'created_at' }}
    );
    if (!messagesHistory) {
      res.status(500);
      res.send({error: 'Erreur interne'}); // pour ne pas faire fuiter les utilisateurs existants
      return;
    }

    res.status(200);
    res.send(messagesHistory);
    return;
  },

  async removeConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const count = await database.client.conversationModel?.removeEntry({ id: Number(req.params.conversationId) });
      if (count === 0) {
        throw new BadInputError('Id de la conversation innexistant');
      }

      res.status(StatusCodes.OK);
      res.json({ removedCount: count });
      return;

    } catch (error) {
      next(error);
    }
  },

  async createMessageForConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestJson = req.body;
    const requestWithConversationId = { ...requestJson, conversationId: req.params.conversationId };
    req.body = requestWithConversationId;
    next();
  }
};
