import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { CreateUserData, LoginData } from '../types/User'
import { CookieOptions, JwtPayload } from '../types/ambient'
import { IS_PROD } from '../config'

const ACCESS_JWT_SECRET =
  process.env['ACCESS_JWT_SECRET'] || process.env['JWT_SECRET']
const REFRESH_JWT_SECRET = process.env['REFRESH_JWT_SECRET']
const ACCESS_TOKEN_EXPIRES_IN = process.env['ACCESS_JWT_EXPIRES_IN'] || '30m'
const REFRESH_TOKEN_EXPIRES_IN = process.env['REFRESH_JWT_EXPIRES_IN'] || '7d'
const FRONTEND_URL = process.env['FRONTEND_URL'] || 'http://localhost:5173'

if (!ACCESS_JWT_SECRET) {
  throw new Error('ACCESS_JWT_SECRET environment variable is required')
}

if (!REFRESH_JWT_SECRET) {
  throw new Error('REFRESH_JWT_SECRET environment variable is required')
}

const accessSecret: string = ACCESS_JWT_SECRET
const refreshSecret: string = REFRESH_JWT_SECRET

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  const base: CookieOptions = {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    path: '/',
  }
  res.cookie('accessToken', accessToken, base)
  res.cookie('refreshToken', refreshToken, base)
}

function clearAuthCookies(res: Response): void {
  const base: CookieOptions = {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    path: '/',
  }
  res.clearCookie('accessToken', base)
  res.clearCookie('refreshToken', base)
}

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: CreateUserData = req.body

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' })
        return
      }

      if (password.length < 6) {
        res
          .status(400)
          .json({ error: 'Password must be at least 6 characters long' })
        return
      }

      const existingUser = await User.findByEmail(email)
      if (existingUser) {
        if (existingUser.google_id) {
          res.status(409).json({
            error:
              'User with this email already exists. Please use Google sign-in.',
          })
        } else {
          res.status(409).json({ error: 'User with this email already exists' })
        }
        return
      }

      const user = await User.createUser({ email, password })

      // @ts-ignore - Known issue with jsonwebtoken types
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        accessSecret,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      )
      // @ts-ignore - Known issue with jsonwebtoken types
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        refreshSecret,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      )

      setAuthCookies(res, accessToken, refreshToken)

      res.status(201).json({ user: { id: user.id, email: user.email } })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginData = req.body

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' })
        return
      }

      const user = await User.findByEmail(email)
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }

      if (!user.password) {
        res.status(401).json({
          error:
            'This account uses Google sign-in. Please use Google to sign in.',
        })
        return
      }

      const isValidPassword = await User.validatePassword(
        password,
        user.password
      )
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }

      // @ts-ignore - Known issue with jsonwebtoken types
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        accessSecret,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      )
      // @ts-ignore - Known issue with jsonwebtoken types
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        refreshSecret,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      )

      setAuthCookies(res, accessToken, refreshToken)

      res.json({ user: { id: user.id, email: user.email } })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const user = await User.findById(userId)
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      res.json({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      })
    } catch (error) {
      console.error('Get me error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshTokenCookie = req.cookies?.['refreshToken']
      if (!refreshTokenCookie) {
        res.status(401).json({ error: 'Refresh token required' })
        return
      }

      let payload: JwtPayload
      try {
        const decoded = jwt.verify(refreshTokenCookie, refreshSecret)
        payload = decoded as JwtPayload
      } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' })
        return
      }

      const user = await User.findById(payload.userId)
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      // @ts-ignore - Known issue with jsonwebtoken types
      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email },
        accessSecret,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      )
      // @ts-ignore - Known issue with jsonwebtoken types
      const newRefreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        refreshSecret,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      )

      setAuthCookies(res, newAccessToken, newRefreshToken)

      res.json({ user: { id: user.id, email: user.email } })
    } catch (error) {
      console.error('Refresh token error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    clearAuthCookies(res)
    res.status(204).send()
  }

  static async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const deleted = await User.deleteById(userId)
      if (!deleted) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      clearAuthCookies(res)
      res.status(204).send()
    } catch (error) {
      console.error('Delete account error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  static async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as User | undefined

      if (!user) {
        res.redirect(
          `${FRONTEND_URL}/google-callback?auth=error&message=authentication_failed`
        )
        return
      }

      // @ts-ignore - Known issue with jsonwebtoken types
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        accessSecret,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      )
      // @ts-ignore - Known issue with jsonwebtoken types
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        refreshSecret,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      )

      setAuthCookies(res, accessToken, refreshToken)

      res.redirect(`${FRONTEND_URL}/google-callback?auth=success`)
    } catch (error) {
      console.error('Google callback error:', error)
      res.redirect(
        `${FRONTEND_URL}/google-callback?auth=error&message=server_error`
      )
    }
  }
}
