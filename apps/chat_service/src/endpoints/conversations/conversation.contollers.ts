import { type Request, type Response, type NextFunction } from 'express';
import database from '../../database/client.ts';
import zod from 'zod';
import { StatusCodes } from 'http-status-codes';
import { BadInputError, ServerError } from 'service_library';
import { NotFoundError } from '../../error.handler.ts';


const createConversationScheme = zod.object({ title: zod.string(), user_id: zod.number() });


export default {


  async getAllConversations(req: Request, res: Response) : Promise<void> {

    const conversations = await database.client.conversationModel?.getAllEntries();
    res.status(StatusCodes.OK);
    res.json(conversations);
  },


  async createConversation(req: Request, res: Response) : Promise<void> {

    const newConversation = await database.client.conversationModel?.addEntry(req.body);

    if (!newConversation) {
      throw new ServerError('La conversation n\'a pas été mise à jour');
    }

    res.status(StatusCodes.CREATED);
    res.json(newConversation);
  },


  async updateConversation(req: Request, res: Response) : Promise<void> {
    
    const updatedConversation = await database.client.conversationModel?.updateEntryWithId(Number(req.params.conversationId), req.body);

    if (!updatedConversation) {
      throw new ServerError('La conversation n\'a pas été mise à jour');
    }

    res.status(StatusCodes.OK);
    res.json(updatedConversation);
  },


  async getConversationsFromUserId(req: Request, res: Response): Promise<void> {

      const user = await database.client.userModel?.getEntryWithId(Number(req.params.userId));
      if (!user) {
        throw new NotFoundError('L\'utilisateur n\'existe pas');
      }
  
      const conversations = await database.client.conversationModel?.getEntries({ user_id: Number(req.params.userId) });

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

    if (!req.params.conversationId) {
      throw new ServerError('Id de la conversation manquante');
    }

    const conversation = await database.client.conversationModel?.getEntryWithId(Number(req.params.conversationId));
    if (!conversation) {
      throw new NotFoundError('Conversation inexistante');
    }

    const count = await database.client.conversationModel?.removeEntry({ id: Number(req.params.conversationId) });
    if (count === 0) {
      throw new ServerError('La conversation n\' pas été supprimée');
    }

    res.status(StatusCodes.NO_CONTENT);
    res.end();
  },


  async createMessageForConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestJson = req.body;
    const requestWithConversationId = { ...requestJson, conversationId: req.params.conversationId };
    req.body = requestWithConversationId;
    next();
  }
};
