import { Router } from "express";
import { shareController } from "../controllers/share.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post('/create', authenticateToken, shareController.createShareLink);
router.get('/download/:token', shareController.downloadFile);
router.get('/my-links', authenticateToken, shareController.getMyShareLinks);
router.post('/revoke/:shareId', authenticateToken, shareController.revokeShareLink);


export default router;