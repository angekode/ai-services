import { Router } from 'express';

import { completionController } from '../endpoints/chat-completion/controllers/completion.controller.js';
import { getUserFromUserNameController } from '../endpoints/users/contollers.js';

import { 
  getConversationsFromUserId, 
  getMessagesFromConversationId, 
  createConversation 
} from '../endpoints/conversations/contollers.js';

import { conversationCompletionController } from '../endpoints/conversation-completion/controller.js';


const mainRouter = Router();

mainRouter.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
mainRouter.post('/chat/completions', completionController);
mainRouter.get('/users/:username', getUserFromUserNameController);
mainRouter.get('/users/:userId/conversations', getConversationsFromUserId);
mainRouter.get('/conversations/:conversationId/messages', getMessagesFromConversationId);

mainRouter.post('/conversations', createConversation);
mainRouter.post('/conversations/:conversationId/messages:complete', conversationCompletionController);

export default mainRouter;
