/**
 * Módulo de conexión a la base de datos PostgreSQL
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Pool de conexiones PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'inflacion_ahorro',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event listeners para el pool
pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

/**
 * Ejecuta una consulta en la base de datos
 * @param {string} text - Query SQL
 * @param {Array} params - Parámetros de la query
 * @returns {Promise} Resultado de la consulta
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query ejecutada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Error en la query:', { text, error: error.message });
    throw error;
  }
}

/**
 * Obtiene un cliente del pool para transacciones
 * @returns {Promise} Cliente de PostgreSQL
 */
export async function getClient() {
  const client = await pool.connect();
  return client;
}

/**
 * Cierra la conexión al pool
 */
export async function closePool() {
  await pool.end();
  console.log('🔌 Pool de PostgreSQL cerrado');
}

/**
 * Prueba la conexión a la base de datos
 * @returns {Promise<boolean>} True si la conexión es exitosa
 */
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a PostgreSQL:', error.message);
    return false;
  }
}

export default pool;

