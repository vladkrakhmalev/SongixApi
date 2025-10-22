import { Request, Response, NextFunction } from 'express'

const ALLOWED_ORIGINS = process.env['ALLOWED_ORIGINS']?.split(',') || []

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  } else if (ALLOWED_ORIGINS.length === 1) {
    // Fallback to first allowed origin if no origin header or origin not in list
    res.header('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0])
  }

  res.header('Access-Control-Allow-Credentials', 'true')

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}
