import { Request, Response } from 'express'
import { Concert } from '../models/Concert'
import { ConcertCreationAttributes, ConcertUpdateData } from '../types/Concert'

class ConcertController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const concerts = await Concert.findByOwnerId(userId)
      res.json(concerts)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const idParam = req.params['id']
      if (!idParam) {
        res.status(400).json({ error: 'ID концерта не указан' })
        return
      }

      const concert = await Concert.findById(parseInt(idParam))

      if (!concert) {
        res.status(404).json({ error: 'Концерт не найден' })
        return
      }

      if (concert.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      res.json(concert)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const concertData: ConcertCreationAttributes = {
        name: req.body.name,
        date: req.body.date,
        owner_id: userId,
      }

      const concert = await Concert.createConcert(concertData)

      if (Array.isArray(req.body.songIds)) {
        await concert.setSongs(req.body.songIds as number[])
      }

      const concertWithSongs = await Concert.findById(concert.id)
      res.status(201).json(concertWithSongs)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const idParam = req.params['id']
      if (!idParam) {
        res.status(400).json({ error: 'ID концерта не указан' })
        return
      }

      const concert = await Concert.findById(parseInt(idParam))

      if (!concert) {
        res.status(404).json({ error: 'Концерт не найден' })
        return
      }

      if (concert.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      const updateData: ConcertUpdateData = {}

      if (req.body.name !== undefined) {
        updateData.name = req.body.name
      }

      if (req.body.date !== undefined) {
        updateData.date = req.body.date
      }

      if (Object.keys(updateData).length > 0) {
        await concert.updateConcert(updateData)
      }

      if (Array.isArray(req.body.songIds)) {
        await concert.setSongs(req.body.songIds as number[])
      }

      const updatedConcert = await Concert.findById(concert.id)
      res.json(updatedConcert)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const idParam = req.params['id']
      if (!idParam) {
        res.status(400).json({ error: 'ID концерта не указан' })
        return
      }

      const concert = await Concert.findById(parseInt(idParam))

      if (!concert) {
        res.status(404).json({ error: 'Концерт не найден' })
        return
      }

      if (concert.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      const deleted = { ...concert.toJSON() }
      await concert.deleteConcert()

      res.json(deleted)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  }
}

export default ConcertController
