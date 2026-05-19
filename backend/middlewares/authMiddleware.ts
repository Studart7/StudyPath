import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '../config/prisma.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthRequest extends Request {
  user_id?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido ou inválido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    // Ensure user exists in our database
    let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email as string,
          name: user.user_metadata?.name || 'User',
          password_hash: '', // Not used anymore as Supabase handles auth
        }
      });
    }

    req.user_id = dbUser.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Erro ao validar token' });
  }
};
