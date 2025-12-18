/**
 * Modelo de Mongoose para consultas de inflación
 */

import mongoose from 'mongoose';

const inflationQuerySchema = new mongoose.Schema(
  {
    amount_nominal: {
      type: Number,
      required: true,
      min: 0.01,
    },
    inflation_rate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    years: {
      type: Number,
      required: true,
      min: 0.25,
    },
    granularity: {
      type: String,
      required: true,
      enum: ['none', 'yearly', 'quarterly'],
      default: 'none',
    },
    real_value: {
      type: Number,
      required: true,
    },
    absolute_loss: {
      type: Number,
      required: true,
    },
    loss_percent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    series: {
      type: [{
        t: Number,
        years: Number,
        real_value: Number,
        loss_percent: Number,
      }],
      default: null,
    },
    client_ip: {
      type: String,
      default: null,
    },
    user_agent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
    collection: 'inflation_queries',
  }
);

// Índices para mejorar el rendimiento
inflationQuerySchema.index({ createdAt: -1 });
inflationQuerySchema.index({ amount_nominal: 1 });
inflationQuerySchema.index({ inflation_rate: 1 });
inflationQuerySchema.index({ createdAt: 1, amount_nominal: 1 });

// Método para convertir a JSON sin _id y __v
inflationQuerySchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

const InflationQuery = mongoose.models.InflationQuery || 
  mongoose.model('InflationQuery', inflationQuerySchema);

export default InflationQuery;

