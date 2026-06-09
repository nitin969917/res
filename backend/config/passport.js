const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { UserModel } = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback';

if (clientId && clientSecret && clientId !== 'YOUR_GOOGLE_CLIENT_ID') {
  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await UserModel.findOne({ googleId: profile.id });

          if (!user) {
            // Check if user exists by email
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
            if (email) {
              user = await UserModel.findOne({ email });
            }
          }

          if (user) {
            // Update user info
            if (!user.googleId) user.googleId = profile.id;
            done(null, user);
          } else {
            // Create a new user
            user = await UserModel.create({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
              avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
            });
            done(null, user);
          }
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
} else {
  console.warn('\n⚠️  Google OAuth environment variables (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are not set.');
  console.log('🔗 Login bypass will be available for local development.\n');
}

module.exports = passport;
