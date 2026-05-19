import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

/**
 * GET /api/auth/me
 * Returns the current user's profile from our database.
 * The authMiddleware already ensures the user exists in our DB.
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user_id },
      select: { id: true, name: true, email: true, created_at: true },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};
