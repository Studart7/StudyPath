import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStudyData, Topic, Task, Material, StudySession } from '../context/StudyDataContext.tsx';
import Layout from '../components/Layout.tsx';
import { 
  Plus, Edit2, Trash2, CheckCircle2, Circle, 
  ExternalLink, FileText, Video, Book, FileSpreadsheet, 
  Clock, AlertCircle, Play, Pause, RotateCcw, 
  Save, Sparkles, ChevronRight, BookOpen, Star, HelpCircle
} from 'lucide-react';

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    areas, topics, tasks, materials, sessions,
    addTopic, updateTopic, deleteTopic,
    addTask, updateTask, deleteTask,
    addMaterial, updateMaterial, deleteMaterial,
    addSession, deleteSession
  } = useStudyData();

  // Find current area
  const area = areas.find(a => a.id === id);
  
  useEffect(() => {
    if (!area) {
      navigate('/areas');
    }
  }, [area, navigate]);

  if (!area) return null;

  // Filtered data for this area
  const areaTopics = topics.filter(t => t.study_area_id === area.id);
  const areaTasks = tasks.filter(t => t.study_area_id === area.id);
  const areaMaterials = materials.filter(m => m.study_area_id === area.id);
  const areaSessions = sessions.filter(s => s.study_area_id === area.id)
    .sort((a, b) => new Date(b.studied_at).getTime() - new Date(a.studied_at).getTime());

  // Active view tab: 'estudo' or 'config'
  const [activeTab, setActiveTab] = useState<'conteudo' | 'sessoes'>('conteudo');

  // --- MODALS STATE ---
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const [sessionModalOpen, setSessionModalOpen] = useState(false);

  // --- TIMER STATE ---
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    setSeconds(0);
  };

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- TOPIC FORM FIELDS ---
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [topicDifficulty, setTopicDifficulty] = useState<'baixo' | 'médio' | 'alto'>('médio');
  const [topicProgress, setTopicProgress] = useState(0);
  const [topicStatus, setTopicStatus] = useState<'não iniciado' | 'em andamento' | 'concluído'>('não iniciado');

  // --- TASK FORM FIELDS ---
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskTopicId, setTaskTopicId] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'baixa' | 'média' | 'alta'>('média');
  const [taskDifficultyField, setTaskDifficultyField] = useState<'baixa' | 'média' | 'alta'>('média');
  const [taskStatus, setTaskStatus] = useState<'pendente' | 'em andamento' | 'concluída'>('pendente');

  // --- MATERIAL FORM FIELDS ---
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<'link' | 'vídeo' | 'livro' | 'artigo' | 'PDF' | 'anotação' | 'curso' | 'outro'>('link');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialTopicId, setMaterialTopicId] = useState('');

  // --- STUDY SESSION FORM FIELDS ---
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionFocus, setSessionFocus] = useState(4);
  const [sessionDifficulty, setSessionDifficulty] = useState(3);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionTopicId, setSessionTopicId] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);

  // --- SUBMIT HANDLERS ---
  
  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    if (editingTopic) {
      updateTopic(editingTopic.id, {
        name: topicName,
        description: topicDescription,
        difficulty: topicDifficulty,
        progress: topicProgress,
        status: topicStatus
      });
    } else {
      addTopic({
        study_area_id: area.id,
        name: topicName,
        description: topicDescription,
        difficulty: topicDifficulty,
        progress: 0,
        status: 'não iniciado'
      });
    }
    setTopicModalOpen(false);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const data = {
      study_area_id: area.id,
      topic_id: taskTopicId || undefined,
      title: taskTitle,
      description: taskDescription,
      due_date: taskDueDate || undefined,
      priority: taskPriority,
      difficulty: taskDifficultyField,
      status: taskStatus
    };

    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setTaskModalOpen(false);
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim()) return;

    const data = {
      study_area_id: area.id,
      topic_id: materialTopicId || undefined,
      title: materialTitle,
      type: materialType,
      url: materialUrl,
      description: materialDescription
    };

    if (editingMaterial) {
      updateMaterial(editingMaterial.id, data);
    } else {
      addMaterial(data);
    }
    setMaterialModalOpen(false);
  };

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionDuration <= 0) return;

    addSession({
      study_area_id: area.id,
      topic_id: sessionTopicId || undefined,
      studied_at: sessionDate,
      duration_minutes: Number(sessionDuration),
      focus_level: sessionFocus,
      perceived_difficulty: sessionDifficulty,
      notes: sessionNotes
    });

    setSessionModalOpen(false);
    resetTimer();
  };

  // --- OPEN MODAL FOR NEW CREATION ---

  const openNewTopic = () => {
    setEditingTopic(null);
    setTopicName('');
    setTopicDescription('');
    setTopicDifficulty('médio');
    setTopicProgress(0);
    setTopicStatus('não iniciado');
    setTopicModalOpen(true);
  };

  const openEditTopic = (t: Topic) => {
    setEditingTopic(t);
    setTopicName(t.name);
    setTopicDescription(t.description);
    setTopicDifficulty(t.difficulty);
    setTopicProgress(t.progress);
    setTopicStatus(t.status);
    setTopicModalOpen(true);
  };

  const openNewTask = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskTopicId('');
    setTaskDueDate('');
    setTaskPriority('média');
    setTaskDifficultyField('média');
    setTaskStatus('pendente');
    setTaskModalOpen(true);
  };

  const openEditTask = (t: Task) => {
    setEditingTask(t);
    setTaskTitle(t.title);
    setTaskDescription(t.description);
    setTaskTopicId(t.topic_id || '');
    setTaskDueDate(t.due_date || '');
    setTaskPriority(t.priority);
    setTaskDifficultyField(t.difficulty);
    setTaskStatus(t.status as any);
    setTaskModalOpen(true);
  };

  const openNewMaterial = () => {
    setEditingMaterial(null);
    setMaterialTitle('');
    setMaterialType('link');
    setMaterialUrl('');
    setMaterialDescription('');
    setMaterialTopicId('');
    setMaterialModalOpen(true);
  };

  const openEditMaterial = (m: Material) => {
    setEditingMaterial(m);
    setMaterialTitle(m.title);
    setMaterialType(m.type);
    setMaterialUrl(m.url);
    setMaterialDescription(m.description);
    setMaterialTopicId(m.topic_id || '');
    setMaterialModalOpen(true);
  };

  const openFinishSession = () => {
    setSessionDuration(Math.ceil(seconds / 60) || 5); // default to elapsed mins or 5 mins
    setSessionFocus(4);
    setSessionDifficulty(3);
    setSessionNotes('');
    setSessionTopicId('');
    setSessionDate(new Date().toISOString().split('T')[0]);
    setSessionModalOpen(true);
  };

  // Helper to render Material Type Icons
  const renderMaterialIcon = (type: Material['type']) => {
    switch (type) {
      case 'link': return <ExternalLink size={14} className="text-blue-500" />;
      case 'vídeo': return <Video size={14} className="text-red-500" />;
      case 'livro': return <Book size={14} className="text-amber-600" />;
      case 'artigo': return <FileText size={14} className="text-emerald-500" />;
      case 'PDF': return <FileSpreadsheet size={14} className="text-rose-500" />;
      case 'curso': return <BookOpen size={14} className="text-indigo-500" />;
      default: return <FileText size={14} className="text-zinc-500" />;
    }
  };

  return (
    <Layout 
      title={area.name} 
      subtitle={`${area.category || 'Sem Categoria'} • ${area.status.toUpperCase()}`}
      actions={
        <div className="flex items-center gap-3">
          <Link 
            to="/areas" 
            className="px-3 py-1.5 border border-[#e5e5e3] hover:border-black rounded-lg text-xs font-semibold text-[#666663] hover:text-black transition-colors"
          >
            Voltar
          </Link>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Navigation tabs */}
        <div className="flex border-b border-[#e5e5e3] mb-8 gap-6">
          <button 
            onClick={() => setActiveTab('conteudo')}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 leading-none relative ${
              activeTab === 'conteudo' 
                ? 'border-black text-black' 
                : 'border-transparent text-[#a1a19e] hover:text-black'
            }`}
          >
            Estudos e Matérias
          </button>
          <button 
            onClick={() => setActiveTab('sessoes')}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 leading-none relative ${
              activeTab === 'sessoes' 
                ? 'border-black text-black' 
                : 'border-transparent text-[#a1a19e] hover:text-black'
            }`}
          >
            Sessões Registradas ({areaSessions.length})
          </button>
        </div>

        {activeTab === 'conteudo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Topics & Tasks - 7 cols */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* TOPICS SECTION */}
              <section className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Tópicos de Estudo</h2>
                    <p className="text-[10px] text-muted mt-0.5">Subdivisões de aprendizagem desta área</p>
                  </div>
                  <button 
                    onClick={openNewTopic}
                    className="flex items-center gap-1 px-2.5 py-1.5 border border-[#e5e5e3] hover:border-black rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"
                  >
                    <Plus size={12} />
                    <span>Adicionar</span>
                  </button>
                </div>

                {areaTopics.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#a1a19e] border border-dashed border-[#e5e5e3] rounded-xl bg-[#fbfbf9] italic">
                    Nenhum tópico adicionado. Crie tópicos para segmentar seu estudo.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {areaTopics.map(topic => (
                      <div key={topic.id} className="border border-[#e5e5e3] rounded-xl p-3.5 hover:border-zinc-400 bg-[#fbfbf9] hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#1a1a1a]">{topic.name}</h3>
                            <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border ${
                              topic.difficulty === 'alto' 
                                ? 'bg-red-50 text-red-600 border-red-100' 
                                : topic.difficulty === 'médio'
                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                : 'bg-green-50 text-green-600 border-green-100'
                            }`}>
                              {topic.difficulty}
                            </span>
                          </div>
                          {topic.description && (
                            <p className="text-xs text-[#666663] line-clamp-1 leading-relaxed">{topic.description}</p>
                          )}
                          
                          {/* Progress bar */}
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 flex-1 bg-[#f0f0ee] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-black rounded-full transition-all duration-300" 
                                style={{ width: `${topic.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-bold text-[#1a1a1a] w-8 text-right">{topic.progress}%</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5 sm:self-center shrink-0 justify-end">
                          <button 
                            onClick={() => openEditTopic(topic)}
                            className="p-1.5 hover:bg-[#f0f0ee] text-[#a1a19e] hover:text-black rounded-lg transition-colors"
                            title="Editar Tópico"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={() => { if(confirm('Tem certeza?')) deleteTopic(topic.id); }}
                            className="p-1.5 hover:bg-red-50 text-[#a1a19e] hover:text-red-600 rounded-lg transition-colors"
                            title="Excluir Tópico"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* TASKS SECTION */}
              <section className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Minhas Tarefas</h2>
                    <p className="text-[10px] text-muted mt-0.5">Metas práticas a cumprir</p>
                  </div>
                  <button 
                    onClick={openNewTask}
                    className="flex items-center gap-1 px-2.5 py-1.5 border border-[#e5e5e3] hover:border-black rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"
                  >
                    <Plus size={12} />
                    <span>Nova Tarefa</span>
                  </button>
                </div>

                {areaTasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#a1a19e] border border-dashed border-[#e5e5e3] rounded-xl bg-[#fbfbf9] italic">
                    Nenhuma tarefa pendente. Crie tarefas para organizar suas metas de estudo.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {areaTasks.map(task => {
                      const topicObj = topics.find(t => t.id === task.topic_id);
                      const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'concluída';
                      
                      return (
                        <div 
                          key={task.id} 
                          className={`group border border-transparent hover:border-[#e5e5e3] bg-transparent hover:bg-[#fbfbf9] rounded-xl p-3 flex items-start transition-all gap-3 ${
                            task.status === 'concluída' ? 'opacity-60' : ''
                          }`}
                        >
                          <button 
                            onClick={() => {
                              updateTask(task.id, { 
                                status: task.status === 'concluída' ? 'pendente' : 'concluída' 
                              });
                            }}
                            className="text-[#a1a19e] hover:text-black mt-0.5 transition-colors shrink-0"
                          >
                            {task.status === 'concluída' ? (
                              <CheckCircle2 size={16} className="text-black" />
                            ) : (
                              <Circle size={16} />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-semibold truncate ${task.status === 'concluída' ? 'line-through text-[#a1a19e]' : 'text-[#1a1a1a]'}`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-xs text-[#666663] mt-0.5 line-clamp-1 leading-relaxed">{task.description}</p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {topicObj && (
                                <span className="text-[9px] bg-zinc-100 text-zinc-600 font-bold px-1.5 py-0.5 rounded">
                                  {topicObj.name}
                                </span>
                              )}
                              <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded border ${
                                task.priority === 'alta' 
                                  ? 'bg-red-50 text-red-600 border-red-100' 
                                  : task.priority === 'média'
                                  ? 'bg-amber-50 text-amber-600 border-amber-100'
                                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                              }`}>
                                Prio: {task.priority}
                              </span>
                              {task.due_date && (
                                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                                  isOverdue 
                                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' 
                                    : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                                }`}>
                                  <Clock size={10} />
                                  <span>{isOverdue ? 'Atrasado:' : 'Prazo:'} {task.due_date}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button 
                              onClick={() => openEditTask(task)}
                              className="p-1 hover:bg-[#f0f0ee] text-[#a1a19e] hover:text-black rounded"
                              title="Editar Tarefa"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button 
                              onClick={() => { if(confirm('Excluir tarefa?')) deleteTask(task.id); }}
                              className="p-1 hover:bg-red-50 text-[#a1a19e] hover:text-red-600 rounded"
                              title="Excluir Tarefa"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

            </div>

            {/* RIGHT COLUMN: Materials & Timer widget - 5 cols */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* TIMER WIDGET (Sessão de Estudos) */}
              <section className="bg-surface border border-border rounded-2xl p-5 shadow-md flex flex-col items-center text-center">
                <span className="text-[9px] uppercase font-bold tracking-widest text-muted mb-1">Cronômetro de Estudo</span>
                <div className="text-3xl font-bold tracking-tight my-2 font-mono tabular-nums">
                  {formatTime(seconds)}
                </div>

                <div className="flex items-center gap-2 mt-2 w-full justify-center">
                  {!timerRunning ? (
                    <button 
                      onClick={startTimer}
                      className="flex items-center justify-center gap-1.5 bg-white text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors w-28"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>Iniciar</span>
                    </button>
                  ) : (
                    <button 
                      onClick={pauseTimer}
                      className="flex items-center justify-center gap-1.5 bg-amber-500 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors w-28"
                    >
                      <Pause size={10} fill="currentColor" />
                      <span>Pausar</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={resetTimer}
                    className="p-2 border border-[#2d2d2a] text-[#a1a19e] hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
                    title="Reiniciar"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>

                {seconds > 10 && (
                  <button 
                    onClick={openFinishSession}
                    className="w-full mt-4 flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-[#2d2d2a] py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Save size={12} />
                    <span>Concluir Sessão</span>
                  </button>
                )}
              </section>

              {/* MATERIALS SECTION */}
              <section className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Materiais de Apoio</h2>
                    <p className="text-[10px] text-muted mt-0.5">Links, vídeos e referências</p>
                  </div>
                  <button 
                    onClick={openNewMaterial}
                    className="p-1.5 border border-[#e5e5e3] hover:border-black rounded-lg transition-colors"
                    title="Adicionar Material"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {areaMaterials.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#a1a19e] border border-dashed border-[#e5e5e3] rounded-xl bg-[#fbfbf9] italic">
                    Nenhum material cadastrado.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    {areaMaterials.map(mat => (
                      <div key={mat.id} className="group p-3 border border-[#e5e5e3] hover:border-zinc-400 rounded-xl bg-[#fbfbf9] hover:bg-white transition-all flex justify-between items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {renderMaterialIcon(mat.type)}
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#a1a19e]">
                              {mat.type}
                            </span>
                          </div>
                          
                          {mat.url ? (
                            <a 
                              href={mat.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs font-bold text-[#1a1a1a] hover:underline flex items-center gap-1 truncate"
                            >
                              <span className="truncate">{mat.title}</span>
                              <ExternalLink size={10} className="shrink-0 opacity-40" />
                            </a>
                          ) : (
                            <div className="text-xs font-bold text-[#1a1a1a] truncate">{mat.title}</div>
                          )}

                          {mat.description && (
                            <p className="text-[10px] text-[#666663] mt-1 leading-relaxed line-clamp-2">{mat.description}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button 
                            onClick={() => openEditMaterial(mat)}
                            className="p-1 hover:bg-[#f0f0ee] text-[#a1a19e] hover:text-black rounded"
                            title="Editar"
                          >
                            <Edit2 size={10} />
                          </button>
                          <button 
                            onClick={() => { if(confirm('Excluir material?')) deleteMaterial(mat.id); }}
                            className="p-1 hover:bg-red-50 text-[#a1a19e] hover:text-red-600 rounded"
                            title="Excluir"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>

          </div>
        )}

        {activeTab === 'sessoes' && (
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-text">Histórico de Sessões</h2>
                <p className="text-xs text-muted mt-0.5">Acompanhe seu histórico de foco e dedicação</p>
              </div>
              <button 
                onClick={() => {
                  setSeconds(0);
                  openFinishSession();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-black text-white hover:bg-zinc-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Plus size={12} />
                <span>Registrar Manual</span>
              </button>
            </div>

            {areaSessions.length === 0 ? (
              <div className="text-center py-12 text-sm text-[#a1a19e] border border-dashed border-[#e5e5e3] rounded-xl bg-[#fbfbf9] italic">
                Nenhuma sessão registrada. Use o cronômetro para marcar seus blocos de estudo.
              </div>
            ) : (
              <div className="space-y-4">
                {areaSessions.map(session => {
                  const topicObj = topics.find(t => t.id === session.topic_id);
                  return (
                    <div key={session.id} className="border border-[#e5e5e3] rounded-xl p-4 bg-[#fbfbf9] hover:bg-white transition-all flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-bold flex items-center gap-1 text-[#1a1a1a]">
                            <Clock size={12} className="opacity-50" />
                            {session.duration_minutes} min de estudo
                          </span>
                          
                          <span className="text-[10px] text-[#a1a19e] font-semibold">{session.studied_at}</span>
                          
                          {topicObj && (
                            <span className="text-[9px] bg-zinc-100 text-zinc-600 font-bold px-1.5 py-0.5 rounded">
                              {topicObj.name}
                            </span>
                          )}
                        </div>

                        {session.notes && (
                          <p className="text-xs text-[#666663] italic bg-white border border-[#e5e5e3]/50 rounded-lg p-2.5 mt-2 leading-relaxed">
                            "{session.notes}"
                          </p>
                        )}
                      </div>

                      {/* Metrics side */}
                      <div className="flex flex-row md:flex-col justify-start md:justify-center md:items-end gap-4 md:gap-1.5 shrink-0 border-t md:border-t-0 border-[#e5e5e3] pt-3 md:pt-0">
                        {session.focus_level && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-[#a1a19e]">Foco:</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={10} 
                                  className={i < (session.focus_level || 0) ? 'text-amber-500 fill-amber-500' : 'text-[#d1d1cf]'} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {session.perceived_difficulty && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-[#a1a19e]">Esforço:</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`w-2 h-2 rounded-full ${
                                    i < (session.perceived_difficulty || 0) 
                                      ? session.perceived_difficulty && session.perceived_difficulty >= 4
                                        ? 'bg-red-500'
                                        : 'bg-black' 
                                      : 'bg-[#d1d1cf]'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <button 
                          onClick={() => { if(confirm('Excluir sessão?')) deleteSession(session.id); }}
                          className="text-[#a1a19e] hover:text-red-600 p-1 rounded hover:bg-red-50 self-end md:self-auto transition-colors mt-1 md:mt-2"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- TOPIC MODAL --- */}
      {topicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-[#e5e5e3] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#e5e5e3] flex justify-between items-center bg-[#f9f9f7]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">
                {editingTopic ? 'Editar Tópico' : 'Novo Tópico'}
              </h2>
              <button 
                onClick={() => setTopicModalOpen(false)}
                className="text-[#a1a19e] hover:text-black text-xs font-bold uppercase tracking-wider"
              >
                Fechar
              </button>
            </div>
            
            <form onSubmit={handleTopicSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Nome do Tópico *</label>
                <input 
                  type="text" 
                  value={topicName} 
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  placeholder="Ex: React Router, Pronúncia, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Descrição</label>
                <textarea 
                  value={topicDescription} 
                  onChange={(e) => setTopicDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors min-h-[60px]"
                  placeholder="O que você estudará neste tópico?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Dificuldade</label>
                  <select 
                    value={topicDifficulty} 
                    onChange={(e) => setTopicDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="baixo">Baixo</option>
                    <option value="médio">Médio</option>
                    <option value="alto">Alto</option>
                  </select>
                </div>
                {editingTopic && (
                  <div>
                    <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Status</label>
                    <select 
                      value={topicStatus} 
                      onChange={(e) => setTopicStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="não iniciado">Não Iniciado</option>
                      <option value="em andamento">Em Andamento</option>
                      <option value="concluído">Concluído</option>
                    </select>
                  </div>
                )}
              </div>

              {editingTopic && (
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Progresso ({topicProgress}%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={topicProgress} 
                    onChange={(e) => setTopicProgress(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#f0f0ee] rounded-lg appearance-none cursor-pointer accent-black mt-2"
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="w-full mt-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors"
              >
                {editingTopic ? 'Salvar Tópico' : 'Criar Tópico'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TASK MODAL --- */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-[#e5e5e3] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#e5e5e3] flex justify-between items-center bg-[#f9f9f7]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">
                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h2>
              <button 
                onClick={() => setTaskModalOpen(false)}
                className="text-[#a1a19e] hover:text-black text-xs font-bold uppercase tracking-wider"
              >
                Fechar
              </button>
            </div>
            
            <form onSubmit={handleTaskSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Título da Tarefa *</label>
                <input 
                  type="text" 
                  value={taskTitle} 
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  placeholder="Ex: Resolver exercícios, Codar modal, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Descrição</label>
                <textarea 
                  value={taskDescription} 
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors min-h-[60px]"
                  placeholder="Breve detalhamento do que precisa ser feito"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Vincular a Tópico</label>
                <select 
                  value={taskTopicId} 
                  onChange={(e) => setTaskTopicId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                >
                  <option value="">Nenhum Tópico (Geral)</option>
                  {areaTopics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Prazo de Entrega</label>
                  <input 
                    type="date" 
                    value={taskDueDate} 
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Prioridade</label>
                  <select 
                    value={taskPriority} 
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Dificuldade</label>
                  <select 
                    value={taskDifficultyField} 
                    onChange={(e) => setTaskDifficultyField(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                {editingTask && (
                  <div>
                    <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Status</label>
                    <select 
                      value={taskStatus} 
                      onChange={(e) => setTaskStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em andamento">Em Andamento</option>
                      <option value="concluída">Concluída</option>
                    </select>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="w-full mt-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors"
              >
                {editingTask ? 'Salvar Tarefa' : 'Criar Tarefa'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MATERIAL MODAL --- */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-[#e5e5e3] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#e5e5e3] flex justify-between items-center bg-[#f9f9f7]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">
                {editingMaterial ? 'Editar Material' : 'Novo Material'}
              </h2>
              <button 
                onClick={() => setMaterialModalOpen(false)}
                className="text-[#a1a19e] hover:text-black text-xs font-bold uppercase tracking-wider"
              >
                Fechar
              </button>
            </div>
            
            <form onSubmit={handleMaterialSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Nome do Material *</label>
                <input 
                  type="text" 
                  value={materialTitle} 
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  placeholder="Ex: Documentação React, Vídeo Aula Zustand"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Tipo de Material</label>
                  <select 
                    value={materialType} 
                    onChange={(e) => setMaterialType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="link">🔗 Link Externo</option>
                    <option value="vídeo">📹 Vídeo</option>
                    <option value="livro">📖 Livro</option>
                    <option value="artigo">📄 Artigo</option>
                    <option value="PDF">📁 PDF / Planilha</option>
                    <option value="anotação">📝 Anotação</option>
                    <option value="curso">🎓 Curso</option>
                    <option value="outro">❓ Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Tópico Associado</label>
                  <select 
                    value={materialTopicId} 
                    onChange={(e) => setMaterialTopicId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="">Nenhum (Geral)</option>
                    {areaTopics.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">URL / Link do Recurso</label>
                <input 
                  type="url" 
                  value={materialUrl} 
                  onChange={(e) => setMaterialUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  placeholder="https://exemplo.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Notas / Comentários</label>
                <textarea 
                  value={materialDescription} 
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors min-h-[60px]"
                  placeholder="O que tem de interessante neste material?"
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors"
              >
                {editingMaterial ? 'Salvar Material' : 'Adicionar Material'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- STUDY SESSION MODAL --- */}
      {sessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-[#e5e5e3] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#e5e5e3] flex justify-between items-center bg-[#f9f9f7]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">
                Salvar Sessão de Estudo
              </h2>
              <button 
                onClick={() => setSessionModalOpen(false)}
                className="text-[#a1a19e] hover:text-black text-xs font-bold uppercase tracking-wider"
              >
                Cancelar
              </button>
            </div>
            
            <form onSubmit={handleSessionSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Duração (minutos) *</label>
                  <input 
                    type="number" 
                    min="1"
                    value={sessionDuration} 
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Data</label>
                  <input 
                    type="date" 
                    value={sessionDate} 
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Tópico Estudado</label>
                <select 
                  value={sessionTopicId} 
                  onChange={(e) => setSessionTopicId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors"
                >
                  <option value="">Geral / Sem Tópico específico</option>
                  {areaTopics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Foco rating 1-5 */}
              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Nível de Foco ({sessionFocus}/5)</label>
                <div className="flex gap-2 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button 
                      type="button"
                      key={i}
                      onClick={() => setSessionFocus(i + 1)}
                      className={`p-1.5 border border-[#e5e5e3] rounded-lg hover:border-black hover:bg-[#fbfbf9] transition-all flex-1 flex justify-center ${
                        sessionFocus === i + 1 ? 'bg-black text-white border-black hover:bg-zinc-800' : 'bg-white text-zinc-400'
                      }`}
                    >
                      <Star size={16} className={sessionFocus === i + 1 ? 'fill-white' : ''} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Dificuldade rating 1-5 */}
              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Dificuldade/Esforço Percebido ({sessionDifficulty}/5)</label>
                <div className="flex gap-2 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button 
                      type="button"
                      key={i}
                      onClick={() => setSessionDifficulty(i + 1)}
                      className={`py-1.5 px-3 border border-[#e5e5e3] rounded-lg hover:border-black transition-all flex-1 text-xs font-bold ${
                        sessionDifficulty === i + 1 ? 'bg-black text-white border-black' : 'bg-white text-zinc-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Notas da Sessão</label>
                <textarea 
                  value={sessionNotes} 
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors min-h-[60px]"
                  placeholder="Resuma o que você aprendeu, dificuldades ou conclusões..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Salvar Sessão
              </button>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
}
