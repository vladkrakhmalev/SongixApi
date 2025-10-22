import { AuthenticationOptions } from '@adminjs/express'

export const adminAuth: AuthenticationOptions = {
  authenticate: async (email: string, password: string) => {
    // TODO: Implement authentication logic
    if (email === 'admin@songix.com' && password === 'admin123') {
      return { email: 'admin@songix.com', role: 'admin' }
    }
    return null
  },
  cookieName: 'adminjs',
  cookiePassword: 'secret-password-change-in-production',
}
