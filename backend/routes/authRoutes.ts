import { Router } from 'express';
import { getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Get current authenticated user (syncs with our DB via middleware)
router.get('/me', authMiddleware, getMe);

export default router;
