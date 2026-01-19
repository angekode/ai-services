import { Router } from 'express';

import { completionController } from '../endpoints/chat-completion/controllers/completion.controller.js';

import userController from '../endpoints/users/contollers.js';
import userValidator from '../endpoints/users/validators.js';

import conversationController from '../endpoints/conversations/contollers.js';

import { conversationCompletionController } from '../endpoints/conversation-completion/controller.js';


const mainRouter = Router();

mainRouter.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
mainRouter.post('/chat/completions', completionController);

// /users
mainRouter.post('/users', userValidator.validateCreateUserBody, userController.createUser);
mainRouter.get('/users/:username', userValidator.validateUsernameParam, userController.getUserInformationFromUserName);
mainRouter.delete('/users/:username', userValidator.validateUsernameParam, userController.removeUser);
mainRouter.get('/users/:userId/conversations', conversationController.getConversationsFromUserId);

// /conversations
mainRouter.post('/conversations', conversationController.createConversation);
mainRouter.get('/conversations/:conversationId/messages', conversationController.getMessagesFromConversationId);
mainRouter.post('/conversations/:conversationId/messages:complete', conversationCompletionController);
mainRouter.delete('/conversations/:conversationId', conversationController.removeConversation);

export default mainRouter;
