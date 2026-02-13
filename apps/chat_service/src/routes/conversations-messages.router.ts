import { Router } from 'express';
import conversationController from '../endpoints/conversations/conversation.contollers.ts';
import messageController from '../endpoints/messages/message.controller.ts';
import { conversationCompletionController } from '../endpoints/conversation-completion/controller.ts';
import conversationMiddlewares from '../endpoints/conversations/conversation.middlewares.ts';
import messageValidator from '../endpoints/messages/message.validator.ts';


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
 *                     enum: [user, system, assistant]
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
 *                 enum: [user, system, assistant]
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



/**
 * @openapi
 * /conversations/${id}/messages:complete:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   post:
 *     summary: Génère un message de réponse à partir des messages de la conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stream]
 *             properties:
 *               stream:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: >
 *                     Identifiant du message à utiliser dans toutes les routes
 *                     (remplace l'usage de l'id OpenAI de completion).
 *                 choices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       finish_reason:
 *                         type: string
 *                         enum: [stop]
 *                       index:
 *                         type: integer
 *                       message:
 *                         type: object
 *                         required:
 *                           - role
 *                           - content
 *                         properties:
 *                           role:
 *                             type: string
 *                             enum: [assistant]
 *                           content:
 *                             type: string
 */
router.post(
  '/conversations/:conversationId/messages:complete', 
  conversationMiddlewares.validateConversationIdParam,
  conversationMiddlewares.checkConversationIdExists,
  messageValidator.validateConversationCompleteBody,
  conversationCompletionController
);


export default router;