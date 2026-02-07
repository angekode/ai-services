import { Router } from 'express';
import userValidator from '../endpoints/users/user.validators.js';
import userController from '../endpoints/users/user.contollers.js';
import conversationController from '../endpoints/conversations/contollers.js';


const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Renvoie la liste des utilisateurs
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
 *                   username:
 *                     type: string
 */
router.get(
  '/users', 
  userController.getAllUsers
);


/**
 * @openapi
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: CREATED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, username]
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *       '400':
 *         description: 'BAD_REQUEST Mauvais format json'
 */
router.post(
  '/users', 
  userValidator.validateCreateUserBody, 
  userController.createUser
);


/**
 * @openapi
 * /users/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   get:
 *     summary: Renvoie les informations sur un utilisateur
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
 *                 username:
 *                   type: string
 *       '400':
 *         description: BAD_REQUEST l'identifiant a un format invalide
 *       '404':
 *         description: NOT_FOUND l'identifiant n'existe pas
 */
router.get(
  '/users/:userId', 
  userValidator.validateUserIdParam, 
  userController.getUserById
);


/**
 * @openapi
 * /users/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *   delete:
 *     summary: Supprime un utilisateur
 *     responses:
 *       '204':
 *         description: NO CONTENT
 *       '400':
 *         description: BAD_REQUEST l'identifiant a un format invalide
 *       '404':
 *         description: NOT_FOUND l'identifiant n'existe pas
 */
router.delete(
  '/users/:userId', 
  userValidator.validateUserIdParam, 
  userController.removeUser
);


/**
 * @openapi
 * /users/{id}/conversations:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
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
 *                   user_id:
 *                     type: integer
 *       '400':
 *         description: BAD_REQUEST l'identifiant a un format invalide
 *       '404':
 *         description: NOT_FOUND l'identifiant n'existe pas
 */
router.get(
  '/users/:userId/conversations',
  userValidator.validateUserIdParam,
  conversationController.getConversationsFromUserId
);


export default router;