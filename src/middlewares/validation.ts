import { Request, Response, NextFunction } from 'express'
import Collection from '../models/Collection'
import Song from '../models/Song'

const validateCollection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const validation = Collection.validate(req.body)

  if (!validation.isValid) {
    res
      .status(400)
      .json({ error: 'Ошибка валидации', errors: validation.errors })
    return
  }

  next()
}

const validateSong = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const validation = Song.validate(req.body)

  if (!validation.isValid) {
    res
      .status(400)
      .json({ error: 'Ошибка валидации', errors: validation.errors })
    return
  }

  next()
}

const validateSongUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const validation = Song.validateUpdate(req.body)

  if (!validation.isValid) {
    res
      .status(400)
      .json({ error: 'Ошибка валидации', errors: validation.errors })
    return
  }

  next()
}

export { validateCollection, validateSong, validateSongUpdate }
