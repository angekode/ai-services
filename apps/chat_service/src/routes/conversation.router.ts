import { Router } from 'express';
import conversationController from '../endpoints/conversations/conversation.contollers.js';
import conversationMiddlewares from '../endpoints/conversations/conversation.middlewares.js';


const router = Router();


/**
 * ------------------------------------------------------------------------
 * /conversations (GET/POST/PATCH/DELETE)
 * ------------------------------------------------------------------------
 */


/**
 * @openapi
 * /conversations:
 *   get:
 *     summary: Renvoie la liste des conversations
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
 *                   title:
 *                     type: string
 */
router.get(
  '/conversations',
  conversationController.getAllConversations
);


/**
 * @openapi
 * /conversations:
 *   post:
 *     summary: Crée une nouvelle conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, user_id]
 *             properties:
 *               title:
 *                 type: string
 *               user_id:
 *                 type: integer
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
 *                 title:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *       '400':
 *         description: 'BAD_REQUEST Mauvais format json'
 */
router.post(
  '/conversations', 
  conversationMiddlewares.validateCreateBody,
  conversationController.createConversation
);


/**
 * @openapi
 * /conversations:
 *   patch:
 *     summary: Modifie conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               user_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *       '400':
 *         description: 'BAD_REQUEST Mauvais format json'
 */
router.patch(
  '/conversations/:conversationId',
  conversationMiddlewares.validateConversationIdParam,
  conversationMiddlewares.validateUpdateBody,
  conversationController.updateConversation
);


/**
 * @openapi
 * /conversations/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   delete:
 *     summary: Supprime une conversation
 *     responses:
 *       '204':
 *         description: NO CONTENT
 *       '400':
 *         description: BAD_REQUEST l'identifiant a un format invalide
 *       '404':
 *         description: NOT_FOUND l'identifiant n'existe pas
 */
router.delete(
  '/conversations/:conversationId',
  conversationMiddlewares.validateConversationIdParam,
  conversationController.removeConversation
);


export default router;