/**
 * Módulo de cálculo del efecto de la inflación sobre el ahorro
 * Contiene funciones puras para realizar cálculos financieros
 */

/**
 * Calcula el factor de descuento acumulado por inflación
 * @param {number} inflationRate - Tasa de inflación en decimal (ej: 0.065 para 6.5%)
 * @param {number} years - Número de años
 * @returns {number} Factor de descuento
 */
export function calculateDiscountFactor(inflationRate, years) {
  if (inflationRate < 0) {
    throw new Error('La tasa de inflación no puede ser negativa');
  }
  if (years < 0) {
    throw new Error('Los años no pueden ser negativos');
  }
  return Math.pow(1 + inflationRate, years);
}

/**
 * Calcula el valor real del ahorro ajustado por inflación
 * @param {number} nominalAmount - Monto nominal inicial
 * @param {number} inflationRate - Tasa de inflación en decimal
 * @param {number} years - Número de años
 * @returns {number} Valor real ajustado
 */
export function calculateRealValue(nominalAmount, inflationRate, years) {
  if (nominalAmount <= 0) {
    throw new Error('El monto nominal debe ser mayor a 0');
  }
  const discountFactor = calculateDiscountFactor(inflationRate, years);
  return nominalAmount / discountFactor;
}

/**
 * Calcula la pérdida absoluta de poder adquisitivo
 * @param {number} nominalAmount - Monto nominal inicial
 * @param {number} realValue - Valor real ajustado
 * @returns {number} Pérdida absoluta
 */
export function calculateAbsoluteLoss(nominalAmount, realValue) {
  return nominalAmount - realValue;
}

/**
 * Calcula el porcentaje de pérdida de poder adquisitivo
 * @param {number} inflationRate - Tasa de inflación en decimal
 * @param {number} years - Número de años
 * @returns {number} Porcentaje de pérdida (en decimal)
 */
export function calculateLossPercentage(inflationRate, years) {
  if (inflationRate < 0) {
    throw new Error('La tasa de inflación no puede ser negativa');
  }
  if (years < 0) {
    throw new Error('Los años no pueden ser negativos');
  }
  const discountFactor = calculateDiscountFactor(inflationRate, years);
  return 1 - (1 / discountFactor);
}

/**
 * Genera una serie temporal de valores ajustados por inflación
 * @param {number} nominalAmount - Monto nominal inicial
 * @param {number} inflationRate - Tasa de inflación en decimal
 * @param {number} years - Número de años
 * @param {string} granularity - Granularidad: 'yearly' o 'quarterly'
 * @returns {Array} Serie temporal con valores por período
 */
export function generateTimeSeries(nominalAmount, inflationRate, years, granularity) {
  if (nominalAmount <= 0) {
    throw new Error('El monto nominal debe ser mayor a 0');
  }

  const series = [];
  let step = 1; // Anual por defecto
  let periods = Math.floor(years);

  if (granularity === 'quarterly') {
    step = 0.25;
    periods = Math.floor(years / step);
  }

  for (let i = 1; i <= periods; i++) {
    const currentYears = i * step;
    const realValue = calculateRealValue(nominalAmount, inflationRate, currentYears);
    const absoluteLoss = calculateAbsoluteLoss(nominalAmount, realValue);
    const lossPercent = calculateLossPercentage(inflationRate, currentYears);

    series.push({
      period: i,
      years: currentYears,
      real_value: parseFloat(realValue.toFixed(2)),
      absolute_loss: parseFloat(absoluteLoss.toFixed(2)),
      loss_percent: parseFloat((lossPercent * 100).toFixed(2)),
    });
  }

  return series;
}

/**
 * Calcula el efecto completo de la inflación sobre el ahorro
 * @param {Object} params - Parámetros de entrada
 * @param {number} params.amount_nominal - Monto nominal inicial
 * @param {number} params.inflation_rate - Tasa de inflación anual en porcentaje
 * @param {number} params.years - Número de años
 * @param {string} params.granularity - Granularidad: 'none', 'yearly' o 'quarterly'
 * @returns {Object} Resultado con métricas de inflación
 */
export function calculateInflationEffect({ amount_nominal, inflation_rate, years, granularity }) {
  // Convertir tasa de porcentaje a decimal
  const inflationRateDecimal = inflation_rate / 100;

  // Calcular métricas principales
  const realValue = calculateRealValue(amount_nominal, inflationRateDecimal, years);
  const absoluteLoss = calculateAbsoluteLoss(amount_nominal, realValue);
  const lossPercent = calculateLossPercentage(inflationRateDecimal, years);

  const result = {
    amount_nominal,
    inflation_rate,
    years,
    real_value: parseFloat(realValue.toFixed(2)),
    absolute_loss: parseFloat(absoluteLoss.toFixed(2)),
    loss_percent: parseFloat((lossPercent * 100).toFixed(2)),
  };

  // Generar serie temporal si se solicita
  if (granularity !== 'none') {
    result.series = generateTimeSeries(amount_nominal, inflationRateDecimal, years, granularity);
  }

  return result;
}