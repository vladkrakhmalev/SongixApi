import { DataTypes, Model, BelongsToManySetAssociationsMixin } from 'sequelize'
import sequelize from '../config/connection'
import { User } from './User'
import { Song } from './Song'
import {
  ConcertAttributes,
  ConcertCreationAttributes,
  ConcertRequestBody,
  ConcertUpdateData,
} from '../types/Concert'

export class Concert
  extends Model<ConcertAttributes, ConcertCreationAttributes>
  implements ConcertAttributes
{
  public id!: number
  public name!: string
  public date?: string
  public owner_id!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date

  declare setSongs: BelongsToManySetAssociationsMixin<Song, number>

  static async createConcert(
    concertData: ConcertCreationAttributes
  ): Promise<Concert> {
    try {
      return await Concert.create(concertData)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при создании концерта: ${errorMessage}`)
    }
  }

  static async findById(id: number): Promise<Concert | null> {
    try {
      return await Concert.findByPk(id, {
        include: [{ model: Song, as: 'songs' }],
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при получении концерта: ${errorMessage}`)
    }
  }

  static async findByOwnerId(owner_id: number): Promise<Concert[]> {
    try {
      return await Concert.findAll({
        where: { owner_id },
        include: [{ model: Song, as: 'songs' }],
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(
        `Ошибка при получении концертов пользователя: ${errorMessage}`
      )
    }
  }

  async updateConcert(updateData: ConcertUpdateData): Promise<Concert> {
    try {
      await this.update(updateData)
      return this
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при обновлении концерта: ${errorMessage}`)
    }
  }

  async deleteConcert(): Promise<boolean> {
    try {
      await this.destroy()
      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при удалении концерта: ${errorMessage}`)
    }
  }

  static validate(data: ConcertRequestBody): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Название концерта обязательно')
    }

    if (data.name && data.name.length > 255) {
      errors.push('Название концерта не должно превышать 255 символов')
    }

    if (data.date !== undefined && (
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
      isNaN(Date.parse(data.date))
    )) {
      errors.push('Дата концерта должна быть в формате YYYY-MM-DD')
    }

    if (data.songIds !== undefined) {
      if (!Array.isArray(data.songIds)) {
        errors.push('songIds должен быть массивом')
      } else if (
        data.songIds.some(id => typeof id !== 'number' || isNaN(id))
      ) {
        errors.push('songIds должен содержать только числа')
      }
    }

    return { isValid: errors.length === 0, errors }
  }

  static validateUpdate(data: ConcertRequestBody): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (
      data.name === undefined &&
      data.date === undefined &&
      data.songIds === undefined
    ) {
      errors.push('Необходимо указать хотя бы одно поле для обновления')
    }

    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.push('Название концерта не может быть пустым')
      } else if (data.name.length > 255) {
        errors.push('Название концерта не должно превышать 255 символов')
      }
    }

    if (data.date !== undefined) {
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
        isNaN(Date.parse(data.date))
      ) {
        errors.push('Дата концерта должна быть в формате YYYY-MM-DD')
      }
    }

    if (data.songIds !== undefined) {
      if (!Array.isArray(data.songIds)) {
        errors.push('songIds должен быть массивом')
      } else if (
        data.songIds.some(id => typeof id !== 'number' || isNaN(id))
      ) {
        errors.push('songIds должен содержать только числа')
      }
    }

    return { isValid: errors.length === 0, errors }
  }
}

Concert.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Concert',
    tableName: 'concerts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

Concert.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' })
User.hasMany(Concert, { foreignKey: 'owner_id', as: 'concerts' })

Concert.belongsToMany(Song, {
  through: 'concert_songs',
  as: 'songs',
  foreignKey: 'concert_id',
  otherKey: 'song_id',
})
Song.belongsToMany(Concert, {
  through: 'concert_songs',
  as: 'concerts',
  foreignKey: 'song_id',
  otherKey: 'concert_id',
})

export default Concert
