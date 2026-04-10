import { Response, Request } from "express";
import { shareService, ShareService } from "../services/share.service";
import { ShareLinkInput } from "../types";
import path from "path";
import fs from 'fs';
import { fileservice } from "../services/file.service";

export class ShareController{
      async createShareLink(req: Request, res: Response){
            try{
                  if(!req.user){
                        res.status(401).json({success:false, message:'Unauthorized'});
                        return;
                  }

                  const {fileId, expiresAt, maxDownloads, password} = req.body;

                  if(!fileId){
                        res.status(400).json({success: false, message:'fileId is required'});
                        return;
                  }

                  const shareData: ShareLinkInput = {
                        fileId, 
                        expiresAt, 
                        maxDownloads: maxDownloads || 10,
                        password
                  };
                  const shareLink = await shareService.createShareLink(req.user.id, shareData);

                  res.status(201).json({
                        success:true,
                        message:'Share Link created successfully',
                        shareLink
                  });
            }catch(error:any){
                  console.log('Failed to create share link:', error);
                  res.status(400).json({
                        success:false,
                        message:error.message || 'Failed to create share link'
                  });
            }
      }

      async downloadFile(req: Request, res: Response){
            
            try{
                  const {token} = req.params;

                  if(!token){
                        res.status(400).json({
                              success:false,
                              message:'Token is required'
                        });
                  }
                  const {file, shareLink} = await shareService.validateAndDownload(token, req.ip);

                  const filepath = path.join(process.cwd(), '/uploads', file.storedName);

                  if(!fs.existsSync(filepath)){
                        res.status(404).json({success:false, message: 'File no longer available'});
                  }

                  res.setHeader('Content-Type', file.mimeType);
                  res.setHeader('Content-Disposition', `attachment; filename ="${file.originalName}" `);
                  res.setHeader('Content-Length', file.size.toString());

                  const fileStream = fs.createReadStream(filepath);

                  fileStream.on('error',(error) => {
                        console.error('File Stream error:', error);
                        if(!res.headersSent){
                              res.status(500).json({
                                    success:false, message:'Error Streaming file'
                              });
                        }
                  } );

                  fileStream.pipe(res);

            }catch(error: any){
                  console.error("Download error: ", error);
                  res.status(400).json({
                        success:false,
                        message:error.message || 'Failed to download file',
                  });
            }
      }
      async getMyShareLinks(req:Request, res: Response){
            try{
                  if(!req.user){
                        res.status(401).json({success:false, message:'Unauthorized'});
                        return;
                  }

                  const shareLinks =  await shareService.getMyShareLinks(req.user.id);


                  res.json({
                        success: true,
                        count:shareLinks.length,
                        shareLinks
                  });
            } catch (error: any) {
                  console.error('Get my share link error:', error);

                  res.status(500).json({ success: false, message: 'Failed to fetch your share links' });
            }
      }
            
      async revokeShareLink(req: Request, res: Response){
            try{
                  if(!req.user){
                        return res.status(401).json({success: false, message: 'Unauthorized'});
                  }

                  const {shareId} = req.params;

                  await shareService.revokeShareLink(shareId, req.user.id);

                  res.json({
                        success: true,
                        message: 'Share link revoked successfully',
                  });
            }catch(err: any){
                  console.error('Failed to revoke share link:', err);
                  res.status(400).json({success:true, message: err.message || 'Failed to revoke share link'});
            }
      }
            

}

export const shareController = new ShareController();
