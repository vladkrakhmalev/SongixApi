import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import passport from './config/passport'
import routes from './routes'
import { errorHandler, notFound } from './middlewares/errorHandler'
import { cors } from './middlewares/cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'
import { createAdminJS } from './admin/config'
import { initializeDatabase } from './config/database'

const app = express()
const { admin, adminRouter } = await createAdminJS()

app.use(cors)
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use('/api', routes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(admin.options.rootPath, adminRouter)
app.use(notFound)
app.use(errorHandler)

async function start(): Promise<void> {
  try {
    await initializeDatabase()

    app.listen(3000, () => {
      console.log(`Server started on port 3000...`)
    })
  } catch (e) {
    console.error(e)
  }
}

start()
