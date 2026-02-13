import { Router } from 'express';

import authController from '../endpoints/auth/auth.controller.ts';
import authMiddleware from '../endpoints/auth/auth.middleware.ts';
import conversationMessageRouter from './conversations-messages.router.ts';
import conversationRouter from './conversation.router.ts';
import messageRouter from './message.router.ts';
import userController from '../endpoints/users/user.contollers.ts';
import userRouter from './user.router.ts';


const mainRouter = Router();

mainRouter.get('/', (_req, res) => res.send('Serveur à l\'écoute'));
mainRouter.post('/register', userController.createUser);
mainRouter.post('/login', authMiddleware.validateLoginBody, authController.login);

mainRouter.use(userRouter);
mainRouter.use(conversationRouter);
mainRouter.use(messageRouter);
mainRouter.use(conversationMessageRouter);


export default mainRouter;
