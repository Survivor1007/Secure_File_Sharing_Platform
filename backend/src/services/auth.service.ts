import { Prisma, PrismaClient, User } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {env} from "../config/env";
import { RegisterInput,LoginInput, UserPayload, AuthTokens  } from "../types/index";

const prisma = new PrismaClient();

export class  AuthService{
      async register(data: RegisterInput): Promise<User> {
            const existingUser = await prisma.user.findUnique({
            where: {email: data.email.toLowerCase()},
            });

            if(existingUser){
                  throw new Error('User with this email already exists');
            }
            
            //Hash pasword using argon2id
            const passwordHash = await argon2.hash(data.password, {
                  type: argon2.argon2id,
                  memoryCost: 65536,
                  timeCost: 3,
                  parallelism: 4
            });

            const user = await prisma.user.create({
                  data:{
                        email: data.email.toLowerCase(),
                        passwordHash,
                        name:data.name,
                  }
            });

            //never return  the password
            const { passwordHash: _, ...userWithoutPassword} = user;
            return userWithoutPassword as User;
      }

      async login(data:LoginInput):Promise<AuthTokens>{
            const user = await prisma.user.findUnique({
            where: {email: data.email.toLowerCase()},
            });

            if(!user || !(await argon2.verify(user.passwordHash, data.password))){
                  throw new Error('Invalid email or password');
            }

            if(!user.isActive){
                  throw new Error('Account is deactivated');
            }

            return this.generateTokens(user);
      }

      private generateTokens(user: User): AuthTokens{
            const payload: UserPayload = {
                  id: user.id,
                  email: user.email,
            };

            const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {expiresIn:env.ACCESS_TOKEN_EXPIRES_IN});

            const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {expiresIn:env.REFRESH_TOKEN_EXPIRES_IN});

            return {accessToken, refreshToken};
      }

      async refreshToken(refreshToken: string):Promise<AuthTokens>{
            try{
            const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as UserPayload;

            const user = await prisma.user.findUnique({
                  where: {id : payload.id},
            });

            if(!user || !user.isActive){
                  throw new Error('Invalid refresh token');
            }

            return this.generateTokens(user);
            }catch(error){
                  throw new Error('Invalid or expired refresh tokens');
            }
      }  
}

export const authService = new AuthService();


