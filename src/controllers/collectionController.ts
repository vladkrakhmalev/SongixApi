import { Request, Response } from 'express'
import Collection from '../models/Collection'
import Song from '../models/Song'
import {
  CollectionCreationAttributes,
  CollectionFilters,
  CollectionUpdateData,
  ICollection,
} from '../types/Collection'

class CollectionController {
  private static async getCollectionWithSongsCount(
    collection: Collection
  ): Promise<ICollection> {
    const songs_count = await Song.count({
      where: { collection_id: collection.id },
    })

    return {
      ...collection.toJSON(),
      songs_count,
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' })
        return
      }

      const collectionData: CollectionCreationAttributes = {
        title: req.body.title,
        owner_id: userId,
      }

      const collection = await Collection.createCollection(collectionData)

      const collectionWithSongsCount =
        await CollectionController.getCollectionWithSongsCount(collection)
      res.status(201).json(collectionWithSongsCount)
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

      const filters: CollectionFilters = {
        owner_id: userId,
      }

      if (req.query['search']) {
        filters.search = req.query['search'] as string
      }

      const collections = await Collection.findAllCollections(filters)

      const collectionsWithSongsCount = await Promise.all(
        collections.map(collection =>
          CollectionController.getCollectionWithSongsCount(collection)
        )
      )

      res.json(collectionsWithSongsCount)
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
        res.status(400).json({ error: 'ID коллекции не указан' })
        return
      }

      const collection = await Collection.findById(parseInt(idParam))

      if (!collection) {
        res.status(404).json({ error: 'Коллекция не найдена' })
        return
      }

      if (collection.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      const collectionWithSongsCount =
        await CollectionController.getCollectionWithSongsCount(collection)
      res.json(collectionWithSongsCount)
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
        res.status(400).json({ error: 'ID коллекции не указан' })
        return
      }

      const collection = await Collection.findById(parseInt(idParam))

      if (!collection) {
        res.status(404).json({ error: 'Коллекция не найдена' })
        return
      }

      if (collection.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      const updateData: CollectionUpdateData = {
        title: req.body.title,
      }

      // Удаляем undefined значения
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof CollectionUpdateData] === undefined) {
          delete updateData[key as keyof CollectionUpdateData]
        }
      })

      const updatedCollection = await collection.updateCollection(updateData)

      const updatedWithSongsCount =
        await CollectionController.getCollectionWithSongsCount(
          updatedCollection
        )
      res.json(updatedWithSongsCount)
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
        res.status(400).json({ error: 'ID коллекции не указан' })
        return
      }

      const collection = await Collection.findById(parseInt(idParam))

      if (!collection) {
        res.status(404).json({ error: 'Коллекция не найдена' })
        return
      }

      if (collection.owner_id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' })
        return
      }

      const deleted = { ...collection.toJSON() }
      await collection.deleteCollection()

      res.json(deleted)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  }
}

export default CollectionController
