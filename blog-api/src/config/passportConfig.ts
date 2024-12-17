import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from "@prisma/client";
import { jwtConfig } from './jwtConfig';
const { getByEmail, getById } = require("../models/userModel");

const prisma = new PrismaClient();

function initialize() {
  // Local Strategy - for login
  const options = {
    usernameField: "email",
    passwordField: "password",
  };

  passport.use(
    new LocalStrategy(options, async (email, password, done) => {
      try {
        // Find user by email
        const user = await getByEmail(email);

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        // Check if password matches
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  interface JwtPayload {
    id: string;
  }

  // JWT Strategy - for protected routes
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.secret,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload: JwtPayload, done) => {
      try {
        const user = await getById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(null, false);
      }
    })
  );
}

export default initialize;
