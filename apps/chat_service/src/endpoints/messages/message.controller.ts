import { type Request, type Response, type NextFunction } from 'express';
import database from '../../database/client.js';
import { StatusCodes } from 'http-status-codes';
import { BadInputError } from 'service_library';


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
  },


  async removeMessage(req: Request, res: Response): Promise<void> {
    try {

      const messageId = Number(req.params.messageId);
      if (isNaN(messageId)) {
        throw new BadInputError('Id du message manquant');
      }

      await database.client.messageModel?.removeEntry({ id: messageId });
      res.status(StatusCodes.OK);
      res.end();
      return;

    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: String(error) });
    }
  },
};
