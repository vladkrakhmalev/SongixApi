import { Optional } from 'sequelize'

export interface SongAttributes {
  id: number
  title: string
  text: string
  collection_id: number
  created_at?: Date
  updated_at?: Date
}

export interface SongCreationAttributes
  extends Optional<SongAttributes, 'id' | 'created_at' | 'updated_at'> {}

export interface SongFilters {
  collection_id?: number
  search?: string
}

export interface SongUpdateData {
  title?: string
  text?: string
}
