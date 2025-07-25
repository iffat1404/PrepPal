const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../models/user.model")

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id).select("-password")
        if (user) {
          return done(null, user)
        }
        return done(null, false)
      } catch (error) {
        return done(error, false)
      }
    },
  ),
)

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id })

        if (user) {
          return done(null, user)
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value })

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id
          user.avatar = profile.photos[0].value
          await user.save()
          return done(null, user)
        }

        // Create new user
        user = new User({
          googleId: profile.id,
          fullName: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          isEmailVerified: true,
          authProvider: "google",
        })

        await user.save()
        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password")
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

module.exports = passport
