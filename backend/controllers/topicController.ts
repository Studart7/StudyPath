import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getTopics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { study_area_id } = req.query;
    const whereClause: any = { user_id };
    if (study_area_id) {
      whereClause.study_area_id = study_area_id as string;
    }
    const topics = await prisma.topic.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    });
    res.status(200).json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tópicos' });
  }
};

export const createTopic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { study_area_id, name, description, difficulty } = req.body;
    if (!study_area_id || !name) {
      res.status(400).json({ error: 'Área de estudo e nome são obrigatórios' });
      return;
    }
    const newTopic = await prisma.topic.create({
      data: {
        user_id,
        study_area_id,
        name,
        description,
        difficulty,
        progress: 0,
        status: 'não iniciado'
      }
    });
    res.status(201).json(newTopic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar tópico' });
  }
};

export const updateTopic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { id } = req.params;
    const { name, description, difficulty, progress, status } = req.body;
    
    const updated = await prisma.topic.updateMany({
      where: { id, user_id },
      data: {
        name,
        description,
        difficulty,
        progress: progress !== undefined ? Number(progress) : undefined,
        status
      }
    });
    
    if (updated.count === 0) {
      res.status(404).json({ error: 'Tópico não encontrado' });
      return;
    }
    
    const topic = await prisma.topic.findUnique({ where: { id } });
    res.status(200).json(topic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar tópico' });
  }
};

export const deleteTopic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { id } = req.params;
    
    // Set topic_id to null in dependent entities before deletion
    await Promise.all([
      prisma.task.updateMany({ where: { topic_id: id, user_id }, data: { topic_id: null } }),
      prisma.material.updateMany({ where: { topic_id: id, user_id }, data: { topic_id: null } }),
      prisma.studySession.updateMany({ where: { topic_id: id, user_id }, data: { topic_id: null } })
    ]);
    
    const deleted = await prisma.topic.deleteMany({
      where: { id, user_id }
    });
    
    if (deleted.count === 0) {
      res.status(404).json({ error: 'Tópico não encontrado' });
      return;
    }
    
    res.status(200).json({ message: 'Tópico excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir tópico' });
  }
};
