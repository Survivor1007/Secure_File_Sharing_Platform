import {z} from 'zod';

export const userPayloadSchema = z.object({
      id:z.string().cuid(),
      email:z.string().email(),
      iat:z.number().optional(),
      exp:z.number().optional(),
});

export type UserPayload = z.infer<typeof userPayloadSchema>;

export interface AuthTokens{
      accessToken: string;
      refreshToken: string;
}

export interface RegisterInput{
      email:string;
      password:string;
      name?:string;
}

export interface LoginInput{
      email: string;
      password:string;
}

export interface ApiError extends Error{
      statusCode: number;
      isOperational? : boolean;
}