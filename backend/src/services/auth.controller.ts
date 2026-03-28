import { Request, Response } from "express";
import { authService, AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "../config/validation";
import { ApiError } from "../types";
import { error } from "console";
import { env } from "../config/env";

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
}

export const authController =  new AuthController();  