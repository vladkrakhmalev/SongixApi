import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID']
const GOOGLE_CLIENT_SECRET = process.env['GOOGLE_CLIENT_SECRET']
const GOOGLE_CALLBACK_URL = process.env['GOOGLE_CALLBACK_URL']

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  console.warn(
    'Google OAuth credentials not configured. Google login will not work.'
  )
}

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const { User } = await import('../models/User')
          const googleId = profile.id
          const email = profile.emails?.[0]?.value

          if (!email) {
            return done(new Error('Email not provided by Google'), undefined)
          }

          let user = await User.findByGoogleId(googleId)

          if (user) {
            return done(null, user)
          }

          user = await User.findByEmail(email)

          if (user) {
            user = await User.linkGoogleAccount(user.id, googleId)
            if (!user) {
              return done(new Error('Failed to link Google account'), undefined)
            }
            return done(null, user)
          }

          user = await User.createUser({
            email,
            googleId,
          })

          return done(null, user)
        } catch (error) {
          return done(error, undefined)
        }
      }
    )
  )
}

export default passport
