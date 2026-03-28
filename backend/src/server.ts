// src/server.ts

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { timeStamp } from 'console';
import { PrismaClient } from '@prisma/client';




const app = express();
const prisma = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
const PORT = env.PORT;


// Security middleware
app.use(helmet());
app.use(morgan(env.NODE_ENV === "production"? "combined" : "dev"));
app.use(express.json({limit : "10mb"}));
app.use(cookieParser());

// Basic route
app.get('/api/health', async (req, res) => {
  try{
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status:'OK',
      environment:env.NODE_ENV,
      database:'CONNECTED ',
      message:'Secure File Sharing Backend is healthy',
      timeStamp: new Date().toISOString(),
    })
  }catch(error)
  {
    console.error('Database health check failed:', error);
    res.status(500).json({
      status: 'Degraded',
      environment: env.NODE_ENV,
      database: 'Disconnected ❌',
      message: 'Backend running but database connection failed',
    })
  }
});

const gracefulShutdown = async () => {
  console.log('Shutting down gracefully....')
  await prisma.$disconnect();
  console.log('Prisma disconnected');
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐Environment: ${env.NODE_ENV}`);
  console.log(`🗄️  Database: Connected`);
});