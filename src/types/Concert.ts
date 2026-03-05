import { Optional } from 'sequelize'

export interface ConcertAttributes {
  id: number
  name: string
  date?: string
  owner_id: number
  created_at?: Date
  updated_at?: Date
}

export interface ConcertCreationAttributes extends Optional<
  ConcertAttributes,
  'id' | 'created_at' | 'updated_at'
> {}

export interface ConcertUpdateData {
  name?: string
  date?: string
}

export interface ConcertRequestBody {
  name?: string
  date?: string
  songIds?: number[]
}
