import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { supabase } from '../lib/supabase.ts';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
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
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        
        // Navigation is handled by AuthContext via session change
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        setIsLogin(true);
        setError('Conta criada com sucesso! Verifique seu e-mail para confirmar.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro na autenticação');
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans flex flex-col justify-center items-center px-4 transition-colors duration-200">
      <div className="w-full max-w-sm bg-surface p-8 border border-border rounded-2xl shadow-sm transition-colors duration-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded flex items-center justify-center shadow-sm mb-4">
            <div className="w-6 h-6 border-[3px] border-bg rotate-45"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">StudyPath</h1>
          <p className="text-muted mt-2 text-center text-xs font-medium leading-relaxed">
            {isLogin ? 'Bem-vindo de volta. Organize sua trilha de aprendizado.' : 'Crie sua conta e estruture seus estudos.'}
          </p>
        </div>

        {error && (
          <div className={`p-3 rounded border text-[10px] uppercase font-bold tracking-widest text-center mb-6 ${error.includes('sucesso') ? 'bg-elevated border-border text-text' : 'bg-error/10 border-error/20 text-error'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Nome</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-muted/50 text-text"
                placeholder="Seu nome"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">E-mail</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-muted/50 text-text"
              placeholder="você@email.com"
            />
          </div>
          <div>
             <div className="flex items-center justify-between mb-1.5">
               <label className="block text-[10px] font-bold text-muted uppercase tracking-widest">Senha</label>
               {isLogin && <a href="#" className="text-[10px] font-bold text-muted hover:text-text transition-colors">Esqueceu?</a>}
             </div>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-muted/50 text-text"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-6 py-2.5 bg-primary text-bg text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
          >
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => { setIsLogin(!isLogin); setError(''); setEmail(''); setPassword(''); setName(''); }} 
          className="text-[10px] font-bold text-muted uppercase tracking-widest hover:text-text transition-colors"
        >
          {isLogin ? 'Não tem uma conta? Crie aqui' : 'Já tem uma conta? Entre aqui'}
        </button>
      </div>
    </div>
  );
}
