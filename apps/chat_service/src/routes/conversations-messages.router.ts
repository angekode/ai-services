import { Router } from 'express';
import conversationController from '../endpoints/conversations/conversation.contollers.js';
import messageController from '../endpoints/messages/message.controller.js';
import { conversationCompletionController } from '../endpoints/conversation-completion/controller.js';


const router = Router();


/**
 * ------------------------------------------------------------------------
 * /conversations/id/messages (GET/POST/PATCH/DELETE)
 * ------------------------------------------------------------------------
 */


router.get(
  '/conversations/:conversationId/messages', 
  conversationController.getMessagesFromConversationId
);


router.post(
  '/conversations/:conversationId/messages:complete', 
  conversationCompletionController
);


router.post(
  '/conversations/:conversationId/messages', 
  conversationController.createMessageForConversation, 
  messageController.createMessage
);


export default router;