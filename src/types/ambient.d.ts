declare module 'swagger-ui-express'

// Расширение типов Express для добавления пользовательских свойств
declare global {
  namespace Express {
    interface Request {
      userId?: number
      userEmail?: string
      cookies?: {
        accessToken?: string
        refreshToken?: string
        [key: string]: string | undefined
      }
    }
  }
}

// Типы для JWT
export interface JwtPayload {
  userId: number
  email: string
  iat?: number
  exp?: number
}

// Типы для ошибок
export interface ValidationError {
  name: string
  message: string
  errors: Array<{
    message: string
    path: string
    value: unknown
  }>
}

export interface DatabaseError extends Error {
  code?: string
  errno?: number
  sql?: string
  parameters?: unknown[]
}

// Типы для cookie опций
export interface CookieOptions {
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  path: string
  maxAge?: number
  expires?: Date
}
