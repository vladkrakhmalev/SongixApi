import { Optional } from 'sequelize'

export interface User {
  id: number
  email: string
  password: string
  created_at: string
  updated_at: string
}

export interface UserAttributes {
  id: number
  email: string
  password: string
  created_at?: Date
  updated_at?: Date
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

export interface CreateUserData {
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}
