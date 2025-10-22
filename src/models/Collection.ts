import { DataTypes, Model, Op } from 'sequelize'
import sequelize from '../config/connection'
import { User } from './User'
import {
  CollectionAttributes,
  CollectionCreationAttributes,
  CollectionFilters,
  CollectionUpdateData,
} from '../types/Collection'

export class Collection
  extends Model<CollectionAttributes, CollectionCreationAttributes>
  implements CollectionAttributes
{
  public id!: number
  public title!: string
  public owner_id!: number
  public readonly created_at!: Date
  public readonly updated_at!: Date

  static async createCollection(
    collectionData: CollectionCreationAttributes
  ): Promise<Collection> {
    try {
      return await Collection.create(collectionData)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при создании коллекции: ${errorMessage}`)
    }
  }

  static async findById(id: number): Promise<Collection | null> {
    try {
      return await Collection.findByPk(id)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при получении коллекции: ${errorMessage}`)
    }
  }

  static async findAllCollections(
    filters: CollectionFilters = {}
  ): Promise<Collection[]> {
    try {
      const where: Record<string, unknown> = {}

      if (filters.owner_id) {
        where['owner_id'] = filters.owner_id
      }

      if (filters.search) {
        where['title'] = {
          [Op.like]: `%${filters.search}%`,
        }
      }

      return await Collection.findAll({ where })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при получении коллекций: ${errorMessage}`)
    }
  }

  async updateCollection(
    updateData: CollectionUpdateData
  ): Promise<Collection> {
    try {
      await this.update(updateData)
      return this
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при обновлении коллекции: ${errorMessage}`)
    }
  }

  async deleteCollection(): Promise<boolean> {
    try {
      await this.destroy()
      return true
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Ошибка при удалении коллекции: ${errorMessage}`)
    }
  }

  static async findByOwnerId(
    owner_id: number,
    filters: CollectionFilters = {}
  ): Promise<Collection[]> {
    try {
      const where: Record<string, unknown> = { owner_id }

      if (filters.search) {
        where['title'] = {
          [Op.like]: `%${filters.search}%`,
        }
      }

      return await Collection.findAll({ where })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(
        `Ошибка при получении коллекций пользователя: ${errorMessage}`
      )
    }
  }

  static validate(data: CollectionCreationAttributes): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Название коллекции обязательно')
    }

    if (data.title && data.title.length > 255) {
      errors.push('Название коллекции не должно превышать 255 символов')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

Collection.init(
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
    modelName: 'Collection',
    tableName: 'collections',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

Collection.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' })
User.hasMany(Collection, { foreignKey: 'owner_id', as: 'collections' })

export default Collection
