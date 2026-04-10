import { PrismaClient } from "@prisma/client";
import crypto from 'crypto';
import { ShareLinkInput,ShareLinkResponse } from "../types";
import { env } from "../config/env";
import fs from 'fs';
import path from "path";
import { token } from "morgan";
import  argon2  from "argon2";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), '/uploads');

export class ShareService{
      async createShareLink(userId: string, data: ShareLinkInput): Promise<ShareLinkResponse>{

            //Verify the file belongs to the user
            const file = await prisma.file.findUnique({
                  where: {id: data.fileId},
            });

            if(!file || file.userId != userId){
                  throw new Error('File not found or access denied');
            }

            //Deactive all other links
            await prisma.shareLink.updateMany({
                  where:{
                        fileId: data.fileId,
                        isActive:true,
                  },
                  data:{
                        isActive:false,
                  },
            });

            
            const token = crypto.randomBytes(32).toString('hex');
            let passwordHash: string | null = null;

            if(data.password){
                  passwordHash = await argon2.hash(data.password, {
                                    type: argon2.argon2id,
                                    memoryCost: 65536,
                                    timeCost: 3,
                                    parallelism: 4
                              });
            }

            const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

            const shareLink = await prisma.shareLink.create({
                  data:{
                        fileId: data.fileId,
                        token, 
                        passwordHash,
                        expiresAt,
                        maxDownloads: data.maxDownloads || 10,
                  },
            });

            const shareUrl = `${env.NODE_ENV === 'production'
                  ? 'https://yourdomain.com'
                  : 'http://localhost:5000'}/api/share/download/${token}`;

            return {
                  id:shareLink.id,
                  token: shareLink.token,
                  shareUrl,
                  expiresAt: shareLink.expiresAt || undefined,
                  maxDownloads: shareLink.maxDownloads,
                  downloadCount: shareLink.downloadCount,
            };
      }

      async getShareLinkByToken(token: string){
            return prisma.shareLink.findUnique({
                  where:{token},
                  include:{file: true},
            });
      }

      async validateAndDownload(token:string, reqIp?: string):Promise<{file:any; shareLink:any}>{
            const shareLink = await this.getShareLinkByToken(token);

            if(!shareLink){
                  throw new Error('Invalid or expired share link');
            }

            if(shareLink.expiresAt && shareLink.expiresAt < new Date()){
                  throw new Error('Share Link has expired');
            }

            if(shareLink.maxDownloads && shareLink.downloadCount >= shareLink.maxDownloads ){
                  throw new Error('Maximum download limit reached');
            }

            await prisma.shareLink.update({
                  where:{id: shareLink.id},
                  data:{downloadCount: {increment: 1}},
            });

            const filepath = path.join(UPLOAD_DIR, shareLink.file.storedName);


            //Verify file still exists on disk
            if(!fs.existsSync(filepath)){
                  throw new Error('File no longer available');
            }

            return {
                  file:shareLink.file,
                  shareLink,
            };
      }
      async getMyShareLinks(userId: string){
            const shareLink = await prisma.shareLink.findMany({
                  where:{
                        file:{
                              userId:userId
                        },
                        isActive: true,
                  },
                  include:{
                        file:{
                              select:{
                                    id:true,
                                    originalName: true,
                                    mimeType:true,
                                    size:true,
                              },
                        },
                  },
                  orderBy:{
                        createdAt:"desc",
                  },
            });

            return shareLink.map((share) => ({
                  id:share.id,
                  token:share.token,
                  shareUrl: `${env.NODE_ENV === 'production'
                  ? 'https://yourdomain.com'
                  : 'http://localhost:5000'}/api/share/download/${share.token}`,
                  fileName: share.file.originalName,
                  fileSize: Number(share.file.size),
                  expiresAt: share.expiresAt,
                  maxDownloads: share.maxDownloads,
                  downloadCount: share.downloadCount,
                  createdAt: share.createdAt,
                  isExpired: share.expiresAt ? share.expiresAt < new Date() : false,
            }));
      }

      async revokeShareLink(shareId: string, userId: string): Promise<void>{
            const shareLink = await prisma.shareLink.findUnique({
                  where:{id: shareId},
                  include: {file: true},
            });

            if(!shareLink || shareLink.file.userId !== userId){
                  throw new Error('Share link not found or access denied');
            }

            await prisma.shareLink.update({
                  where:{id: shareId},
                  data:{isActive: false},
            });
      }
}

export const shareService = new ShareService();


