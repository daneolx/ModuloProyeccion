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
  notFoundController,
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
 */
router.post('/inflation/effect', calculateInflationEffectController);

/**
 * GET /api/v1/inflation/history
 * Endpoint para obtener el historial de consultas
 */
router.get('/inflation/history', getHistoryController);

/**
 * GET /api/v1/inflation/statistics
 * Endpoint para obtener estadísticas de consultas
 */
router.get('/inflation/statistics', getStatisticsController);

/**
 * Manejo de rutas no encontradas para la API
 */
router.use('*', notFoundController);

export default router;