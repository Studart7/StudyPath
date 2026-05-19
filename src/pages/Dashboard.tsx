import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useStudyData, Task } from '../context/StudyDataContext.tsx';
import Layout from '../components/Layout.tsx';
import { BookOpen, CheckCircle, Clock, AlertTriangle, Play, Sparkles, Folder, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { areas, tasks, sessions } = useStudyData();

  // --- STATS CALCULATIONS ---
  const totalStudyAreas = areas.length;
  const activeTasks = tasks.filter(t => t.status !== 'concluída');
  const pendingTasksCount = activeTasks.length;
  const completedTasksCount = tasks.filter(t => t.status === 'concluída').length;
  
  // Weekly hours (sessions in the last 7 days)
  const weeklyStudyMinutes = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return sessions
      .filter(s => new Date(s.studied_at) >= sevenDaysAgo)
      .reduce((sum, s) => sum + s.duration_minutes, 0);
  }, [sessions]);

  // Overdue tasks
  const overdueTasksCount = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return activeTasks.filter(t => t.due_date && t.due_date < todayStr).length;
  }, [activeTasks]);

  // Next 4 tasks ordered by due date
  const nextTasks = useMemo(() => {
    return [...activeTasks]
      .filter(t => t.due_date)
      .sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return a.due_date.localeCompare(b.due_date);
      })
      .slice(0, 4);
  }, [activeTasks]);

  // --- PRIORITY SUGGESTER ALGORITHM ---
  const recommendedTaskInfo = useMemo(() => {
    if (activeTasks.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scoredTasks = activeTasks.map(task => {
      let score = 0;
      let reasons: string[] = [];

      // 1. Priority Ponto
      if (task.priority === 'alta') {
        score += 30;
        reasons.push('Prioridade alta (+30)');
      } else if (task.priority === 'média') {
        score += 15;
        reasons.push('Prioridade média (+15)');
      } else {
        score += 5;
        reasons.push('Prioridade baixa (+5)');
      }

      // 2. Difficulty (Facilidade: Baixa dificuldade = mais pontos)
      if (task.difficulty === 'baixa') {
        score += 20;
        reasons.push('Alta facilidade (+20)');
      } else if (task.difficulty === 'média') {
        score += 15;
        reasons.push('Média facilidade (+15)');
      } else {
        score += 10;
        reasons.push('Alta dificuldade (+10)');
      }

      // 3. Status
      if (task.status === 'em andamento') {
        score += 15;
        reasons.push('Já está em andamento (+15)');
      } else {
        score += 10;
        reasons.push('Pendente (+10)');
      }

      // 4. Due Date
      if (task.due_date) {
        const dueDate = new Date(task.due_date + 'T12:00:00'); // avoid timezone shifts
        const timeDiff = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          score += 40;
          reasons.push('Tarefa atrasada (+40)');
        } else if (diffDays === 0) {
          score += 30;
          reasons.push('Vence hoje (+30)');
        } else if (diffDays === 1) {
          score += 20;
          reasons.push('Vence amanhã (+20)');
        } else if (diffDays >= 2 && diffDays <= 3) {
          score += 10;
          reasons.push('Vence em 2 ou 3 dias (+10)');
        } else if (diffDays >= 4 && diffDays <= 7) {
          score += 5;
          reasons.push('Vence em 4 a 7 dias (+5)');
        }
      }

      return {
        task,
        score,
        reason: reasons.join(', ')
      };
    });

    // Sort by score descending
    scoredTasks.sort((a, b) => b.score - a.score);
    return scoredTasks[0];
  }, [activeTasks]);

  const handleStartStudy = (task: Task) => {
    // Navigate to the area workspace
    navigate(`/areas/${task.study_area_id}`);
  };

  return (
    <Layout 
      title="Dashboard" 
      subtitle="Acompanhe suas estatísticas de aprendizado e focos sugeridos."
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <div className="mb-10 bg-gradient-to-r from-primary to-primary-soft rounded-2xl p-8 text-bg shadow-md">
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo(a) ao StudyPath, {user?.name || 'Estudante'}!</h1>
          <p className="text-base text-bg/90 mt-2 max-w-2xl">
            Seu centro de comando para aprendizado contínuo. Acompanhe suas metas, descubra o que estudar agora e não perca prazos.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main area - 7 cols */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* General metrics cards grid */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Métricas Gerais</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 border border-border rounded-xl bg-surface shadow-sm flex flex-col justify-between min-h-[100px] hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-primary font-mono">{totalStudyAreas}</div>
                  <div className="text-[11px] uppercase tracking-wider font-extrabold text-muted">Áreas</div>
                </div>
                
                <div className="p-5 border border-border rounded-xl bg-surface shadow-sm flex flex-col justify-between min-h-[100px] hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-primary font-mono">{pendingTasksCount}</div>
                  <div className="text-[11px] uppercase tracking-wider font-extrabold text-muted flex items-center justify-between">
                    <span>Tarefas Ativas</span>
                    {overdueTasksCount > 0 && (
                      <span className="text-[10px] bg-error/10 text-error px-1.5 py-0.5 rounded font-extrabold flex items-center gap-1 animate-pulse" title="Tarefas Atrasadas">
                        <AlertTriangle size={10} /> {overdueTasksCount}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-5 border border-border rounded-xl bg-surface shadow-sm flex flex-col justify-between min-h-[100px] hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-primary font-mono">{completedTasksCount}</div>
                  <div className="text-[11px] uppercase tracking-wider font-extrabold text-muted">Concluídas</div>
                </div>
                
                <div className="p-5 border border-border rounded-xl bg-surface shadow-sm flex flex-col justify-between min-h-[100px] hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-primary font-mono">{(weeklyStudyMinutes / 60).toFixed(1)}h</div>
                  <div className="text-[11px] uppercase tracking-wider font-extrabold text-muted">Tempo (Semana)</div>
                </div>
              </div>
            </section>

            {/* Next deadlines */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Próximos Prazos</h2>
                <Link to="/areas" className="text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-colors flex items-center gap-1">
                  Ver Áreas de Estudo
                </Link>
              </div>

              <div className="border border-border rounded-2xl p-6 bg-surface shadow-sm space-y-4">
                {nextTasks.length > 0 ? (
                  <div className="divide-y divide-border">
                    {nextTasks.map((task, idx) => {
                      const areaObj = areas.find(a => a.id === task.study_area_id);
                      const isOverdue = task.due_date && new Date(task.due_date) < new Date();
                      
                      return (
                        <div key={task.id} className={`flex items-start justify-between py-4 hover:bg-elevated transition-colors rounded-lg px-2 -mx-2 ${idx === 0 ? 'pt-2' : ''} ${idx === nextTasks.length - 1 ? 'pb-2' : ''}`}>
                          <div className="min-w-0 pr-4">
                            <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary flex items-center gap-1.5">
                              <Folder size={10} />
                              {areaObj?.name || 'Estudos Gerais'}
                            </span>
                            <h3 className="text-sm font-bold text-text truncate mt-1">
                              {task.title}
                            </h3>
                          </div>
                          
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border shrink-0 ${
                            isOverdue 
                              ? 'bg-error/10 text-error border-error/20 animate-pulse shadow-sm' 
                              : 'bg-elevated text-primary border-border'
                          }`}>
                            {isOverdue ? 'Atrasado:' : 'Vence:'} {task.due_date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar size={32} className="mx-auto text-primary-soft mb-3" />
                    <p className="text-sm text-muted font-medium">Nenhuma tarefa com prazo estipulado por enquanto.</p>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Sidebar - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Priority Suggester algorithm */}
            <div className="bg-surface border-2 border-warning/20 rounded-2xl p-6 shadow-lg shadow-warning/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-warning to-warning/80"></div>
              
              <div className="flex items-center justify-between mb-5 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-warning" />
                  <span className="text-xs font-extrabold text-text uppercase tracking-wider">Sugestão de Foco</span>
                </div>
                <div className="px-2.5 py-1 bg-warning/10 border border-warning/20 rounded text-[9px] font-bold text-warning uppercase tracking-widest shadow-sm">
                  Smart Algorithm
                </div>
              </div>

              {recommendedTaskInfo ? (
                <div className="space-y-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-primary flex items-center gap-1.5">
                      <Folder size={10} />
                      {areas.find(a => a.id === recommendedTaskInfo.task.study_area_id)?.name}
                    </span>
                    <h3 className="text-lg font-bold text-text mt-1.5 leading-snug">
                      {recommendedTaskInfo.task.title}
                    </h3>
                    
                    <div className="mt-4 p-4 bg-warning/5 border border-warning/10 rounded-xl space-y-2 relative">
                      <div className="absolute -left-1 top-4 w-2 h-8 bg-warning rounded-r"></div>
                      <div className="text-xs text-warning font-medium leading-relaxed pl-2">
                        <span className="font-bold text-warning block mb-1 uppercase tracking-wide text-[10px]">Por que fazer isso agora?</span>
                        Nossa IA local determinou que esta tarefa tem o <strong>maior nível de urgência</strong> ({recommendedTaskInfo.score} pts) com base em:
                        <span className="font-bold block mt-1.5 text-warning bg-surface p-2 rounded border border-warning/10">{recommendedTaskInfo.reason}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleStartStudy(recommendedTaskInfo.task)}
                    className="w-full py-3.5 bg-warning text-surface hover:opacity-90 text-xs font-bold uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md shadow-warning/20"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>Iniciar Sessão de Estudo</span>
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  {areas.length === 0 ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-elevated rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-text">Tudo Limpo!</h3>
                      <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
                        Você ainda não possui Áreas de Estudo. Uma <strong>Área de Estudo</strong> é um grande objetivo (ex: Aprender React, Inglês).
                      </p>
                      <Link to="/areas" className="inline-block mt-2 px-6 py-2.5 bg-primary text-bg font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm text-sm">
                        Criar Primeira Área
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-muted italic leading-relaxed">
                      Todas as suas tarefas estão concluídas. Crie mais tarefas dentro de suas Áreas de Estudo para receber sugestões.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Explanation box */}
            <div className="p-5 border border-dashed border-border rounded-2xl bg-elevated/50">
              <p className="text-xs text-muted font-medium leading-relaxed text-center">
                O algoritmo StudyPath avalia automaticamente <strong>Prazos, Prioridade, Dificuldade e Andamento</strong> de todas as suas matérias para recomendar a ação mais estratégica e manter você sempre evoluindo de forma eficiente.
              </p>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
