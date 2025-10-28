/**
 * Módulo de validación de datos de entrada
 * Utiliza Zod para validación de esquemas
 */

import { z } from 'zod';

/**
 * Esquema de validación para datos de efecto de inflación
 */
const inflationEffectSchema = z.object({
  amount_nominal: z.number().positive().max(999999999, 'El monto no puede exceder 999,999,999'),
  inflation_rate: z.number().min(0).max(100, 'La tasa de inflación debe estar entre 0 y 100'),
  years: z.number().min(0).max(100, 'Los años deben estar entre 0 y 100'),
  granularity: z.enum(['none', 'yearly', 'quarterly']).default('none'),
});

/**
 * Valida los datos de entrada para el cálculo de inflación
 * @param {Object} data - Datos a validar
 * @returns {Object} Datos validados
 * @throws {Error} Si los datos son inválidos
 */
export function validateInflationEffectData(data) {
  try {
    return inflationEffectSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Datos de entrada inválidos: ${messages}`);
    }
    throw error;
  }
}

/**
 * Valida un número financiero
 * @param {number} value - Valor a validar
 * @param {string} fieldName - Nombre del campo
 * @returns {number} Valor validado
 */
export function validateFinancialNumber(value, fieldName) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${fieldName} debe ser un número válido`);
  }
  if (value < 0) {
    throw new Error(`${fieldName} no puede ser negativo`);
  }
  return value;
}

/**
 * Valida un porcentaje
 * @param {number} value - Valor a validar
 * @returns {number} Valor validado
 */
export function validatePercentage(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('El porcentaje debe ser un número válido');
  }
  if (value < 0 || value > 100) {
    throw new Error('El porcentaje debe estar entre 0 y 100');
  }
  return value;
}

/**
 * Valida un monto monetario
 * @param {number} value - Valor a validar
 * @returns {number} Valor validado
 */
export function validateMonetaryAmount(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('El monto debe ser un número válido');
  }
  if (value <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  if (value > 999999999) {
    throw new Error('El monto no puede exceder 999,999,999');
  }
  return value;
}

/**
 * Valida años
 * @param {number} value - Valor a validar
 * @returns {number} Valor validado
 */
export function validateYears(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('Los años deben ser un número válido');
  }
  if (value < 0) {
    throw new Error('Los años no pueden ser negativos');
  }
  if (value > 100) {
    throw new Error('Los años no pueden exceder 100');
  }
  return value;
}

/**
 * Sanitiza datos de formulario (convierte strings a números)
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Datos sanitizados
 */
export function sanitizeFormData(formData) {
  return {
    amount_nominal: parseFloat(formData.amount_nominal),
    inflation_rate: parseFloat(formData.inflation_rate),
    years: parseFloat(formData.years),
    granularity: formData.granularity || 'none',
  };
}