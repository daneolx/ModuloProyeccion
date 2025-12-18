/**
 * Rutas de la API para el módulo de inflación
 * Define los endpoints REST para el cálculo de efecto de inflación
 */

import express from 'express';
import { 
  calculateInflationEffectController, 
  getApiInfoController,
  getHistoryController,
  getStatisticsController,
  getSBSRatesController,
  notFoundController 
} from './effect.controller.js';

const router = express.Router();

/**
 * GET /api/v1/info
 * Endpoint de información de la API
 */
router.get('/info', getApiInfoController);

/**
 * GET /api/v1/sbs/rates
 * Endpoint para obtener información de tasas SBS
 * Retorna tipos de cuenta, entidades financieras y tasas TREA
 */
router.get('/sbs/rates', getSBSRatesController);

/**
 * POST /api/v1/inflation/effect
 * Endpoint principal para calcular el efecto de la inflación
 * 
 * Body esperado:
 * {
 *   "amount_nominal": 10000.0,
 *   "inflation_rate": 6.5,
 *   "years": 3,
 *   "granularity": "yearly" // opcional
 * }
 * 
 * Respuesta exitosa (200):
 * {
 *   "success": true,
 *   "data": {
 *     "amount_nominal": 10000.0,
 *     "inflation_rate": 6.5,
 *     "years": 3,
 *     "real_value": 8256.11,
 *     "absolute_loss": 1743.89,
 *     "loss_percent": 17.44,
 *     "series": [...] // si granularity != "none"
 *   },
 *   "message": "Cálculo realizado exitosamente"
 * }
 * 
 * Respuesta de error (400):
 * {
 *   "success": false,
 *   "error": "Datos de entrada inválidos: ...",
 *   "timestamp": "2025-01-XX..."
 * }
 */
router.post('/inflation/effect', calculateInflationEffectController);

/**
 * GET /api/v1/inflation/history
 * Endpoint para obtener el historial de consultas
 * 
 * Query params:
 * - limit: número de resultados (default: 50)
 * - offset: offset para paginación (default: 0)
 * 
 * Respuesta exitosa (200):
 * {
 *   "success": true,
 *   "data": [...],
 *   "total": 150,
 *   "limit": 50,
 *   "offset": 0
 * }
 */
router.get('/inflation/history', getHistoryController);

/**
 * GET /api/v1/inflation/statistics
 * Endpoint para obtener estadísticas de consultas
 * 
 * Respuesta exitosa (200):
 * {
 *   "success": true,
 *   "data": {
 *     "total_queries": 150,
 *     "avg_amount_nominal": 12500,
 *     "avg_inflation_rate": 6.5,
 *     ...
 *   }
 * }
 */
router.get('/inflation/statistics', getStatisticsController);

/**
 * Manejo de rutas no encontradas para la API
 */
router.use('*', notFoundController);

export default router;
