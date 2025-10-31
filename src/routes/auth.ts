import express from 'express'
import passport from 'passport'
import { AuthController } from '../controllers/authController'
import { authenticateToken } from '../middlewares/auth'

const router = express.Router()

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Устанавливает HttpOnly cookies accessToken и refreshToken
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email and password are required"
 *       409:
 *         description: Пользователь уже существует
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User with this email already exists"
 */
router.post('/register', AuthController.register)

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Устанавливает HttpOnly cookies accessToken и refreshToken
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email and password are required"
 *       401:
 *         description: Неверные учетные данные
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials"
 */
router.post('/login', AuthController.login)

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     summary: Получить профиль пользователя
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-20T07:17:10.000Z"
 *       401:
 *         description: Токен не предоставлен или недействителен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access token required"
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 */
router.get('/profile', authenticateToken, AuthController.getProfile)

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Обновить JWT токен
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Токены успешно обновлены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Устанавливает новые HttpOnly cookies accessToken и refreshToken
 *       401:
 *         description: Токен не предоставлен или недействителен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access token required"
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 */
router.post('/refresh', AuthController.refreshToken)

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Выход из аккаунта (инвалидировать токен на клиенте)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Успешный выход. Тело ответа отсутствует
 *       401:
 *         description: Токен не предоставлен или недействителен
 */
router.post('/logout', authenticateToken, AuthController.logout)

/**
 * @openapi
 * /api/auth/account:
 *   delete:
 *     summary: Удаление аккаунта текущего пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Аккаунт удалён. Тело ответа отсутствует
 *       401:
 *         description: Токен не предоставлен или недействителен
 *       404:
 *         description: Пользователь не найден
 */
router.delete('/account', authenticateToken, AuthController.deleteAccount)

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     summary: Инициировать вход через Google
 *     description: Перенаправляет пользователя на страницу авторизации Google
 *     responses:
 *       302:
 *         description: Редирект на Google OAuth страницу
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback для Google OAuth
 *     description: Обрабатывает ответ от Google после авторизации. Редиректит пользователя на фронтенд с параметрами успеха/ошибки (JSON-ответ не возвращается).
 *     responses:
 *       302:
 *         description: Редирект на страницу фронтенда после попытки Google OAuth. Информация об успехе/ошибке передаётся через query-параметры/Hash/URL.
 *       401:
 *         description: Ошибка аутентификации Google (редирект с параметром ошибки)
 *       500:
 *         description: Внутренняя ошибка сервера (редирект с параметром ошибки)
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  AuthController.googleCallback
)

export default router
