import { Sequelize } from 'sequelize'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../', 'database.sqlite'),
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})

export default sequelize
