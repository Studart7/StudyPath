import React, { useState } from 'react';
import { useStudyData, StudyArea } from '../context/StudyDataContext.tsx';
import Layout from '../components/Layout.tsx';
import { Plus, Folder, Calendar, BookOpen, Clock, Trash2, Edit2, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudyAreas() {
  const { areas, topics, tasks, sessions, addArea, updateArea, deleteArea } = useStudyData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<StudyArea | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState<'ativa' | 'pausada' | 'concluída'>('ativa');

  const openAddModal = () => {
    setEditingArea(null);
    setName('');
    setDescription('');
    setCategory('');
    setGoal('');
    setStatus('ativa');
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (area: StudyArea) => {
    setEditingArea(area);
    setName(area.name);
    setDescription(area.description);
    setCategory(area.category);
    setGoal(area.goal);
    setStatus(area.status);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('O nome da área é obrigatório.');
      return;
    }

    if (editingArea) {
      updateArea(editingArea.id, {
        name,
        description,
        category,
        goal,
        status
      });
    } else {
      addArea({
        name,
        description,
        category,
        goal,
        status
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Check rule RN06
    const hasTopics = topics.some(t => t.study_area_id === id);
    const hasTasks = tasks.some(t => t.study_area_id === id);
    const hasSessions = sessions.some(s => s.study_area_id === id);

    if (hasTopics || hasTasks || hasSessions) {
      alert('Não é permitido excluir uma área de estudo com tópicos, tarefas ou sessões vinculados. Remova os itens associados primeiro.');
      return;
    }

    if (confirm('Tem certeza que deseja excluir esta área de estudo?')) {
      deleteArea(id);
    }
  };

  return (
    <Layout 
      title="Áreas de Estudo" 
      subtitle="Organize seus tópicos e matérias em macro-objetivos."
      actions={
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus size={14} />
          <span>Nova Área</span>
        </button>
      }
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {areas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#e5e5e3] rounded-2xl bg-[#fbfbf9]">
            <Folder size={48} className="text-[#a1a19e] mb-4 opacity-50" />
            <h3 className="text-lg font-bold">Nenhuma área de estudo</h3>
            <p className="text-sm text-[#a1a19e] mt-1 max-w-sm">Adicione uma área de estudo (como Programação, Idiomas, Música) para começar a cadastrar tópicos e tarefas.</p>
            <button 
              onClick={openAddModal}
              className="mt-6 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Criar Primeira Área
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map(area => {
              const areaTopics = topics.filter(t => t.study_area_id === area.id);
              const areaTasks = tasks.filter(t => t.study_area_id === area.id);
              const pendingTasks = areaTasks.filter(t => t.status === 'pendente' || t.status === 'em andamento').length;
              const completedTasks = areaTasks.filter(t => t.status === 'concluída').length;
              const areaSessions = sessions.filter(s => s.study_area_id === area.id);
              const totalHours = areaSessions.reduce((acc, s) => acc + s.duration_minutes, 0) / 60;

              return (
                <Link 
                  key={area.id} 
                  to={`/areas/${area.id}`}
                  className="group relative border border-[#e5e5e3] rounded-2xl bg-[#fbfbf9] p-5 flex flex-col justify-between hover:border-black hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Header Card */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        {area.category && (
                          <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#a1a19e] bg-[#f0f0ee] px-2 py-0.5 rounded-full">
                            {area.category}
                          </span>
                        )}
                        <h2 className="text-lg font-bold tracking-tight mt-1 text-[#1a1a1a] group-hover:text-black transition-colors">
                          {area.name}
                        </h2>
                      </div>
                      
                      <div className="flex gap-1 shrink-0">
                        <button 
                          onClick={(e) => { e.preventDefault(); openEditModal(area); }}
                          className="p-1.5 hover:bg-[#f0f0ee] text-[#a1a19e] hover:text-black rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(area.id, e)}
                          className="p-1.5 hover:bg-red-50 text-[#a1a19e] hover:text-red-600 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Desc */}
                    <p className="text-xs text-[#666663] line-clamp-2 leading-relaxed">
                      {area.description || 'Sem descrição.'}
                    </p>

                    {/* Goals widget */}
                    {area.goal && (
                      <div className="text-[10px] bg-amber-50/50 border border-amber-100 rounded-lg p-2 flex gap-1.5 items-start text-amber-800 font-medium">
                        <Sparkles size={12} className="shrink-0 mt-0.5 text-amber-500" />
                        <span className="line-clamp-2 leading-tight">Meta: {area.goal}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Card stats */}
                  <div className="border-t border-[#e5e5e3] pt-4 mt-6 grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xs font-bold text-black flex items-center justify-center gap-1">
                        <BookOpen size={10} className="opacity-50" />
                        {areaTopics.length}
                      </div>
                      <div className="text-[8px] uppercase tracking-wider font-bold text-[#a1a19e] mt-0.5">Tópicos</div>
                    </div>
                    <div className="text-center border-x border-[#e5e5e3]">
                      <div className="text-xs font-bold text-black">
                        {completedTasks}/{areaTasks.length}
                      </div>
                      <div className="text-[8px] uppercase tracking-wider font-bold text-[#a1a19e] mt-0.5">Tarefas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-black flex items-center justify-center gap-1">
                        <Clock size={10} className="opacity-50" />
                        {totalHours.toFixed(1)}h
                      </div>
                      <div className="text-[8px] uppercase tracking-wider font-bold text-[#a1a19e] mt-0.5">Tempo</div>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className={`absolute top-0 right-12 translate-y-[-50%] px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border shadow-sm ${
                    area.status === 'ativa' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : area.status === 'pausada'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                  }`}>
                    {area.status}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal - Add / Edit Area */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-bg">
              <h2 className="text-sm font-bold uppercase tracking-widest text-text">
                {editingArea ? 'Editar Área' : 'Nova Área de Estudo'}
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-muted hover:text-text text-xs font-bold uppercase tracking-wider"
              >
                Fechar
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[10px] uppercase font-bold tracking-widest rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Nome *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-colors text-text"
                  placeholder="Ex: Programação, Violão, Idiomas"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Categoria</label>
                <input 
                  type="text" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-colors text-text"
                  placeholder="Ex: Tecnologia, Artes, Línguas"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Descrição</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-colors min-h-[60px] text-text"
                  placeholder="Do que se trata esta área?"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Meta principal / Objetivo</label>
                <input 
                  type="text" 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-colors text-text"
                  placeholder="Ex: Passar na certificação, Ser fluente"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-colors text-text"
                >
                  <option value="ativa">Ativa</option>
                  <option value="pausada">Pausada</option>
                  <option value="concluída">Concluída</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full mt-6 py-2.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-opacity-90 transition-colors"
              >
                {editingArea ? 'Salvar Alterações' : 'Criar Área'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
