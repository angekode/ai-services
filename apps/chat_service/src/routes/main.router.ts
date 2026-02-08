import { Router } from 'express';

import { completionController } from '../endpoints/chat-completion/controllers/completion.controller.js';
import messageController from '../endpoints/messages/message.controller.js';
import userController from '../endpoints/users/user.contollers.js';

import conversationController from '../endpoints/conversations/conversation.contollers.js';

import { conversationCompletionController } from '../endpoints/conversation-completion/controller.js';
import authController from '../endpoints/auth/auth.controller.js';
import authMiddleware from '../endpoints/auth/auth.middleware.js';

import userRouter from './user.router.js';
import conversationRouter from './conversation.router.js';


const mainRouter = Router();

mainRouter.use(userRouter);
mainRouter.use(conversationRouter);


mainRouter.post('/register', userController.createUser);
mainRouter.post('/login', authMiddleware.validateLoginBody, authController.login);

mainRouter.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
mainRouter.post('/chat/completions', completionController);




mainRouter.delete('/messages/:messageId', messageController.removeMessage);

export default mainRouter;
