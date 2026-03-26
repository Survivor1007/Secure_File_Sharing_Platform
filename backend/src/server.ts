// src/server.ts

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { timeStamp } from 'console';


const app = express();
const PORT = env.PORT;


// Security middleware
app.use(helmet());
app.use(morgan(env.NODE_ENV === "development"? "production" : "dev"));
app.use(express.json({limit : "10mb"}));
app.use(cookieParser());

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: env.NODE_ENV,
    message: 'Secure File Sharing Backend is running!' ,
    timeStamp:new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐Environment: ${env.NODE_ENV}`)
});