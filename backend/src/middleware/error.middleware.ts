import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export const errorHandler = (
      err: any,
      req: Request, 
      res: Response, 
      next: NextFunction,
) => {
      console.error('🔴 Error:',{
            message:err.message,
            stack:process.env.NODE_ENV === 'development'? err.stack : undefined,
            path: req.path,
            method: req.method
      });

      //Prisma error
      if(err instanceof Prisma.PrismaClientKnownRequestError){
            return res.status(400).json({
                  success:false,
                  message:'Database operation failed',
            });
      }

      //Zod validation error
      if(err.name === 'ZodError' ){
            return res.status(400).json({
                  sucess:false,
                  message: 'Validation error',
                  errors: err.errors,
            });
      }

      //Multer error
      if(err.name === 'MulterError'){
            res.status(400).json({
                  success:false,
                  message: err.message || 'File upload error',
            });
      }

      //Default error
      const statusCode = err.statusCode || 500;
      const message = process.env.NODE_ENV === 'production'?
      'Internal Server Error' : err.message || 'Something went wrong';

      res.status(statusCode).json({
            success:false,
            message,
            ...(process.env.NODE_ENV === 'development' && {stack :err.stack}),
      });
};

