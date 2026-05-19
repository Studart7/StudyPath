import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios.ts';
import { useAuth } from './AuthContext.tsx';

export interface StudyArea {
  id: string;
  name: string;
  description: string;
  category: string;
  goal: string;
  status: 'ativa' | 'pausada' | 'concluída';
  created_at: string;
}

export interface Topic {
  id: string;
  study_area_id: string;
  name: string;
  description: string;
  difficulty: 'baixo' | 'médio' | 'alto';
  progress: number; // 0 - 100
  status: 'não iniciado' | 'em andamento' | 'concluído';
  created_at: string;
}

export interface Task {
  id: string;
  study_area_id: string;
  topic_id?: string;
  title: string;
  description: string;
  due_date?: string; // YYYY-MM-DD
  priority: 'baixa' | 'média' | 'alta';
  difficulty: 'baixa' | 'média' | 'alta';
  status: 'pendente' | 'em andamento' | 'concluída' | 'cancelada';
  completed_at?: string;
  created_at: string;
}

export interface Material {
  id: string;
  study_area_id: string;
  topic_id?: string;
  title: string;
  type: 'link' | 'vídeo' | 'livro' | 'artigo' | 'PDF' | 'anotação' | 'curso' | 'outro';
  url: string;
  description: string;
  created_at: string;
}

export interface StudySession {
  id: string;
  study_area_id: string;
  topic_id?: string;
  studied_at: string; // ISO date string from API
  duration_minutes: number;
  focus_level?: number; // 1-5
  perceived_difficulty?: number; // 1-5
  notes: string;
  created_at: string;
}

interface StudyDataContextType {
  areas: StudyArea[];
  topics: Topic[];
  tasks: Task[];
  materials: Material[];
  sessions: StudySession[];
  loading: boolean;
  
  addArea: (area: Omit<StudyArea, 'id' | 'created_at'>) => Promise<StudyArea>;
  updateArea: (id: string, area: Partial<StudyArea>) => Promise<void>;
  deleteArea: (id: string) => Promise<boolean>;
  
  addTopic: (topic: Omit<Topic, 'id' | 'created_at'>) => Promise<Topic>;
  updateTopic: (id: string, topic: Partial<Topic>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  addMaterial: (material: Omit<Material, 'id' | 'created_at'>) => Promise<Material>;
  updateMaterial: (id: string, material: Partial<Material>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  
  addSession: (session: Omit<StudySession, 'id' | 'created_at' | 'studied_at'>) => Promise<StudySession>;
  deleteSession: (id: string) => Promise<void>;
}

const StudyDataContext = createContext<StudyDataContextType | undefined>(undefined);

export const StudyDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [areas, setAreas] = useState<StudyArea[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [areasRes, topicsRes, tasksRes, materialsRes, sessionsRes] = await Promise.all([
        api.get('/areas'),
        api.get('/topics'),
        api.get('/tasks'),
        api.get('/materials'),
        api.get('/sessions')
      ]);
      setAreas(areasRes.data);
      setTopics(topicsRes.data);
      setTasks(tasksRes.data);
      setMaterials(materialsRes.data);
      setSessions(sessionsRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados do backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setAreas([]);
      setTopics([]);
      setTasks([]);
      setMaterials([]);
      setSessions([]);
      setLoading(false);
    }
  }, [token]);

  // CRUD Areas
  const addArea = async (areaData: Omit<StudyArea, 'id' | 'created_at'>) => {
    try {
      const res = await api.post('/areas', areaData);
      const newArea = res.data;
      setAreas(prev => [...prev, newArea]);
      return newArea;
    } catch (error) {
      console.error('Erro ao adicionar área:', error);
      throw error;
    }
  };

  const updateArea = async (id: string, updatedFields: Partial<StudyArea>) => {
    try {
      const res = await api.put(`/areas/${id}`, updatedFields);
      setAreas(prev => prev.map(area => area.id === id ? res.data : area));
    } catch (error) {
      console.error('Erro ao atualizar área:', error);
      throw error;
    }
  };

  const deleteArea = async (id: string) => {
    try {
      await api.delete(`/areas/${id}`);
      setAreas(prev => prev.filter(area => area.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao excluir área:', error);
      return false;
    }
  };

  // CRUD Topics
  const addTopic = async (topicData: Omit<Topic, 'id' | 'created_at'>) => {
    try {
      const res = await api.post('/topics', topicData);
      const newTopic = res.data;
      setTopics(prev => [...prev, newTopic]);
      return newTopic;
    } catch (error) {
      console.error('Erro ao adicionar tópico:', error);
      throw error;
    }
  };

  const updateTopic = async (id: string, updatedFields: Partial<Topic>) => {
    try {
      const res = await api.put(`/topics/${id}`, updatedFields);
      setTopics(prev => prev.map(topic => topic.id === id ? res.data : topic));
    } catch (error) {
      console.error('Erro ao atualizar tópico:', error);
      throw error;
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      await api.delete(`/topics/${id}`);
      setTopics(prev => prev.filter(topic => topic.id !== id));
      // Sincronizar em memória relações nulas
      setTasks(prev => prev.map(t => t.topic_id === id ? { ...t, topic_id: undefined } : t));
      setMaterials(prev => prev.map(m => m.topic_id === id ? { ...m, topic_id: undefined } : m));
      setSessions(prev => prev.map(s => s.topic_id === id ? { ...s, topic_id: undefined } : s));
    } catch (error) {
      console.error('Erro ao excluir tópico:', error);
      throw error;
    }
  };

  // CRUD Tasks
  const addTask = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    try {
      const res = await api.post('/tasks', taskData);
      const newTask = res.data;
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    try {
      const res = await api.put(`/tasks/${id}`, updatedFields);
      setTasks(prev => prev.map(task => task.id === id ? res.data : task));
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    }
  };

  // CRUD Materials
  const addMaterial = async (materialData: Omit<Material, 'id' | 'created_at'>) => {
    try {
      const res = await api.post('/materials', materialData);
      const newMaterial = res.data;
      setMaterials(prev => [...prev, newMaterial]);
      return newMaterial;
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      throw error;
    }
  };

  const updateMaterial = async (id: string, updatedFields: Partial<Material>) => {
    try {
      const res = await api.put(`/materials/${id}`, updatedFields);
      setMaterials(prev => prev.map(mat => mat.id === id ? res.data : mat));
    } catch (error) {
      console.error('Erro ao atualizar material:', error);
      throw error;
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      await api.delete(`/materials/${id}`);
      setMaterials(prev => prev.filter(mat => mat.id !== id));
    } catch (error) {
      console.error('Erro ao excluir material:', error);
      throw error;
    }
  };

  // CRUD Sessions
  const addSession = async (sessionData: Omit<StudySession, 'id' | 'created_at' | 'studied_at'>) => {
    try {
      const res = await api.post('/sessions', sessionData);
      const newSession = res.data;
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (error) {
      console.error('Erro ao adicionar sessão de estudo:', error);
      throw error;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await api.delete(`/sessions/${id}`);
      setSessions(prev => prev.filter(sess => sess.id !== id));
    } catch (error) {
      console.error('Erro ao excluir sessão de estudo:', error);
      throw error;
    }
  };

  return (
    <StudyDataContext.Provider
      value={{
        areas,
        topics,
        tasks,
        materials,
        sessions,
        loading,
        addArea,
        updateArea,
        deleteArea,
        addTopic,
        updateTopic,
        deleteTopic,
        addTask,
        updateTask,
        deleteTask,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addSession,
        deleteSession
      }}
    >
      {children}
    </StudyDataContext.Provider>
  );
};

export const useStudyData = () => {
  const context = useContext(StudyDataContext);
  if (context === undefined) {
    throw new Error('useStudyData must be used within a StudyDataProvider');
  }
  return context;
};
