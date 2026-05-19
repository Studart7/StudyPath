import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getMaterials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { study_area_id } = req.query;
    const whereClause: any = { user_id };
    if (study_area_id) {
      whereClause.study_area_id = study_area_id as string;
    }
    const materials = await prisma.material.findMany({
      where: whereClause,
      orderBy: { title: 'asc' }
    });
    res.status(200).json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar materiais de apoio' });
  }
};

export const createMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { study_area_id, topic_id, title, type, url, description } = req.body;
    if (!study_area_id || !title || !type) {
      res.status(400).json({ error: 'Área de estudo, título e tipo são obrigatórios' });
      return;
    }
    const newMaterial = await prisma.material.create({
      data: {
        user_id,
        study_area_id,
        topic_id: topic_id || null,
        title,
        type,
        url,
        description
      }
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar material de apoio' });
  }
};

export const updateMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { id } = req.params;
    const { title, type, url, description, topic_id } = req.body;
    
    const updated = await prisma.material.updateMany({
      where: { id, user_id },
      data: {
        title,
        type,
        url,
        description,
        topic_id: topic_id || null
      }
    });
    
    if (updated.count === 0) {
      res.status(404).json({ error: 'Material de apoio não encontrado' });
      return;
    }
    
    const material = await prisma.material.findUnique({ where: { id } });
    res.status(200).json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar material de apoio' });
  }
};

export const deleteMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { id } = req.params;
    
    const deleted = await prisma.material.deleteMany({
      where: { id, user_id }
    });
    
    if (deleted.count === 0) {
      res.status(404).json({ error: 'Material de apoio não encontrado' });
      return;
    }
    
    res.status(200).json({ message: 'Material de apoio excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir material de apoio' });
  }
};
