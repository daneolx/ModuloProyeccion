/**
 * Repositorio para operaciones CRUD de consultas de inflación
 */

import { query } from './db.js';

/**
 * Guarda una nueva consulta de inflación en la base de datos
 * @param {Object} queryData - Datos de la consulta
 * @returns {Promise<Object>} Datos de la consulta guardada
 */
export async function saveInflationQuery(queryData) {
  const {
    amount_nominal,
    inflation_rate,
    years,
    granularity,
    real_value,
    absolute_loss,
    loss_percent,
    series = null,
    client_ip = null,
    user_agent = null,
  } = queryData;

  const sql = `
    INSERT INTO inflation_queries (
      amount_nominal, inflation_rate, years, granularity,
      real_value, absolute_loss, loss_percent, series,
      client_ip, user_agent
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

  const params = [
    amount_nominal,
    inflation_rate,
    years,
    granularity,
    real_value,
    absolute_loss,
    loss_percent,
    series ? JSON.stringify(series) : null,
    client_ip,
    user_agent,
  ];

  const result = await query(sql, params);
  return result.rows[0];
}

/**
 * Obtiene una consulta por ID
 * @param {number} id - ID de la consulta
 * @returns {Promise<Object|null>} Datos de la consulta o null
 */
export async function getInflationQueryById(id) {
  const sql = 'SELECT * FROM inflation_queries WHERE id = $1';
  const result = await query(sql, [id]);
  return result.rows[0] || null;
}

/**
 * Obtiene todas las consultas con paginación
 * @param {Object} options - Opciones de paginación
 * @param {number} options.limit - Límite de resultados
 * @param {number} options.offset - Offset para paginación
 * @returns {Promise<Object>} Resultados y total
 */
export async function getAllInflationQueries({ limit = 50, offset = 0 } = {}) {
  const countSql = 'SELECT COUNT(*) FROM inflation_queries';
  const dataSql = `
    SELECT * FROM inflation_queries
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const [countResult, dataResult] = await Promise.all([
    query(countSql),
    query(dataSql, [limit, offset]),
  ]);

  const total = parseInt(countResult.rows[0].count, 10);

  return {
    data: dataResult.rows,
    total,
    limit,
    offset,
  };
}

/**
 * Obtiene estadísticas de consultas
 * @returns {Promise<Object>} Estadísticas agregadas
 */
export async function getQueryStatistics() {
  const sql = `
    SELECT 
      COUNT(*) as total_queries,
      AVG(amount_nominal) as avg_amount_nominal,
      AVG(inflation_rate) as avg_inflation_rate,
      AVG(loss_percent) as avg_loss_percent,
      MIN(created_at) as first_query,
      MAX(created_at) as last_query
    FROM inflation_queries
  `;

  const result = await query(sql);
  return result.rows[0];
}

/**
 * Obtiene consultas por rango de fechas
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {Promise<Array>} Array de consultas
 */
export async function getQueriesByDateRange(startDate, endDate) {
  const sql = `
    SELECT * FROM inflation_queries
    WHERE created_at BETWEEN $1 AND $2
    ORDER BY created_at DESC
  `;

  const result = await query(sql, [startDate, endDate]);
  return result.rows;
}

/**
 * Elimina consultas antiguas (más de X días)
 * @param {number} days - Días de antigüedad
 * @returns {Promise<number>} Número de consultas eliminadas
 */
export async function deleteOldQueries(days = 90) {
  const sql = `
    DELETE FROM inflation_queries
    WHERE created_at < NOW() - INTERVAL '${days} days'
  `;

  const result = await query(sql);
  return result.rowCount;
}

/**
 * Obtiene las consultas más recientes
 * @param {number} limit - Número de consultas a obtener
 * @returns {Promise<Array>} Array de consultas
 */
export async function getRecentQueries(limit = 10) {
  const sql = `
    SELECT * FROM inflation_queries
    ORDER BY created_at DESC
    LIMIT $1
  `;

  const result = await query(sql, [limit]);
  return result.rows;
}

