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
  public password!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date

  static async createUser(userData: {
    email: string
    password: string
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    return await User.create({
      email: userData.email,
      password: hashedPassword,
    })
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } })
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
      allowNull: false,
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
