import { Request, Response, NextFunction } from 'express'
import { ValidationError, DatabaseError } from '../types/ambient'

const errorHandler = (
  err: Error | ValidationError | DatabaseError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Ошибка:', err)

  if (err.name === 'ValidationError') {
    const validationError = err as ValidationError
    res.status(400).json({
      error: 'Ошибка валидации данных',
      errors: validationError.errors,
    })
    return
  }

  if ('code' in err && err.code === 'SQLITE_CONSTRAINT') {
    res.status(400).json({ error: 'Нарушение ограничений базы данных' })
    return
  }

  if ('code' in err && err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    res
      .status(409)
      .json({ error: 'Коллекция с таким названием уже существует' })
    return
  }

  res.status(500).json({ error: 'Внутренняя ошибка сервера' })
}

const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Маршрут не найден' })
}

export { errorHandler, notFound }
