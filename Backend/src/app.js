import express from 'express';
import morgan from 'morgan';
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from './config/config.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, (accessToken, refereshToken, profile, done) => {
  return done(null, profile);
}));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;