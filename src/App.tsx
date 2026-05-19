import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { StudyDataProvider, useStudyData } from './context/StudyDataContext.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Workspace from './pages/Workspace.tsx';
import StudyAreas from './pages/StudyAreas.tsx';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppLoader = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useStudyData();
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated && loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <div className="w-10 h-10 border-4 border-primary-soft border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-text font-medium font-sans animate-pulse">Sincronizando seus estudos...</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudyDataProvider>
          <AppLoader>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/areas" element={<PrivateRoute><StudyAreas /></PrivateRoute>} />
              <Route path="/areas/:id" element={<PrivateRoute><Workspace /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AppLoader>
        </StudyDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

