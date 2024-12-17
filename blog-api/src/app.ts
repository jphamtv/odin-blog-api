import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter';
// import postsRouter from './routes/postsRouter';
// import commentsRouter from './routes/commentsRouter';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log error for debugging
  res.status(500).json({ error: 'Something went wrong' }); // Send simple message to user to see
});

// Basic CORS setup
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.use('api/auth', authRouter);
// app.use('api/posts', postsRouter);
// app.use('api/comments', commentsRouter);
 
export default app;