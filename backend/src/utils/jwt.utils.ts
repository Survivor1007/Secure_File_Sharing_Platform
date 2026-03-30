import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { userPayloadSchema, UserPayload } from '../types';

export class JwtService{
      static generateAccessToken(payload: UserPayload): string {
            return jwt.sign(payload, env.JWT_ACCESS_SECRET, {expiresIn:env.ACCESS_TOKEN_EXPIRES_IN});
      }

      static generateRefreshToken(payload: UserPayload):string{
            return jwt.sign(payload, env.JWT_REFRESH_SECRET, {expiresIn: env.REFRESH_TOKEN_EXPIRES_IN});
      }

      static verifyAccessToken(token:string):UserPayload{
            const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
            return userPayloadSchema.parse(decoded);
      }

      static verifyRefreshToken(token:string):UserPayload{
            const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
            return userPayloadSchema.parse(decoded);
      }
}