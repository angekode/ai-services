import { Router } from 'express';
import conversationController from '../endpoints/conversations/conversation.contollers.js';
import messageController from '../endpoints/messages/message.controller.js';
import { conversationCompletionController } from '../endpoints/conversation-completion/controller.js';
import conversationMiddlewares from '../endpoints/conversations/conversation.middlewares.js';
import messageValidator from '../endpoints/messages/message.validator.js';


const router = Router();


/**
 * ------------------------------------------------------------------------
 * /conversations/id/messages GET/POST
 * ------------------------------------------------------------------------
 */

/**
 * @openapi
 * /conversations/${id}/messages:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Renvoie la liste de tous les messages de la conversation
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   role:
 *                     type: string
 *                   conversation_id:
 *                     type: integer
 */
router.get(
  '/conversations/:conversationId/messages',
  conversationMiddlewares.validateConversationIdParam,
  messageController.getMessageWithConversationId
);


/**
 * @openapi
 * /conversations/${id}/messages:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   post:
 *     summary: Crée un nouveau message associé à la conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role, content]
 *             properties:
 *               role:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       '201':
 *         description: CREATED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 role:
 *                   type: string
 *                 content:
 *                   type: string
 *       '400':
 *         description: 'BAD_REQUEST Mauvais format json'
 */
router.post(
  '/conversations/:conversationId/messages',
  conversationMiddlewares.validateConversationIdParam,
  messageValidator.validateCreateMessageNoConversationIdBody,
  messageController.createMessageWithConversationId
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