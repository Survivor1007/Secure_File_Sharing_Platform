import rateLimit from "express-rate-limit";
import { upload } from "./upload.middleware";

export const authRateLimiter = rateLimit({
      windowMs: 15 * 60 * 100, // 15 minutes
      max: 10, // max 10 login attemmtps in 15 minutes
      message:{success:false, message: 'Too many login attempts.Try again later...'},
      standardHeaders:true,
      legacyHeaders:false,
});

export  const uploadRateLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3,
      message:{success: false, message : 'Upload limit reached. Try again later...'}
});

export const downloadRateLimiter = rateLimit({
      windowMs: 15 * 60 * 100,
      max: 30,
      message: { success: false, message: 'Download limit reached'},
});
