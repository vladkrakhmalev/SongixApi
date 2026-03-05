import express from 'express'
import ConcertController from '../controllers/concertController'
import { validateConcert, validateConcertUpdate } from '../middlewares/validation'
import { authenticateToken } from '../middlewares/auth'

const router = express.Router()

/**
 * @openapi
 * /api/concerts:
 *   get:
 *     summary: Получить все концерты пользователя
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список концертов пользователя со связанными песнями
 *       401:
 *         description: Не авторизован
 */
router.get('/', authenticateToken, ConcertController.getAll)

/**
 * @openapi
 * /api/concerts/{id}:
 *   get:
 *     summary: Получить концерт по ID
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
 *         description: Концерт со связанными песнями
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Не найдено
 */
router.get('/:id', authenticateToken, ConcertController.getById)

/**
 * @openapi
 * /api/concerts:
 *   post:
 *     summary: Создать новый концерт
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               songIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Создано
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 */
router.post('/', authenticateToken, validateConcert, ConcertController.create)

/**
 * @openapi
 * /api/concerts/{id}:
 *   put:
 *     summary: Обновить концерт
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
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               songIds:
 *                 type: array
 *                 items:
 *                   type: integer
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
  validateConcertUpdate,
  ConcertController.update
)

/**
 * @openapi
 * /api/concerts/{id}:
 *   delete:
 *     summary: Удалить концерт
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
router.delete('/:id', authenticateToken, ConcertController.delete)

export default router
