import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { contactsRouter } from './routes/contacts';
// Load environment variables
dotenv.config();

const app = express();
const port = 8080;
const host = process.env.HOST || 'https://172.86.69.254';

// Request logging middleware
app.use((req, _, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);
// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, host, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🔗 API URL: http://${host}:${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
