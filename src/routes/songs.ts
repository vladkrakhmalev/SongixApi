import express from 'express'
import SongController from '../controllers/songController'
import { validateSong } from '../middlewares/validation'
import { authenticateToken } from '../middlewares/auth'

const router = express.Router()

/**
 * @openapi
 * /api/songs:
 *   get:
 *     summary: Получить все песни пользователя
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: collection_id
 *         schema:
 *           type: integer
 *         description: ID коллекции для фильтрации
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию или тексту песни
 *     responses:
 *       200:
 *         description: Список песен пользователя
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 */
router.get('/', authenticateToken, SongController.getAll)

/**
 * @openapi
 * /api/songs/collection/{collection_id}:
 *   get:
 *     summary: Получить все песни коллекции
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: collection_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID коллекции
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию или тексту песни
 *     responses:
 *       200:
 *         description: Список песен коллекции
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Коллекция не найдена
 */
router.get(
  '/collection/:collection_id',
  authenticateToken,
  SongController.getByCollectionId
)

/**
 * @openapi
 * /api/songs/{id}:
 *   get:
 *     summary: Получить песню по ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID песни
 *     responses:
 *       200:
 *         description: Песня
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Песня не найдена
 */
router.get('/:id', authenticateToken, SongController.getById)

/**
 * @openapi
 * /api/songs:
 *   post:
 *     summary: Создать новую песню
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, text, collection_id]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название песни
 *               text:
 *                 type: string
 *                 description: Текст песни
 *               collection_id:
 *                 type: integer
 *                 description: ID коллекции
 *     responses:
 *       201:
 *         description: Песня создана
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Коллекция не найдена
 */
router.post('/', authenticateToken, validateSong, SongController.create)

/**
 * @openapi
 * /api/songs/{id}:
 *   put:
 *     summary: Обновить песню
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID песни
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название песни
 *               text:
 *                 type: string
 *                 description: Текст песни
 *     responses:
 *       200:
 *         description: Песня обновлена
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Песня не найдена
 */
router.put('/:id', authenticateToken, SongController.update)

/**
 * @openapi
 * /api/songs/{id}:
 *   delete:
 *     summary: Удалить песню
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID песни
 *     responses:
 *       200:
 *         description: Песня удалена
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Песня не найдена
 */
router.delete('/:id', authenticateToken, SongController.delete)

export default router
