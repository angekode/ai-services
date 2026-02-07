import { Router } from 'express';

import { completionController } from '../endpoints/chat-completion/controllers/completion.controller.js';
import messageController from '../endpoints/messages/message.controller.js';
import userController from '../endpoints/users/contollers.js';

import conversationController from '../endpoints/conversations/contollers.js';

import { conversationCompletionController } from '../endpoints/conversation-completion/controller.js';
import authController from '../endpoints/auth/auth.controller.js';
import authMiddleware from '../endpoints/auth/auth.middleware.js';
import userRouter from './user.router.js';


const mainRouter = Router();

mainRouter.use(userRouter);

mainRouter.post('/register', userController.createUser);
mainRouter.post('/login', authMiddleware.validateLoginBody, authController.login);

mainRouter.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
mainRouter.post('/chat/completions', completionController);



// /conversations
mainRouter.post('/conversations', conversationController.createConversation);
mainRouter.get('/conversations/:conversationId/messages', conversationController.getMessagesFromConversationId);
mainRouter.post('/conversations/:conversationId/messages:complete', conversationCompletionController);
mainRouter.delete('/conversations/:conversationId', conversationController.removeConversation);

// Messages
mainRouter.post('/conversations/:conversationId/messages', conversationController.createMessageForConversation, messageController.createMessage);
mainRouter.delete('/messages/:messageId', messageController.removeMessage);

export default mainRouter;
