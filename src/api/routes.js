/**
 * Rutas de la API para el módulo de inflación
 * Define los endpoints REST para el cálculo de efecto de inflación
 */

import express from 'express';
import { 
  calculateInflationEffectController, 
  getApiInfoController, 
  notFoundController 
} from './effect.controller.js';

const router = express.Router();

/**
 * GET /api/v1/info
 * Endpoint de información de la API
 */
router.get('/info', getApiInfoController);

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
 * Manejo de rutas no encontradas para la API
 */
router.use('*', notFoundController);

export default router;
