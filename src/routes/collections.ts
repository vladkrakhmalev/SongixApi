import express from 'express'
import CollectionController from '../controllers/collectionController'
import { validateCollection } from '../middlewares/validation'
import { authenticateToken } from '../middlewares/auth'

const router = express.Router()

/**
 * @openapi
 * /api/collections:
 *   get:
 *     summary: Получить все коллекции пользователя
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список коллекций пользователя
 *       401:
 *         description: Не авторизован
 */
router.get('/', authenticateToken, CollectionController.getAll)

/**
 * @openapi
 * /api/collections/{id}:
 *   get:
 *     summary: Получить коллекцию по ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Коллекция
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Не найдено
 */
router.get('/:id', authenticateToken, CollectionController.getById)

/**
 * @openapi
 * /api/collections:
 *   post:
 *     summary: Создать новую коллекцию
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Создано
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 */
router.post(
  '/',
  authenticateToken,
  validateCollection,
  CollectionController.create
)

/**
 * @openapi
 * /api/collections/{id}:
 *   put:
 *     summary: Обновить коллекцию
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновлено
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Не найдено
 */
router.put(
  '/:id',
  authenticateToken,
  validateCollection,
  CollectionController.update
)

/**
 * @openapi
 * /api/collections/{id}:
 *   delete:
 *     summary: Удалить коллекцию
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Удалено
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Не найдено
 */
router.delete('/:id', authenticateToken, CollectionController.delete)

export default router
