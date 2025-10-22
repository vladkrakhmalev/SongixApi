import { DataTypes, Model, Op } from 'sequelize'
import sequelize from '../config/connection'
import { Collection } from './Collection'
import {
  SongAttributes,
  SongCreationAttributes,
  SongFilters,
  SongUpdateData,
} from '../types/Song'

export class Song
  extends Model<SongAttributes, SongCreationAttributes>
  implements SongAttributes
{
  public id!: number
  public title!: string
  public text!: string
  public collection_id!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date

  static async createSong(songData: SongCreationAttributes): Promise<Song> {
    try {
      return await Song.create(songData)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при создании песни: ${errorMessage}`)
    }
  }

  static async findById(id: number): Promise<Song | null> {
    try {
      return await Song.findByPk(id)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при получении песни: ${errorMessage}`)
    }
  }

  static async findAllSongs(filters: SongFilters = {}): Promise<Song[]> {
    try {
      const where: Record<string | symbol, unknown> = {}

      if (filters.collection_id) {
        where['collection_id'] = filters.collection_id
      }

      if (filters.search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${filters.search}%` } },
          { text: { [Op.like]: `%${filters.search}%` } },
        ]
      }

      return await Song.findAll({ where })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при получении песен: ${errorMessage}`)
    }
  }

  static async findByCollectionId(
    collection_id: number,
    filters: SongFilters = {}
  ): Promise<Song[]> {
    try {
      const where: Record<string | symbol, unknown> = { collection_id }

      if (filters.search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${filters.search}%` } },
          { text: { [Op.like]: `%${filters.search}%` } },
        ]
      }

      return await Song.findAll({ where })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при получении песен коллекции: ${errorMessage}`)
    }
  }

  async updateSong(updateData: SongUpdateData): Promise<Song> {
    try {
      await this.update(updateData)
      return this
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при обновлении песни: ${errorMessage}`)
    }
  }

  async deleteSong(): Promise<boolean> {
    try {
      await this.destroy()
      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при удалении песни: ${errorMessage}`)
    }
  }

  static validate(data: SongCreationAttributes): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Название песни обязательно')
    }

    if (data.title && data.title.length > 255) {
      errors.push('Название песни не должно превышать 255 символов')
    }

    if (!data.text || data.text.trim().length === 0) {
      errors.push('Текст песни обязателен')
    }

    if (!data.collection_id || isNaN(Number(data.collection_id))) {
      errors.push('ID коллекции обязателен и должен быть числом')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateUpdate(data: SongUpdateData): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        errors.push('Название песни не может быть пустым')
      }

      if (data.title && data.title.length > 255) {
        errors.push('Название песни не должно превышать 255 символов')
      }
    }

    if (data.text !== undefined) {
      if (!data.text || data.text.trim().length === 0) {
        errors.push('Текст песни не может быть пустым')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

Song.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Collection,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Song',
    tableName: 'songs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

Song.belongsTo(Collection, { foreignKey: 'collection_id', as: 'collection' })
Collection.hasMany(Song, { foreignKey: 'collection_id', as: 'songs' })

export default Song
