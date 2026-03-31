// src/routes/file.routes.ts
import { Router } from 'express';
import { fileController } from '../controllers/file.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { upload, handleUploadErrors } from '../middleware/upload.middleware';

const router = Router();

// Protected routes
router.post(
  '/upload',
  authenticateToken,
  upload,
  handleUploadErrors,
  fileController.upload
);

router.get('/my-files', authenticateToken, fileController.getMyFiles);

export default router;