import { type Request, type Response, type NextFunction } from 'express';
import database from '../../database/client.js';
import { StatusCodes } from 'http-status-codes';


export default {
  async createMessage(req: Request, res: Response): Promise<void> {
    try {

      const newMessage = await database.client.messageModel?.addEntry({
        role: req.body.role,
        content: req.body.content,
        conversation_id: req.body.conversationId
      });
  
      res.status(StatusCodes.CREATED);
      res.json(newMessage);
      return;
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: String(error) });
    }
  }
};
