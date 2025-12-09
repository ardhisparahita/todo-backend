import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import User from "../db/models/User";

passport.use(
  new Strategy(
    {
      clientID: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
      passReqToCallback: true,
    },
    function (
      req: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
