// src/server.ts
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import { env } from './config/env';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes';
import fileRoutes from './routes/file.routes';
import shareRoutes from './routes/share.routes';

import { errorHandler } from './middleware/error.middleware';
import { authRateLimiter, uploadRateLimiter, downloadRateLimiter } from './middleware/rateLimiter.middleware';




const app = express();
const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

const PORT = env.PORT;

// Middleware
app.use(helmet({
  contentSecurityPolicy:{
    directives:{
      defaultSrc:["'self'"],
      scriptSrc:["'self'"],
    },
  },
}));
app.use(cors({origin: env.NODE_ENV === 'production' ? false : 'http://localhost:5173',credentials:true}));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());


//Use rate limiting
app.use('/api/auth', authRateLimiter);
app.use('/api/files/upload', uploadRateLimiter);
app.use('/api/share/download', downloadRateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);   // ← New file routes
app.use('/api/share', shareRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      environment: env.NODE_ENV,
      database: 'Connected ✅',
      version:'1.0.0',
      message: 'Secure File Sharing Backend is healthy!',
    });
  } catch (error) {
    res.status(500).json({ status: 'Degraded', database: 'Disconnected ❌' });
  }
});


//Global error handler
app.use(errorHandler)


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

const gracefulShutdown = async () => {
  console.log('🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  console.log('✅ Prisma disconnected');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

app.listen(PORT, () => {
  console.log(`🚀 Secure File Sharing Backend running on http://localhost:${PORT}`);
  console.log(`🔐 Security features enabled: Helmet, Rate Limiting, Argon2id, JWT, Global Error Handler`);
});