import { Optional } from 'sequelize'

export interface CollectionAttributes {
  id: number
  title: string
  owner_id: number
  created_at?: Date
  updated_at?: Date
}

export interface ICollection extends CollectionAttributes {
  songs_count: number
}

export interface CollectionCreationAttributes
  extends Optional<CollectionAttributes, 'id' | 'created_at' | 'updated_at'> {}

export interface CollectionFilters {
  owner_id?: number
  search?: string
}

export interface CollectionUpdateData {
  title?: string
}
