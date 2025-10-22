import { Request, Response } from 'express'
import Song from '../models/Song'
import Collection from '../models/Collection'
import {
  SongCreationAttributes,
  SongFilters,
  SongUpdateData,
} from '../types/Song'

class SongController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const { title, text, collection_id } = req.body

      const collection = await Collection.findById(collection_id)
      if (!collection) {
        res.status(404).json({ error: 'Коллекция не найдена' })
        return
      }

      if (collection.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      const songData: SongCreationAttributes = {
        title,
        text,
        collection_id,
      }

      const validation = Song.validate(songData)
      if (!validation.isValid) {
        res.status(400).json({ error: validation.errors.join(', ') })
        return
      }

      const song = await Song.createSong(songData)

      res.status(201).json(song)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const filters: SongFilters = {}

      if (req.query['collection_id']) {
        const collection_id = parseInt(req.query['collection_id'] as string)

        const collection = await Collection.findById(collection_id)
        if (!collection || collection.owner_id !== userId) {
          res.status(403).json({ error: 'Доступ запрещен' })
          return
        }

        filters.collection_id = collection_id
      }

      if (req.query['search']) {
        filters.search = req.query['search'] as string
      }

      const songs = await Song.findAllSongs(filters)

      res.json(songs)
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
        res.status(400).json({ error: 'ID песни не указан' })
        return
      }

      const song = await Song.findById(parseInt(idParam))

      if (!song) {
        res.status(404).json({ error: 'Песня не найдена' })
        return
      }

      const collection = await Collection.findById(song.collection_id)
      if (!collection || collection.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      res.json(song)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  }

  static async getByCollectionId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const collectionIdParam = req.params['collection_id']
      if (!collectionIdParam) {
        res.status(400).json({ error: 'ID коллекции не указан' })
        return
      }

      const collection_id = parseInt(collectionIdParam)

      const collection = await Collection.findById(collection_id)
      if (!collection || collection.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      const filters: SongFilters = { collection_id }

      if (req.query['search']) {
        filters.search = req.query['search'] as string
      }

      const songs = await Song.findByCollectionId(collection_id, filters)

      res.json(songs)
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
        res.status(400).json({ error: 'ID песни не указан' })
        return
      }

      const song = await Song.findById(parseInt(idParam))

      if (!song) {
        res.status(404).json({ error: 'Песня не найдена' })
        return
      }

      const collection = await Collection.findById(song.collection_id)
      if (!collection || collection.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      const updateData: SongUpdateData = {
        title: req.body.title,
        text: req.body.text,
      }

      // Удаляем undefined значения
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof SongUpdateData] === undefined) {
          delete updateData[key as keyof SongUpdateData]
        }
      })

      const updatedSong = await song.updateSong(updateData)

      res.json(updatedSong)
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
        res.status(400).json({ error: 'ID песни не указан' })
        return
      }

      const song = await Song.findById(parseInt(idParam))

      if (!song) {
        res.status(404).json({ error: 'Песня не найдена' })
        return
      }

      const collection = await Collection.findById(song.collection_id)
      if (!collection || collection.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      const deleted = { ...song.toJSON() }
      await song.deleteSong()

      res.json(deleted)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  }
}

export default SongController
