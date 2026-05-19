import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { study_area_id } = req.query;
    const whereClause: any = { user_id };
    if (study_area_id) {
      whereClause.study_area_id = study_area_id as string;
    }
    const sessions = await prisma.studySession.findMany({
      where: whereClause,
      orderBy: { studied_at: 'desc' }
    });
    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar sessões de estudo' });
  }
};

export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { study_area_id, topic_id, duration_minutes, focus_level, perceived_difficulty, notes } = req.body;
    if (!study_area_id || duration_minutes === undefined) {
      res.status(400).json({ error: 'Área de estudo e duração são obrigatórios' });
      return;
    }
    const newSession = await prisma.studySession.create({
      data: {
        user_id,
        study_area_id,
        topic_id: topic_id || null,
        studied_at: new Date(),
        duration_minutes: Number(duration_minutes),
        focus_level: focus_level !== undefined ? Number(focus_level) : null,
        perceived_difficulty: perceived_difficulty !== undefined ? Number(perceived_difficulty) : null,
        notes
      }
    });
    res.status(201).json(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar sessão de estudo' });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { id } = req.params;
    
    const deleted = await prisma.studySession.deleteMany({
      where: { id, user_id }
    });
    
    if (deleted.count === 0) {
      res.status(404).json({ error: 'Sessão de estudo não encontrada' });
      return;
    }
    
    res.status(200).json({ message: 'Sessão de estudo excluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir sessão de estudo' });
  }
};
