import { Router } from 'express';
import { getSessions, createSession, deleteSession } from '../controllers/sessionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getSessions);
router.post('/', createSession);
router.delete('/:id', deleteSession);

export default router;
