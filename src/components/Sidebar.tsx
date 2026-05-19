import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, ChevronRight, Plus, Folder } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useStudyData } from '../context/StudyDataContext.tsx';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const { areas } = useStudyData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeAreas = areas.filter(a => a.status === 'ativa');

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col h-screen shrink-0 sticky top-0 font-sans transition-colors duration-200">
      {/* Brand Logo */}
      <div className="h-16 border-b border-border flex items-center px-6 bg-surface gap-3 select-none transition-colors duration-200">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-sm">
          <div className="w-4 h-4 border-2 border-bg rotate-45"></div>
        </div>
        <span className="font-bold text-lg tracking-tight text-text">StudyPath</span>
        <span className="px-2 py-0.5 bg-elevated rounded text-[10px] font-bold text-muted uppercase tracking-wider">MVP</span>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8">
        <nav className="space-y-1.5">
          <div className="px-3 mb-3 text-xs font-bold uppercase tracking-widest text-muted">Navegação</div>
          
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive 
                  ? 'bg-elevated text-primary font-semibold' 
                  : 'text-muted hover:text-text hover:bg-elevated/50'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/areas" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive 
                  ? 'bg-elevated text-primary font-semibold' 
                  : 'text-muted hover:text-text hover:bg-elevated/50'
              }`
            }
          >
            <BookOpen size={20} />
            <span>Áreas de Estudo</span>
          </NavLink>
        </nav>

        {/* Quick Access Study Areas */}
        <div className="space-y-1.5">
          <div className="px-3 mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted">
            <span>Minhas Áreas</span>
            <Link to="/areas" className="hover:text-text transition-colors p-1 hover:bg-elevated rounded">
              <Plus size={14} />
            </Link>
          </div>
          
          {activeAreas.length > 0 ? (
            <div className="space-y-1">
              {activeAreas.map(area => (
                <NavLink 
                  key={area.id}
                  to={`/areas/${area.id}`}
                  className={({ isActive }) => 
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                      isActive 
                        ? 'bg-elevated text-primary font-semibold' 
                        : 'text-muted hover:text-text hover:bg-elevated/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Folder size={16} className="shrink-0 opacity-70" />
                    <span className="truncate">{area.name.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '').trim()}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-40" />
                </NavLink>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-sm text-muted italic">Nenhuma área ativa.</div>
          )}
        </div>
      </div>

      {/* User Section / Bottom footer */}
      <div className="p-4 border-t border-border bg-surface flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-soft border border-border flex items-center justify-center text-bg font-bold text-sm shrink-0 shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate text-text">{user?.name}</p>
            <p className="text-xs text-muted truncate leading-none mt-0.5">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          title="Sair"
          className="text-muted hover:text-error p-2 hover:bg-error/10 rounded-lg transition-colors shrink-0"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
