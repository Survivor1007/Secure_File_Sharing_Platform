// src/server.ts
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes';
import fileRoutes from './routes/file.routes';

const app = express();
const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

const PORT = env.PORT;

// Middleware
app.use(helmet());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);   // ← New file routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      environment: env.NODE_ENV,
      database: 'Connected ✅',
      message: 'Secure File Sharing Backend is healthy!',
    });
  } catch (error) {
    res.status(500).json({ status: 'Degraded', database: 'Disconnected ❌' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

const gracefulShutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Auth: /api/auth`);
  console.log(`📁 Files: /api/files`);
});