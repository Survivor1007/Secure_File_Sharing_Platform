// src/controllers/file.controller.ts
import { Request, Response } from 'express';
import { fileservice } from '../services/file.service';
import { authenticateToken } from '../middleware/auth.middleware';

export class FileController {
  async upload(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const fileData = await fileservice.uploadFile(req, req.user.id);

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        file: fileData,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload file',
      });
    }
  }

  async getMyFiles(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }


      const files = await fileservice.getUserFiles(req.user.id);

      res.json({
        success: true,
        files,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch files' });
    }
  }
}

export const fileController = new FileController();