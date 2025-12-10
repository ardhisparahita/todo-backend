import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import { Op } from "sequelize";
const db = require("./../db/models");

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await db.User.findOne({
          where: { [Op.or]: [{ googleId: profile.id }, { email }] },
        });

        if (!user) {
          user = await db.User.create({
            username: profile.displayName,
            email,
            googleId: profile.id,
            provider: "google",
            password: null,
          });
        } else if (!user.googleId) {
          // gunakan update langsung supaya aman
          await db.User.update(
            { googleId: profile.id, provider: "google" },
            { where: { id: user.id } }
          );

          // jika perlu, refresh instance
          user = await db.User.findByPk(user.id);
        }

        return done(null, user);
      } catch (err) {
        console.error("GoogleStrategy error:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
