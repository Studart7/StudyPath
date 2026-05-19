import { Response } from 'express';
import dayjs from 'dayjs';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user_id!;

    const [
      totalStudyAreas,
      allTasks,
      studySessions
    ] = await Promise.all([
      prisma.studyArea.count({ where: { user_id } }),
      prisma.task.findMany({ where: { user_id } }),
      prisma.studySession.findMany({
        where: {
          user_id,
          studied_at: {
            gte: dayjs().subtract(7, 'day').toDate(),
          }
        }
      })
    ]);

    const pendingTasksCount = allTasks.filter(t => t.status === 'pendente' || t.status === 'em andamento').length;
    const completedTasksCount = allTasks.filter(t => t.status === 'concluída').length;
    const overdueTasksCount = allTasks.filter(t => 
      t.due_date && 
      dayjs(t.due_date).isBefore(dayjs(), 'day') && 
      t.status !== 'concluída' && 
      t.status !== 'cancelada'
    ).length;

    const weeklyStudyMinutes = studySessions.reduce((acc, curr) => acc + curr.duration_minutes, 0);

    const nextTasks = allTasks
      .filter(t => t.due_date && t.status !== 'concluída' && t.status !== 'cancelada')
      .sort((a, b) => dayjs(a.due_date).valueOf() - dayjs(b.due_date).valueOf())
      .slice(0, 3);

    // AI/Priority Suggestion Algorithm (RN10)
    const activeTasks = allTasks.filter(t => t.status === 'pendente' || t.status === 'em andamento');
    
    let recommendedTask = null;
    let maxScore = -1;

    for (const task of activeTasks) {
      let score = 0;
      let reasons: string[] = [];

      // Atrasada (Overdue)
      if (task.due_date && dayjs(task.due_date).isBefore(dayjs(), 'day')) {
        score += 5;
        reasons.push("está atrasada");
      } 
      // Urgente (<= 2 dias)
      else if (task.due_date && dayjs(task.due_date).diff(dayjs(), 'day') <= 2) {
        score += 4;
        reasons.push("tem prazo próximo");
      }

      // Prioridade Alta
      if (task.priority === 'alta') {
        score += 3;
        reasons.push("sua prioridade é alta");
      }

      // Dificuldade Alta
      if (task.difficulty === 'alta') {
        score += 2;
        reasons.push("é de alta dificuldade");
      }

      // Em Andamento
      if (task.status === 'em andamento') {
        score += 1;
        reasons.push("já está em andamento");
      }

      // Resolve Tie-breaker (RN10)
      if (score > maxScore || 
         (score === maxScore && recommendedTask && 
          task.due_date && recommendedTask.due_date && 
          dayjs(task.due_date).isBefore(dayjs(recommendedTask.due_date))) ||
         (score === maxScore && recommendedTask && !recommendedTask.due_date && task.due_date) ||
         (score === maxScore && recommendedTask && (!task.due_date && !recommendedTask.due_date) && 
          dayjs(task.created_at).isBefore(dayjs(recommendedTask.created_at)))
      ) {
        maxScore = score;
        
        let reasonStr = "Você deve começar por esta tarefa.";
        if (reasons.length > 0) {
          reasonStr = `Recomendado pois ${reasons.join(", e ")}.`;
        } else if (score === 0) {
          reasonStr = "Sugestão com base nas suas tarefas pendentes.";
        }

        recommendedTask = {
          id: task.id,
          title: task.title,
          reason: reasonStr,
          due_date: task.due_date,
          created_at: task.created_at
        };
      }
    }

    res.status(200).json({
      totalStudyAreas,
      pendingTasks: pendingTasksCount,
      overdueTasks: overdueTasksCount,
      completedTasks: completedTasksCount,
      weeklyStudyMinutes,
      nextTasks: nextTasks.map(t => ({ id: t.id, title: t.title, due_date: t.due_date })),
      recommendedTask: recommendedTask ? {
        id: recommendedTask.id,
        title: recommendedTask.title,
        reason: recommendedTask.reason
      } : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dashboard summary' });
  }
};
