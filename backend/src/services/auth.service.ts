import {  PrismaClient, User } from "@prisma/client";
import argon2 from "argon2";

import { RegisterInput,LoginInput, UserPayload, AuthTokens, ChangeInputPassword  } from "../types/index";
import { JwtService } from "../utils/jwt.utils";



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
            return {
                  accessToken: JwtService.generateAccessToken(payload),
                  refreshToken: JwtService.generateRefreshToken(payload)
            };
      }

      async refreshToken(refreshToken: string):Promise<AuthTokens>{
            try{
            const payload = JwtService.verifyRefreshToken(refreshToken);

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
      
      async changePassword(userId: string, data:ChangeInputPassword): Promise<void>{
            const user = await prisma.user.findUnique({
                  where:{id : userId},
            });

            if(!user){
                  throw new Error('User not found');
            }

            // Verify current password
            const isValid = await argon2.verify(user.passwordHash, data.currentPassword);
            if(!isValid){
                  throw new Error('Current Password is not correct');
            }

            const newPasswordHash = await argon2.hash(data.newPassword, {
                  type: argon2.argon2id,
                  memoryCost: 65536,
                  timeCost: 3,
                  parallelism: 4,
            });

            await prisma.user.update({
                  where: {id : userId},
                  data: {passwordHash: newPasswordHash},
            });
      }

      async getCurrentUser(userId: string){
            const user = await prisma.user.findUnique({
                  where:{id:userId},
                  select:{
                        id:true,
                        email:true,
                        name:true,
                        createdAt:true,
                  },
            });

            if(!user){
                  throw new Error('User not found');
            }
            return user;
      }
}

export const authService = new AuthService();


