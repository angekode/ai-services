import { Router } from 'express';
import messageController from '../endpoints/messages/message.controller.ts';
import messageValidator from '../endpoints/messages/message.validator.ts';

const router = Router();


/**
 * @openapi
 * /messages:
 *   get:
 *     summary: Renvoie la liste de tous les messages
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
 */
router.get(
  '/messages',
  messageController.getAllMessages
);


/**
 * @openapi
 * /messages:
 *   post:
 *     summary: Crée un nouveau message
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
  '/messages',
  messageValidator.validateCreateMessageBody,
  messageController.createMessage
);


/**
 * @openapi
 * /messages/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Renvoie les informations sur un message
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
 *                 role:
 *                   type: string
 *                 content:
 *                   type: string
 *                 conversation_id:
 *                   type: integer
 *       '400':
 *         description: BAD_REQUEST l'identifiant a un format invalide
 *       '404':
 *         description: NOT_FOUND l'identifiant n'existe pas
 */
router.get(
  '/messages/:messageId', 
  messageValidator.validateMessageIdParam,
  messageController.getMessageById
);


/**
 * @openapi
 * /message/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   delete:
 *     summary: Supprime un message
 *     responses:
 *       '204':
 *         description: NO CONTENT
 *       '400':
 *         description: BAD_REQUEST l'identifiant a un format invalide
 *       '404':
 *         description: NOT_FOUND l'identifiant n'existe pas
 */
router.delete(
  '/messages/:messageId',
  messageValidator.validateMessageIdParam,
  messageController.removeMessageById
);


export default router;