import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getAreas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const areas = await prisma.studyArea.findMany({
      where: { user_id },
      orderBy: { name: 'asc' }
    });
    res.status(200).json(areas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar áreas de estudo' });
  }
};

export const createArea = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { name, description, category, goal } = req.body;
    if (!name) {
      res.status(400).json({ error: 'O nome é obrigatório' });
      return;
    }
    const newArea = await prisma.studyArea.create({
      data: {
        user_id,
        name,
        description,
        category,
        goal,
        status: 'ativa'
      }
    });
    res.status(201).json(newArea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar área de estudo' });
  }
};

export const updateArea = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { id } = req.params;
    const { name, description, category, goal, status } = req.body;
    
    // We updateMany to enforce user_id constraint
    const updatedArea = await prisma.studyArea.updateMany({
      where: { id, user_id },
      data: {
        name,
        description,
        category,
        goal,
        status
      }
    });
    
    if (updatedArea.count === 0) {
      res.status(404).json({ error: 'Área de estudo não encontrada' });
      return;
    }
    
    const area = await prisma.studyArea.findUnique({ where: { id } });
    res.status(200).json(area);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar área de estudo' });
  }
};

export const deleteArea = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { id } = req.params;
    
    // Enforce Rule RN06
    const [topicsCount, tasksCount, sessionsCount] = await Promise.all([
      prisma.topic.count({ where: { study_area_id: id, user_id } }),
      prisma.task.count({ where: { study_area_id: id, user_id } }),
      prisma.studySession.count({ where: { study_area_id: id, user_id } })
    ]);
    
    if (topicsCount > 0 || tasksCount > 0 || sessionsCount > 0) {
      res.status(400).json({ error: 'Não é possível excluir uma área que possui tópicos, tarefas ou sessões associadas.' });
      return;
    }
    
    const deleted = await prisma.studyArea.deleteMany({
      where: { id, user_id }
    });
    
    if (deleted.count === 0) {
      res.status(404).json({ error: 'Área de estudo não encontrada' });
      return;
    }
    
    res.status(200).json({ message: 'Área de estudo excluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir área de estudo' });
  }
};
