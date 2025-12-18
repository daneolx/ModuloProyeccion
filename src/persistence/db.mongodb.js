/**
 * Módulo de conexión a la base de datos MongoDB usando Mongoose
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'inflacion_ahorro'}`;

// Opciones de conexión
const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Event listeners para la conexión
mongoose.connection.on('connected', () => {
  console.log('✅ Conectado a la base de datos MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error en la conexión a MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Desconectado de MongoDB');
});

/**
 * Conecta a la base de datos MongoDB
 * @returns {Promise<void>}
 */
export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log(`📊 MongoDB conectado: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    throw error;
  }
}

/**
 * Desconecta de la base de datos MongoDB
 * @returns {Promise<void>}
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error al desconectar de MongoDB:', error.message);
    throw error;
  }
}

/**
 * Prueba la conexión a la base de datos
 * @returns {Promise<boolean>} True si la conexión es exitosa
 */
export async function testConnection() {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      console.log('✅ Conexión a MongoDB exitosa');
      return true;
    } else {
      await connectDB();
      return true;
    }
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    return false;
  }
}

/**
 * Obtiene el estado de la conexión
 * @returns {number} Estado de la conexión (0=desconectado, 1=conectado, 2=conectando, 3=desconectando)
 */
export function getConnectionState() {
  return mongoose.connection.readyState;
}

export default mongoose;

