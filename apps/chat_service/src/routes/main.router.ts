import { Router } from 'express';

import { completionController } from '../endpoints/chat-completion/controllers/completion.controller.js';
import messageController from '../endpoints/messages/message.controller.js';
import userController from '../endpoints/users/contollers.js';
import userValidator from '../endpoints/users/validators.js';
import accessControlMiddleware from '../middlewares/accessControl.middleware.js';
import conversationController from '../endpoints/conversations/contollers.js';

import { conversationCompletionController } from '../endpoints/conversation-completion/controller.js';
import authController from '../endpoints/auth/auth.controller.js';
import authMiddleware from '../endpoints/auth/auth.middleware.js';


const mainRouter = Router();

mainRouter.post('/register', userController.createUser);
mainRouter.post('/login', authMiddleware.validateLoginBody, authController.login);

mainRouter.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
mainRouter.post('/chat/completions', completionController);

// /users
mainRouter.get('/users', userController.getAllUsers);
mainRouter.post('/users', userValidator.validateCreateUserBody, userController.createUser);
mainRouter.get('/users/:username', userValidator.validateUsernameParam, userController.getUserInformationFromUserName);
mainRouter.delete('/users/:username', userValidator.validateUsernameParam, userController.removeUser);
mainRouter.get(
  '/users/:userId/conversations',
  //accessControlMiddleware.validateToken,
  conversationController.getConversationsFromUserId
);

// /conversations
mainRouter.post('/conversations', conversationController.createConversation);
mainRouter.get('/conversations/:conversationId/messages', conversationController.getMessagesFromConversationId);
mainRouter.post('/conversations/:conversationId/messages:complete', conversationCompletionController);
mainRouter.delete('/conversations/:conversationId', conversationController.removeConversation);

// Messages
mainRouter.post('/conversations/:conversationId/messages', conversationController.createMessageForConversation, messageController.createMessage);
mainRouter.delete('/messages/:messageId', messageController.removeMessage);

export default mainRouter;
