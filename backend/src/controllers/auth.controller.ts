import { Request, Response } from "express";
import { authService, AuthService } from "../services/auth.service";
import { loginSchema, registerSchema } from "../config/validation";
import { env } from "../config/env";
import { error } from "console";
import { auditLog } from "../utils/logger";

export class AuthController{
      async register(req:Request, res:Response){
            try{
                  const validatedData = registerSchema.parse(req.body);
                  const user = await authService.register(validatedData);


                  res.status(201).json({
                        success:true,
                        messge:'Registered successfully',
                        user:{
                              id:user.id,
                              email:user.email,
                              name:user.name,
                        },
                  });
            }catch(error:any){
                  if (error.name === 'ZodError') {
                        res.status(400).json({ success: false, errors: error.errors });
                  } else {
                        res.status(400).json({ success: false, message: error.message });
                  }
            }
      }

      async login(req:Request, res:Response){
            try{
                  const validatedData = loginSchema.parse(req.body);
                  const {accessToken, refreshToken} = await authService.login(validatedData);

                  res.cookie('refreshToken', refreshToken, {
                        httpOnly:true,
                        secure: env.NODE_ENV === 'production',
                        sameSite:'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                  });

                  return res.json({
                        success:true,
                        accessToken,
                        message:'Login Successful',
                  });
            }catch(error: any){
                  res.status(401).json({success:false, message:error.message})
            }
      }

      async logout(req: Request, res: Response){
            res.clearCookie('refreshToken',{
                  httpOnly:true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite:'strict',
            });

            res.json({success: true, message:'Logged out successfully'});
      }

      async refresh(req: Request, res: Response){
            try{
                  const refreshToken = req.cookies.refreshToken;

                  if(!refreshToken){
                        res.status(401).json({
                              success:false,
                              message:'Refresh Token Missing'
                        });
                        return;
                  }

                  const tokens = await authService.refreshToken(refreshToken);

                  res.cookie('refreshToken', tokens.refreshToken,({
                        httpOnly:true,
                        secure:process.env.NODE_ENV === 'production',
                        sameSite:'strict',
                        maxAge:7 * 24 * 60 * 60 * 1000,
                  }));

                  res.json({
                        success:true,
                        accessToken: tokens.accessToken,
                  });
            }catch(error: any){
                  res.status(401).json({success:false, message:'Refresh token invalid'});
            }
      }

      async changePassword(req: Request, res: Response){
            try{
                  if(!req.user){
                        res.status(401).json({
                              success: false,
                              message: 'Unauthorized',
                        });
                        return;
                  }

                  const {currentPassword, newPassword} = req.body;
                  if(!currentPassword || !newPassword){
                        res.status(401).json({
                              success:false,
                              message: 'Both current and new password are required',
                        });
                        return;
                  }

                  await authService.changePassword(req.user.id, {currentPassword, newPassword});

                  await auditLog('PASSWORD_CHANGE', req.user.id, { ip: req.ip });
                  
                  res.status(200).json({
                        success:true,
                        message: 'Password changes successfully',
                  });
            }catch(error : any){
                  res.status(400).json({success: false, message:error.message});
            }
      }

      async getCurrentUser(req: Request, res: Response){
            try{
                  if(!req.user){
                  return res.status(401).json({success: false, message:'Unauthorized'});
                  }

                  const userData = await authService.getCurrentUser(req.user.id);

                  res.json({
                        success:true,
                        user: userData,
                  });
            }catch(error: any){
                  res.status(400).json({
                        success: false,
                        message:error.message || 'Failed to fetch user profile'
                  });
            }
      
      }
}

export const authController =  new AuthController();  