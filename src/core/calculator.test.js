/**
 * Tests unitarios para el módulo core/calculator.js
 * Pruebas de las funciones puras de cálculo de inflación
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDiscountFactor,
  calculateRealValue,
  calculateAbsoluteLoss,
  calculateLossPercentage,
  generateTimeSeries,
  calculateInflationEffect
} from './calculator.js';

describe('calculateDiscountFactor', () => {
  it('debe calcular correctamente el factor de descuento para inflación positiva', () => {
    const result = calculateDiscountFactor(0.065, 3);
    expect(result).toBeCloseTo(1.2088, 4);
  });

  it('debe retornar 1 para inflación cero', () => {
    const result = calculateDiscountFactor(0, 5);
    expect(result).toBe(1);
  });

  it('debe manejar años fraccionales', () => {
    const result = calculateDiscountFactor(0.1, 2.5);
    expect(result).toBeCloseTo(1.2691, 4);
  });

  it('debe lanzar error para inflación negativa', () => {
    expect(() => calculateDiscountFactor(-0.1, 3)).toThrow('La tasa de inflación no puede ser negativa');
  });

  it('debe lanzar error para años negativos', () => {
    expect(() => calculateDiscountFactor(0.1, -3)).toThrow('El número de años no puede ser negativo');
  });
});

describe('calculateRealValue', () => {
  it('debe calcular correctamente el valor real final', () => {
    const result = calculateRealValue(10000, 0.065, 3);
    expect(result).toBeCloseTo(8256.11, 2);
  });

  it('debe retornar el mismo valor para inflación cero', () => {
    const result = calculateRealValue(10000, 0, 5);
    expect(result).toBe(10000);
  });

  it('debe manejar años fraccionales', () => {
    const result = calculateRealValue(10000, 0.1, 2.5);
    expect(result).toBeCloseTo(7874.02, 2);
  });

  it('debe lanzar error para monto negativo', () => {
    expect(() => calculateRealValue(-1000, 0.1, 3)).toThrow('El monto nominal debe ser mayor a cero');
  });

  it('debe lanzar error para monto cero', () => {
    expect(() => calculateRealValue(0, 0.1, 3)).toThrow('El monto nominal debe ser mayor a cero');
  });
});

describe('calculateAbsoluteLoss', () => {
  it('debe calcular correctamente la pérdida absoluta', () => {
    const result = calculateAbsoluteLoss(10000, 8256.11);
    expect(result).toBeCloseTo(1743.89, 2);
  });

  it('debe retornar cero cuando no hay pérdida', () => {
    const result = calculateAbsoluteLoss(10000, 10000);
    expect(result).toBe(0);
  });

  it('debe manejar valores con muchas decimales', () => {
    const result = calculateAbsoluteLoss(10000, 8256.111111);
    expect(result).toBeCloseTo(1743.89, 2);
  });
});

describe('calculateLossPercentage', () => {
  it('debe calcular correctamente la pérdida porcentual', () => {
    const result = calculateLossPercentage(0.065, 3);
    expect(result).toBeCloseTo(0.1744, 4);
  });

  it('debe retornar cero para inflación cero', () => {
    const result = calculateLossPercentage(0, 5);
    expect(result).toBe(0);
  });

  it('debe manejar años fraccionales', () => {
    const result = calculateLossPercentage(0.1, 2.5);
    expect(result).toBeCloseTo(0.2125, 4);
  });

  it('debe lanzar error para inflación negativa', () => {
    expect(() => calculateLossPercentage(-0.1, 3)).toThrow('La tasa de inflación no puede ser negativa');
  });

  it('debe lanzar error para años negativos', () => {
    expect(() => calculateLossPercentage(0.1, -3)).toThrow('El número de años no puede ser negativo');
  });
});

describe('generateTimeSeries', () => {
  it('debe generar serie anual correctamente', () => {
    const result = generateTimeSeries(10000, 0.065, 3, 'yearly');
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      t: 1,
      years: 1,
      real_value: expect.any(Number),
      loss_percent: expect.any(Number)
    });
    
    // Verificar valores específicos del ejemplo del informe
    expect(result[0].real_value).toBeCloseTo(9389.61, 2);
    expect(result[0].loss_percent).toBeCloseTo(6.10, 2);
    
    expect(result[2].real_value).toBeCloseTo(8256.11, 2);
    expect(result[2].loss_percent).toBeCloseTo(17.44, 2);
  });

  it('debe generar serie trimestral correctamente', () => {
    const result = generateTimeSeries(10000, 0.1, 1, 'quarterly');
    
    expect(result).toHaveLength(4);
    expect(result[0].years).toBe(0.25);
    expect(result[3].years).toBe(1);
  });

  it('debe manejar años fraccionales en la serie', () => {
    const result = generateTimeSeries(10000, 0.1, 2.5, 'yearly');
    
    expect(result).toHaveLength(3);
    expect(result[2].years).toBe(2.5);
  });

  it('debe lanzar error para monto inválido', () => {
    expect(() => generateTimeSeries(-1000, 0.1, 3, 'yearly')).toThrow('El monto nominal debe ser mayor a cero');
  });
});

describe('calculateInflationEffect', () => {
  it('debe calcular todas las métricas correctamente', () => {
    const result = calculateInflationEffect({
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 3,
      granularity: 'yearly'
    });
    
    expect(result).toEqual({
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 3,
      real_value: expect.any(Number),
      absolute_loss: expect.any(Number),
      loss_percent: expect.any(Number),
      series: expect.any(Array)
    });
    
    // Verificar valores específicos del ejemplo del informe
    expect(result.real_value).toBeCloseTo(8256.11, 2);
    expect(result.absolute_loss).toBeCloseTo(1743.89, 2);
    expect(result.loss_percent).toBeCloseTo(17.44, 2);
    expect(result.series).toHaveLength(3);
  });

  it('debe funcionar sin serie temporal cuando granularity es none', () => {
    const result = calculateInflationEffect({
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 3,
      granularity: 'none'
    });
    
    expect(result.series).toBeUndefined();
  });

  it('debe usar granularity none por defecto', () => {
    const result = calculateInflationEffect({
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 3
    });
    
    expect(result.series).toBeUndefined();
  });

  it('debe manejar inflación cero', () => {
    const result = calculateInflationEffect({
      amount_nominal: 10000,
      inflation_rate: 0,
      years: 5
    });
    
    expect(result.real_value).toBe(10000);
    expect(result.absolute_loss).toBe(0);
    expect(result.loss_percent).toBe(0);
  });

  it('debe manejar años fraccionales', () => {
    const result = calculateInflationEffect({
      amount_nominal: 10000,
      inflation_rate: 10,
      years: 2.5
    });
    
    expect(result.real_value).toBeCloseTo(7874.02, 2);
    expect(result.absolute_loss).toBeCloseTo(2125.98, 2);
    expect(result.loss_percent).toBeCloseTo(21.26, 2);
  });
});

describe('Casos edge y validación', () => {
  it('debe manejar valores muy pequeños', () => {
    const result = calculateInflationEffect({
      amount_nominal: 0.01,
      inflation_rate: 0.1,
      years: 0.1
    });
    
    expect(result.real_value).toBeCloseTo(0.0099, 4);
  });

  it('debe manejar valores muy grandes', () => {
    const result = calculateInflationEffect({
      amount_nominal: 999999999,
      inflation_rate: 50,
      years: 10
    });
    
    expect(result.real_value).toBeLessThan(result.amount_nominal);
    expect(result.loss_percent).toBeGreaterThan(0);
  });

  it('debe manejar inflación muy alta', () => {
    const result = calculateInflationEffect({
      amount_nominal: 1000,
      inflation_rate: 100,
      years: 1
    });
    
    expect(result.real_value).toBeCloseTo(500, 2);
    expect(result.loss_percent).toBeCloseTo(50, 2);
  });
});
