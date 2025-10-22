import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types/ambient'

const ACCESS_JWT_SECRET =
  process.env['ACCESS_JWT_SECRET'] || process.env['JWT_SECRET']

if (!ACCESS_JWT_SECRET) {
  throw new Error('ACCESS_JWT_SECRET environment variable is required')
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.['accessToken']

  if (!token) {
    res.status(401).json({ error: 'Access token required' })
    return
  }

  try {
    const decoded = jwt.verify(token, ACCESS_JWT_SECRET) as JwtPayload
    req.userId = decoded.userId
    req.userEmail = decoded.email
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' })
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid token' })
    } else {
      res.status(401).json({ error: 'Token verification failed' })
    }
  }
}
