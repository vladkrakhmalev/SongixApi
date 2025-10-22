import express from 'express'
import collectionsRoutes from './collections'
import songsRoutes from './songs'
import authRoutes from './auth'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/collections', collectionsRoutes)
router.use('/songs', songsRoutes)

export default router
