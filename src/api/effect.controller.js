/**
 * Controlador para el efecto de la inflación sobre el ahorro
 * Orquesta la validación y el cálculo de métricas de inflación
 */

import { calculateInflationEffect } from '../core/calculator.js';
import { validateInflationEffectData } from '../domain/validation.js';
import { 
  saveInflationQuery,
  getAllInflationQueries,
  getQueryStatistics
} from '../persistence/queries.repository.js';

/**
 * Maneja la solicitud POST para calcular el efecto de la inflación
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express
 */
export async function calculateInflationEffectController(req, res) {
  try {
    // Validar datos de entrada
    const validatedData = validateInflationEffectData(req.body);
    
    // Calcular métricas de inflación
    const result = calculateInflationEffect(validatedData);
    
    // Log de la operación (opcional para auditoría)
    console.log(`Cálculo realizado: ${validatedData.amount_nominal} a ${validatedData.inflation_rate}% por ${validatedData.years} años`);
    
    // Guardar en base de datos
    try {
      const clientIp = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent');
      
      await saveInflationQuery({
        ...validatedData,
        ...result,
        client_ip: clientIp,
        user_agent: userAgent,
      });
      
      console.log('✅ Consulta guardada en base de datos');
    } catch (dbError) {
      // Si falla la base de datos, continuamos con la respuesta
      console.error('⚠️ Error al guardar en base de datos:', dbError.message);
    }
    
    // Retornar resultado exitoso
    res.status(200).json({
      success: true,
      data: result,
      message: 'Cálculo realizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error en cálculo de inflación:', error.message);
    
    // Determinar tipo de error y código de estado
    let statusCode = 500;
    let errorMessage = 'Error interno del servidor';
    
    if (error.message.includes('Datos de entrada inválidos')) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.message.includes('debe ser')) {
      statusCode = 400;
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Maneja la solicitud GET para obtener información sobre la API
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express
 */
export function getApiInfoController(req, res) {
  res.status(200).json({
    name: 'Módulo de Efecto de la Inflación sobre el Ahorro',
    version: '1.0.0',
    description: 'API para calcular el efecto de la inflación sobre el poder adquisitivo del ahorro',
    endpoints: {
      'POST /api/v1/inflation/effect': {
        description: 'Calcula el efecto de la inflación sobre un monto de ahorro',
        parameters: {
          amount_nominal: 'number - Monto nominal inicial (requerido)',
          inflation_rate: 'number - Tasa de inflación anual en % (requerido)',
          years: 'number - Número de años (requerido)',
          granularity: 'string - Granularidad: none|yearly|quarterly (opcional)'
        },
        example: {
          amount_nominal: 10000,
          inflation_rate: 6.5,
          years: 3,
          granularity: 'yearly'
        }
      }
    },
    authors: ['Anibal Huaman', 'Karen Medrano', 'David Cantorín', 'Sulmairy Garcia', 'Diego Arrieta'],
    institution: 'Universidad Continental'
  });
}

/**
 * Maneja errores de rutas no encontradas
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express
 */
export function notFoundController(req, res) {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /api/v1/info',
      'POST /api/v1/inflation/effect'
    ]
  });
}

/**
 * Maneja la solicitud GET para obtener el historial de consultas
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express
 */
export async function getHistoryController(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await getAllInflationQueries({ limit, offset });
    
    res.status(200).json({
      success: true,
      data: result.data,
      total: result.total,
      limit: result.limit,
      offset: result.offset
    });
  } catch (error) {
    console.error('Error al obtener historial:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el historial de consultas',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Maneja la solicitud GET para obtener estadísticas
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express
 */
export async function getStatisticsController(req, res) {
  try {
    const stats = await getQueryStatistics();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Middleware para manejo global de errores
 * @param {Error} err - Error object
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express
 * @param {Function} next - Next function de Express
 */
export function errorHandlerMiddleware(err, req, res, next) {
  console.error('Error no manejado:', err);
  
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
