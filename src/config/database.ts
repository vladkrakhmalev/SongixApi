import sequelize from './connection'
import '../models/User'
import '../models/Collection'

export const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: false })
    console.log('Database synchronized successfully')
  } catch (error) {
    console.error('Error synchronizing database:', error)
    throw error
  }
}

export { sequelize }
