import express, { Express } from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import {initializeDatabase} from "./config/dbInit";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// postgreSQL session store
const PgSession = pgSession(session);

// loading multiple origins and converting them into a list
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(",") || [];

// trust proxy (for proxied servers like Render)
app.set("trust proxy", 1);

// cores middleware
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
}));

// session middleware
app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie:{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 12, // 12 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);


// apollo server instance
const server = new ApolloServer({
  typeDefs, 
  resolvers,
  cache: "bounded",
  context: ({req, res}) => ({req, res}),
 });


async function startServer() {
  try {
    await initializeDatabase();

    await server.start();
    server.applyMiddleware({ app, cors: false });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Starting Sever Failed:", error);
  }
}

startServer();
