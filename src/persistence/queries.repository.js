/**
 * Repositorio para operaciones CRUD de consultas de inflación
 * Migrado a MongoDB usando Mongoose
 */

import InflationQuery from './models/InflationQuery.js';

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

  const inflationQuery = new InflationQuery({
    amount_nominal,
    inflation_rate,
    years,
    granularity,
    real_value,
    absolute_loss,
    loss_percent,
    series,
    client_ip,
    user_agent,
  });

  const savedQuery = await inflationQuery.save();
  return savedQuery.toJSON();
}

/**
 * Obtiene una consulta por ID
 * @param {string} id - ID de la consulta (ObjectId de MongoDB)
 * @returns {Promise<Object|null>} Datos de la consulta o null
 */
export async function getInflationQueryById(id) {
  try {
    const query = await InflationQuery.findById(id);
    return query ? query.toJSON() : null;
  } catch (error) {
    // Si el ID no es válido, retornar null
    if (error.name === 'CastError') {
      return null;
    }
    throw error;
  }
}

/**
 * Obtiene todas las consultas con paginación
 * @param {Object} options - Opciones de paginación
 * @param {number} options.limit - Límite de resultados
 * @param {number} options.offset - Offset para paginación
 * @returns {Promise<Object>} Resultados y total
 */
export async function getAllInflationQueries({ limit = 50, offset = 0 } = {}) {
  const [data, total] = await Promise.all([
    InflationQuery.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean(),
    InflationQuery.countDocuments(),
  ]);

  return {
    data: data.map(item => {
      const { _id, __v, ...rest } = item;
      return { id: _id.toString(), ...rest };
    }),
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
  const stats = await InflationQuery.aggregate([
    {
      $group: {
        _id: null,
        total_queries: { $sum: 1 },
        avg_amount_nominal: { $avg: '$amount_nominal' },
        avg_inflation_rate: { $avg: '$inflation_rate' },
        avg_loss_percent: { $avg: '$loss_percent' },
        first_query: { $min: '$createdAt' },
        last_query: { $max: '$createdAt' },
      },
    },
  ]);

  return stats[0] || {
    total_queries: 0,
    avg_amount_nominal: 0,
    avg_inflation_rate: 0,
    avg_loss_percent: 0,
    first_query: null,
    last_query: null,
  };
}

/**
 * Obtiene consultas por rango de fechas
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {Promise<Array>} Array de consultas
 */
export async function getQueriesByDateRange(startDate, endDate) {
  const queries = await InflationQuery.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .sort({ createdAt: -1 })
    .lean();

  return queries.map(item => {
    const { _id, __v, ...rest } = item;
    return { id: _id.toString(), ...rest };
  });
}

/**
 * Elimina consultas antiguas (más de X días)
 * @param {number} days - Días de antigüedad
 * @returns {Promise<number>} Número de consultas eliminadas
 */
export async function deleteOldQueries(days = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const result = await InflationQuery.deleteMany({
    createdAt: { $lt: cutoffDate },
  });

  return result.deletedCount;
}

/**
 * Obtiene las consultas más recientes
 * @param {number} limit - Número de consultas a obtener
 * @returns {Promise<Array>} Array de consultas
 */
export async function getRecentQueries(limit = 10) {
  const queries = await InflationQuery.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return queries.map(item => {
    const { _id, __v, ...rest } = item;
    return { id: _id.toString(), ...rest };
  });
}

