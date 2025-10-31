import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/connection'
import bcrypt from 'bcryptjs'
import { UserAttributes, UserCreationAttributes } from '../types/User'

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number
  public email!: string
  public password!: string | null
  public google_id!: string | null
  public readonly created_at!: Date
  public readonly updated_at!: Date

  static async createUser(userData: {
    email: string
    password?: string
    googleId?: string
  }): Promise<User> {
    const userDataToCreate: {
      email: string
      password?: string
      google_id?: string
    } = {
      email: userData.email,
    }

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      userDataToCreate.password = hashedPassword
    }

    if (userData.googleId) {
      userDataToCreate.google_id = userData.googleId
    }

    return await User.create(userDataToCreate)
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } })
  }

  static async findByGoogleId(googleId: string): Promise<User | null> {
    return await User.findOne({ where: { google_id: googleId } })
  }

  static async findById(id: number): Promise<User | null> {
    return await User.findByPk(id)
  }

  static async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }

  static async linkGoogleAccount(
    userId: number,
    googleId: string
  ): Promise<User | null> {
    const user = await User.findByPk(userId)
    if (!user) {
      return null
    }

    user.google_id = googleId
    await user.save()
    return user
  }

  static async deleteById(id: number): Promise<number> {
    return await User.destroy({ where: { id } })
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)
