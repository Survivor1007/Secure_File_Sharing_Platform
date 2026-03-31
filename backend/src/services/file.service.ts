import { Prisma, PrismaClient } from "@prisma/client";
import fs from 'fs/promises';
import { FileMetaData } from "../types";
import path from "path";
import crypto from 'crypto';
import { Request } from "express";
import { upload } from "../middleware/upload.middleware";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export class FileService{
      async uploadFile(req: Request, userId: string): Promise<FileMetaData>{
            const file = req.file!;

            const fileBuffer = await  fs.readFile(file.path);
            const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

            const fileRecord = await prisma.file.create({
                  data:{
                        userId,
                        originalName:file.originalname,
                        storedName:file.filename,
                        mimeType:file.mimetype,
                        size:file.size,
                        checksum: checksum,
                  },
            });

            return {
                  id:fileRecord.id,
                  originalName:fileRecord.originalName,
                  storedName:fileRecord.storedName,
                  mimeType:fileRecord.mimeType,
                  size:Number(fileRecord.size),
                  checksum:fileRecord.checksum || undefined,
                  uploadedAt:fileRecord.uploadedAt
            };
      }

      async getUserFiles(userId: string){
            const files = await  prisma.file.findMany({
                  where:{userId, isDeleted:false},
                  orderBy:{uploadedAt:'desc'},
                  select:{
                        id:true,
                        originalName:true,
                        mimeType:true,
                        size:true,
                        uploadedAt:true,
                        checksum:true,
                  },
            });



            return files.map(file => ({
                  id:file.id,
                  originalName:file.originalName,
                  mimeType:file.mimeType,
                  size: Number(file.size),
                  checksum:file.checksum || undefined,
                  uploadedAt:file.uploadedAt,

            }));
      }
}

export const fileservice = new FileService();




