import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../lib/axios.ts';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        login(res.data.token, res.data.user);
        navigate('/');
      } else {
        await api.post('/auth/register', { name, email, password });
        setIsLogin(true);
        setError('Conta criada com sucesso! Faça login.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro na autenticação');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfc] text-[#1a1a1a] font-sans flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm bg-[#fbfbf9] p-8 border border-[#e5e5e3] rounded-2xl shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-black rounded flex items-center justify-center mb-4">
            <div className="w-5 h-5 border-2 border-white rotate-45"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">StudyPath</h1>
          <p className="text-[#a1a19e] mt-2 text-center text-xs font-medium leading-relaxed">
            {isLogin ? 'Welcome back. Organize your learning path.' : 'Create your account to structure your studies.'}
          </p>
        </div>

        {error && (
          <div className={`p-3 rounded border text-[10px] uppercase font-bold tracking-widest text-center mb-6 ${error.includes('sucesso') ? 'bg-[#f0f0ee] border-[#e5e5e3] text-black' : 'bg-red-50 border-red-200 text-red-600'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">Nome</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder:text-[#d1d1cf]"
                placeholder="Seu nome"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest mb-1.5">E-mail</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder:text-[#d1d1cf]"
              placeholder="você@email.com"
            />
          </div>
          <div>
             <div className="flex items-center justify-between mb-1.5">
               <label className="block text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest">Senha</label>
               {isLogin && <a href="#" className="text-[10px] font-bold text-[#a1a19e] hover:text-black transition-colors">Esqueceu?</a>}
             </div>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e5e5e3] rounded-lg text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder:text-[#d1d1cf]"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => { setIsLogin(!isLogin); setError(''); setEmail(''); setPassword(''); setName(''); }} 
          className="text-[10px] font-bold text-[#a1a19e] uppercase tracking-widest hover:text-black transition-colors"
        >
          {isLogin ? 'Não tem uma conta? Crie aqui' : 'Já tem uma conta? Entre aqui'}
        </button>
      </div>
    </div>
  );
}
