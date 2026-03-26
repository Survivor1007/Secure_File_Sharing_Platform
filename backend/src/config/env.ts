import dotenv from "dotenv";
dotenv.config();

import { configDotenv } from "dotenv";
import {z} from "zod";

const envSchema = z.object({
      DATABASE_URL:z.string().url(),

      JWT_ACCESS_SECRET:z.string().min(32, "JWT_ACCESS_SECRET must be atleast 32 characters"),
      JWT_REFRESH_SECRET:z.string().min(32, "JWT_REFRESH_SECRET must be atleast 32 characters"),

      ACCESS_TOKEN_EXPIRES_IN:z.string().default("15m"),
      REFRESH_TOKEN_EXPIRES_IN:z.string().default("7d"),

      PORT:z.coerce.number().default(5000),

      NODE_ENV: z.enum(["production", "development", "test"]).default("development"),

      MAX_FILE_SIZE:z.coerce.number().default(52428800),//50MB
});

export type Env = z.infer<typeof envSchema>;

let env : Env;

try {
  env = envSchema.parse(process.env);
  console.log("✅ Environment variables validated successfully");
} catch (error: any) {
  console.error("❌ Environment validation failed:");
  console.error(error.errors);
  process.exit(1); // Stop the server cleanly
}

export { env };
