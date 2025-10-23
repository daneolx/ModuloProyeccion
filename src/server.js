/**
 * Servidor principal de la aplicación
 * Configura Express con middlewares de seguridad y rutas
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRoutes from './api/routes.js';
import { errorHandlerMiddleware } from './api/effect.controller.js';

// Configuración para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Configuración de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-dominio.com'] // Reemplazar con dominio real
    : true, // Permitir todos los orígenes en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compresión de respuestas
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 requests por IP por ventana
  message: {
    success: false,
    error: 'Demasiadas solicitudes desde esta IP, intente nuevamente en 15 minutos',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Middleware para parsing de JSON
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        success: false,
        error: 'JSON inválido en el cuerpo de la solicitud',
        timestamp: new Date().toISOString()
      });
      throw new Error('Invalid JSON');
    }
  }
}));

// Middleware para parsing de URL encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true,
  lastModified: true
}));

// Middleware de logging para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rutas de la API
app.use('/api/v1', apiRoutes);

// Ruta raíz - servir la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandlerMiddleware);

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`📊 Módulo de Efecto de la Inflación sobre el Ahorro`);
  console.log(`🌐 Accede a: http://localhost:${PORT}`);
  console.log(`📖 API Info: http://localhost:${PORT}/api/v1/info`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔧 Modo: Desarrollo`);
  } else {
    console.log(`🏭 Modo: Producción`);
  }
});

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Error no capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

export default app;
