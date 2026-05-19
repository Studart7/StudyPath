import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { study_area_id } = req.query;
    const whereClause: any = { user_id };
    if (study_area_id) {
      whereClause.study_area_id = study_area_id as string;
    }
    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { due_date: 'asc' }
    });
    
    // Format due_date as YYYY-MM-DD string for front-end consumption consistency
    const formattedTasks = tasks.map(task => ({
      ...task,
      due_date: task.due_date ? task.due_date.toISOString().split('T')[0] : null
    }));
    
    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { study_area_id, topic_id, title, description, due_date, priority, difficulty, status } = req.body;
    if (!study_area_id || !title) {
      res.status(400).json({ error: 'Área de estudo e título são obrigatórios' });
      return;
    }
    
    // Enforce Rule RN03
    const completed_at = status === 'concluída' ? new Date() : null;
    
    const newTask = await prisma.task.create({
      data: {
        user_id,
        study_area_id,
        topic_id: topic_id || null,
        title,
        description,
        due_date: due_date ? new Date(due_date + 'T12:00:00') : null,
        priority,
        difficulty,
        status: status || 'pendente',
        completed_at
      }
    });
    
    res.status(201).json({
      ...newTask,
      due_date: newTask.due_date ? newTask.due_date.toISOString().split('T')[0] : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { id } = req.params;
    const { title, description, topic_id, due_date, priority, difficulty, status } = req.body;
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (topic_id !== undefined) updateData.topic_id = topic_id || null;
    if (due_date !== undefined) updateData.due_date = due_date ? new Date(due_date + 'T12:00:00') : null;
    if (priority !== undefined) updateData.priority = priority;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    
    // Enforce Rule RN03 on status updates
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'concluída') {
        updateData.completed_at = new Date();
      } else {
        updateData.completed_at = null;
      }
    }
    
    const updated = await prisma.task.updateMany({
      where: { id, user_id },
      data: updateData
    });
    
    if (updated.count === 0) {
      res.status(404).json({ error: 'Tarefa não encontrada' });
      return;
    }
    
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      res.status(404).json({ error: 'Tarefa não encontrada' });
      return;
    }
    
    res.status(200).json({
      ...task,
      due_date: task.due_date ? task.due_date.toISOString().split('T')[0] : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;
    const { id } = req.params;
    
    const deleted = await prisma.task.deleteMany({
      where: { id, user_id }
    });
    
    if (deleted.count === 0) {
      res.status(404).json({ error: 'Tarefa não encontrada' });
      return;
    }
    
    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
};
