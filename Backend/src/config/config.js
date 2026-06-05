import envConfig from './env.js';

if(!process.env.PORT) {
  throw new Error('PORT is not defined in environment variables');
}

if(!process.env.DB_URI) {
  throw new Error('DB_URI is not defined in environment variables');
}

if(!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

if(!process.env.CLIENT_URL) {
  throw new Error('CLIENT_URL is not defined in environment variables');
}

if(!process.env.CLIENT_ID) {
  throw new Error('CLIENT_ID is not defined in environment variables');
}

if(!process.env.CLIENT_SECRET) {
  throw new Error('CLIENT_SECRET is not defined in environment variables');
}

const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};

export default config;