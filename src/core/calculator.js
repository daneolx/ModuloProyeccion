/**
 * Módulo core para cálculos de inflación sobre ahorro
 * Funciones puras y testables para el cálculo del efecto de la inflación
 */

/**
 * Calcula el factor de descuento por inflación
 * @param {number} inflationRate - Tasa de inflación anual en decimal (ej: 0.065 para 6.5%)
 * @param {number} years - Número de años (puede ser fraccional)
 * @returns {number} Factor de descuento
 */
export function calculateDiscountFactor(inflationRate, years) {
  if (inflationRate < 0) {
    throw new Error('La tasa de inflación no puede ser negativa');
  }
  if (years < 0) {
    throw new Error('El número de años no puede ser negativo');
  }
  
  return Math.pow(1 + inflationRate, years);
}

/**
 * Calcula el valor real final del ahorro
 * @param {number} nominalAmount - Monto nominal inicial
 * @param {number} inflationRate - Tasa de inflación anual en decimal
 * @param {number} years - Número de años
 * @returns {number} Valor real final
 */
export function calculateRealValue(nominalAmount, inflationRate, years) {
  if (nominalAmount <= 0) {
    throw new Error('El monto nominal debe ser mayor a cero');
  }
  
  const discountFactor = calculateDiscountFactor(inflationRate, years);
  return nominalAmount / discountFactor;
}

/**
 * Calcula la pérdida absoluta por inflación
 * @param {number} nominalAmount - Monto nominal inicial
 * @param {number} realValue - Valor real final
 * @returns {number} Pérdida absoluta
 */
export function calculateAbsoluteLoss(nominalAmount, realValue) {
  return nominalAmount - realValue;
}

/**
 * Calcula la pérdida porcentual acumulada
 * @param {number} inflationRate - Tasa de inflación anual en decimal
 * @param {number} years - Número de años
 * @returns {number} Pérdida porcentual (ej: 0.1744 para 17.44%)
 */
export function calculateLossPercentage(inflationRate, years) {
  if (inflationRate < 0) {
    throw new Error('La tasa de inflación no puede ser negativa');
  }
  if (years < 0) {
    throw new Error('El número de años no puede ser negativo');
  }
  
  return 1 - (1 / Math.pow(1 + inflationRate, years));
}

/**
 * Genera una serie temporal de valores reales y pérdidas
 * @param {number} nominalAmount - Monto nominal inicial
 * @param {number} inflationRate - Tasa de inflación anual en decimal
 * @param {number} years - Número de años
 * @param {string} granularity - Granularidad: 'yearly' o 'quarterly'
 * @returns {Array} Array de objetos con valores por período
 */
export function generateTimeSeries(nominalAmount, inflationRate, years, granularity = 'yearly') {
  if (nominalAmount <= 0) {
    throw new Error('El monto nominal debe ser mayor a cero');
  }
  
  const series = [];
  const periods = granularity === 'quarterly' ? Math.ceil(years * 4) : Math.ceil(years);
  const periodLength = granularity === 'quarterly' ? 0.25 : 1;
  
  for (let i = 1; i <= periods; i++) {
    const currentYears = Math.min(i * periodLength, years);
    const realValue = calculateRealValue(nominalAmount, inflationRate, currentYears);
    const lossPercent = calculateLossPercentage(inflationRate, currentYears);
    
    series.push({
      t: i,
      years: currentYears,
      real_value: Math.round(realValue * 100) / 100,
      loss_percent: Math.round(lossPercent * 10000) / 100 // Redondeo a 2 decimales
    });
  }
  
  return series;
}

/**
 * Función principal que calcula todas las métricas de inflación
 * @param {Object} params - Parámetros de entrada
 * @param {number} params.amount_nominal - Monto nominal inicial
 * @param {number} params.inflation_rate - Tasa de inflación anual en porcentaje (ej: 6.5)
 * @param {number} params.years - Número de años
 * @param {string} params.granularity - Granularidad opcional: 'none', 'yearly', 'quarterly'
 * @returns {Object} Resultado completo con todas las métricas
 */
export function calculateInflationEffect({ amount_nominal, inflation_rate, years, granularity = 'none' }) {
  // Convertir tasa de porcentaje a decimal
  const inflationRateDecimal = inflation_rate / 100;
  
  // Calcular métricas principales
  const realValue = calculateRealValue(amount_nominal, inflationRateDecimal, years);
  const absoluteLoss = calculateAbsoluteLoss(amount_nominal, realValue);
  const lossPercent = calculateLossPercentage(inflationRateDecimal, years);
  
  const result = {
    amount_nominal: amount_nominal,
    inflation_rate: inflation_rate,
    years: years,
    real_value: Math.round(realValue * 100) / 100,
    absolute_loss: Math.round(absoluteLoss * 100) / 100,
    loss_percent: Math.round(lossPercent * 10000) / 100 // Redondeo a 2 decimales
  };
  
  // Agregar serie temporal si se solicita
  if (granularity !== 'none') {
    result.series = generateTimeSeries(amount_nominal, inflationRateDecimal, years, granularity);
  }
  
  return result;
}
