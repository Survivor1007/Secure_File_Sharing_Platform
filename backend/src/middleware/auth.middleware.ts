import { Response, Request, NextFunction } from "express";
import {z} from 'zod';
import { JwtService } from "../utils/jwt.utils";
import { UserPayload } from "../types";



declare global{
      namespace Express{
            interface Request{
                  user? : UserPayload;
            }
      }
}

export const  authenticateToken = (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if(!token){
            res.status(401).json({success:false, message:'Access token required'});
            return;
      }

      try{
            const payload = JwtService.verifyAccessToken(token);
            req.user = payload;
            next();
      }catch(error: any){
            if(error instanceof z.ZodError){
                  res.status(403).json({status: false, message:'Invalid token paylaod'});
            }else{
                  res.status(403).json({status: false, message:'Invalid or expired access token'});
            }
            
      }

};