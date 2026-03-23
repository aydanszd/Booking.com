const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy(
    {
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
    },
    (_accessToken, _refreshToken, profile, done) => {
        const user = {
            id:     profile.id,
            name:   profile.displayName,
            email:  profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
        };
        // Buraya DB kaydı ekleyebilirsin (User.findOrCreate vs.)
        return done(null, user);
    }
));

module.exports = passport;