import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'
import sequelize from '../config/connection'

AdminJS.registerAdapter(AdminJSSequelize)

export async function createAdminJS() {
  const admin = new AdminJS({
    rootPath: '/admin',
    branding: {
      companyName: 'Songix Admin',
    },
    databases: [sequelize],
  })

  const adminRouter = AdminJSExpress.buildRouter(admin)
  return { admin, adminRouter }
}
