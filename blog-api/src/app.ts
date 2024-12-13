import express, { Express } from 'express';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog API' });
});
 
export default app;