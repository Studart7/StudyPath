import { Router } from 'express';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../controllers/materialController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMaterials);
router.post('/', createMaterial);
router.put('/:id', updateMaterial);
router.delete('/:id', deleteMaterial);

export default router;
