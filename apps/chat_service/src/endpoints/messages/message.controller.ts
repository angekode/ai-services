import { type Request, type Response, type NextFunction } from 'express';
import database from '../../database/client.ts';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../../error.handler.ts';


export default {

  async getAllMessages(req: Request, res: Response): Promise<void> {
    const messages = await database.client.messageModel?.getAllEntries();
    res.status(StatusCodes.OK);
    res.json(messages);
  },
  
  
  async getMessageById(req: Request, res: Response): Promise<void> {
    const message = await database.client.messageModel?.getEntryWithId(Number(req.params.messageId));
    if (!message) {
      throw new NotFoundError('Message inexistant');
    }
    res.status(StatusCodes.OK);
    res.json(message);
  },
  
  
  async createMessage(req: Request, res: Response): Promise<void> {
    const message = await database.client.messageModel?.addEntry(req.body);
    res.status(StatusCodes.CREATED);
    res.json(message);
  },


  async createMessageWithConversationId(req: Request, res: Response): Promise<void> {
    const conversation = await database.client.conversationModel?.getEntryWithId(Number(req.params.conversationId));
    if (!conversation) {
      throw new NotFoundError('Conversation inexistante');
    }

    const message = await database.client.messageModel?.addEntry({ ...req.body, conversation_id: Number(req.params.conversationId) });
    res.status(StatusCodes.CREATED);
    res.json(message);
  },
  
  
  async updateMessage(req: Request, res: Response): Promise<void> {
    const updatedMessage = await database.client.messageModel?.updateEntryWithId(Number(req.params.messageId), req.body);
    res.status(StatusCodes.OK);
    res.json(updatedMessage);
  },
  
  
  async removeMessageById(req: Request, res: Response): Promise<void> {
    const message = await database.client.messageModel?.getEntryWithId(Number(req.params.messageId));
    if (!message) {
      throw new NotFoundError('Message inexistant');
    }
    await database.client.messageModel?.removeEntry({ id: Number(req.params.messageId) });
    res.status(StatusCodes.NO_CONTENT);
    res.json(message);
  },
  
  
  async getMessageWithConversationId(req: Request, res: Response): Promise<void> {
    const conversation = await database.client.conversationModel?.getEntryWithId(Number(req.params.conversationId));
    if (!conversation) {
      throw new NotFoundError('Conversation inexistante');
    }
    
    const messages = await database.client.messageModel?.getEntries({ conversation_id: req.params.conversationId });
    res.status(StatusCodes.OK);
    res.json(messages);
  }
};
