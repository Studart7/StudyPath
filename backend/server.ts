import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import areaRoutes from './routes/areaRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import path from 'path';

const app = express();
const PORT = 3000;

// Security: Rate limiting for all requests
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' },
});

// Stricter limiter for auth routes (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas de autenticação. Aguarde 15 minutos.' },
});

app.use(cors({ 
  origin: process.env.VITE_SUPABASE_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(cookieParser());
app.use(globalLimiter);

// Remove fingerprinting headers
app.disable('x-powered-by');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/sessions', sessionRoutes);

// Health check and basic routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Vite integration for full-stack SPA
import { createServer as createViteServer } from 'vite';

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
