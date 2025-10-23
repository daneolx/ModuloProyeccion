/**
 * Módulo de validación de dominio usando Zod
 * Valida los datos de entrada para el cálculo de inflación
 */

import { z } from 'zod';

/**
 * Schema de validación para el cálculo de efecto de inflación
 */
export const inflationEffectSchema = z.object({
  amount_nominal: z
    .number()
    .positive('El monto nominal debe ser mayor a cero')
    .max(999999999, 'El monto nominal no puede exceder 999,999,999')
    .refine(val => Number.isFinite(val), 'El monto nominal debe ser un número válido'),
  
  inflation_rate: z
    .number()
    .min(0, 'La tasa de inflación no puede ser negativa')
    .max(100, 'La tasa de inflación no puede exceder 100%')
    .refine(val => Number.isFinite(val), 'La tasa de inflación debe ser un número válido'),
  
  years: z
    .number()
    .min(0, 'El número de años no puede ser negativo')
    .max(100, 'El número de años no puede exceder 100')
    .refine(val => Number.isFinite(val), 'El número de años debe ser un número válido'),
  
  granularity: z
    .enum(['none', 'yearly', 'quarterly'], {
      errorMap: () => ({ message: 'La granularidad debe ser: none, yearly o quarterly' })
    })
    .optional()
    .default('none')
});

/**
 * Valida los datos de entrada para el cálculo de inflación
 * @param {Object} data - Datos a validar
 * @returns {Object} Datos validados
 * @throws {Error} Error de validación con detalles
 */
export function validateInflationEffectData(data) {
  try {
    return inflationEffectSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      throw new Error(`Datos de entrada inválidos: ${errorMessages.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

/**
 * Valida que un número sea válido para cálculos financieros
 * @param {any} value - Valor a validar
 * @param {string} fieldName - Nombre del campo para mensajes de error
 * @returns {number} Número validado
 */
export function validateFinancialNumber(value, fieldName) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${fieldName} debe ser un número válido`);
  }
  
  if (value < 0) {
    throw new Error(`${fieldName} no puede ser negativo`);
  }
  
  return value;
}

/**
 * Valida que un porcentaje esté en el rango válido
 * @param {number} percentage - Porcentaje a validar
 * @returns {number} Porcentaje validado
 */
export function validatePercentage(percentage) {
  validateFinancialNumber(percentage, 'El porcentaje');
  
  if (percentage > 100) {
    throw new Error('El porcentaje no puede exceder 100%');
  }
  
  return percentage;
}

/**
 * Valida que un monto monetario sea válido
 * @param {number} amount - Monto a validar
 * @returns {number} Monto validado
 */
export function validateMonetaryAmount(amount) {
  validateFinancialNumber(amount, 'El monto');
  
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a cero');
  }
  
  if (amount > 999999999) {
    throw new Error('El monto no puede exceder 999,999,999');
  }
  
  return amount;
}

/**
 * Valida que el número de años sea válido
 * @param {number} years - Años a validar
 * @returns {number} Años validados
 */
export function validateYears(years) {
  validateFinancialNumber(years, 'El número de años');
  
  if (years > 100) {
    throw new Error('El número de años no puede exceder 100');
  }
  
  return years;
}

/**
 * Sanitiza y valida datos de entrada del formulario web
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Datos sanitizados y validados
 */
export function sanitizeFormData(formData) {
  const sanitized = {
    amount_nominal: parseFloat(formData.amount_nominal),
    inflation_rate: parseFloat(formData.inflation_rate),
    years: parseFloat(formData.years),
    granularity: formData.granularity || 'none'
  };
  
  return validateInflationEffectData(sanitized);
}
