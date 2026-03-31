import multer, { MulterError } from 'multer';
import path from 'path';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';


const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, 'uploads/');
      },
      filename:(req, file, cb) => {
            const randomName = crypto.randomBytes(32).toString('hex');
            const extension = path.extname(file.originalname).toLowerCase();
            cb(null, `${randomName}${extension}`);
      }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb:multer.FileFilterCallback) => {
      const allowedMimeTypes = [
            'image/jpeg', 'image/gif', 'image/png', 'image/webp',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/zip'
      ];

      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx', '.zip'];

      const ext = path.extname(file.originalname).toLowerCase();

      if(!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)){
            cb(new Error(`File type not allowed: ${file.mimetype}(${ext})`));
            return ;
      }

      cb(null, true);
};

export const upload = multer({
      storage,
      fileFilter,
      limits:{
            fileSize:env.MAX_FILE_SIZE,
      },
}).single('file');

export const handleUploadErrors = (err:any, request: Request, res: Response, next: NextFunction) =>{
      if(err instanceof multer.MulterError){
            if(err.code === 'LIMIT_FILE_SIZE'){
                  res.status(400).json({success:false, message:`File too large. Max Size is: ${env.MAX_FILE_SIZE}`});
            }else{
                  res.status(400).json({success:false, message:err.message});
            }
      }else if(err){
            res.status(400).json({success:false, message:err.message});
      }else{
            next();
      }
};


