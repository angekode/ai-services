import { Router } from 'express';

import authController from '../endpoints/auth/auth.controller.js';
import authMiddleware from '../endpoints/auth/auth.middleware.js';
import conversationMessageRouter from './conversations-messages.router.js';
import conversationRouter from './conversation.router.js';
import messageRouter from './message.router.js';
import userController from '../endpoints/users/user.contollers.js';
import userRouter from './user.router.js';


const mainRouter = Router();

mainRouter.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
mainRouter.post('/register', userController.createUser);
mainRouter.post('/login', authMiddleware.validateLoginBody, authController.login);

mainRouter.use(userRouter);
mainRouter.use(conversationRouter);
mainRouter.use(messageRouter);
mainRouter.use(conversationMessageRouter);


export default mainRouter;
