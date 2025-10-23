/**
 * Tests unitarios para el módulo domain/validation.js
 * Pruebas de validación de datos de entrada
 */

import { describe, it, expect } from 'vitest';
import {
  validateInflationEffectData,
  validateFinancialNumber,
  validatePercentage,
  validateMonetaryAmount,
  validateYears,
  sanitizeFormData
} from './validation.js';

describe('validateInflationEffectData', () => {
  it('debe validar datos correctos', () => {
    const validData = {
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 3,
      granularity: 'yearly'
    };
    
    const result = validateInflationEffectData(validData);
    expect(result).toEqual(validData);
  });

  it('debe usar granularity none por defecto', () => {
    const data = {
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 3
    };
    
    const result = validateInflationEffectData(data);
    expect(result.granularity).toBe('none');
  });

  it('debe rechazar monto nominal negativo', () => {
    const invalidData = {
      amount_nominal: -1000,
      inflation_rate: 6.5,
      years: 3
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('El monto nominal debe ser mayor a cero');
  });

  it('debe rechazar monto nominal cero', () => {
    const invalidData = {
      amount_nominal: 0,
      inflation_rate: 6.5,
      years: 3
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('El monto nominal debe ser mayor a cero');
  });

  it('debe rechazar monto nominal muy grande', () => {
    const invalidData = {
      amount_nominal: 1000000000,
      inflation_rate: 6.5,
      years: 3
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('El monto nominal no puede exceder 999,999,999');
  });

  it('debe rechazar tasa de inflación negativa', () => {
    const invalidData = {
      amount_nominal: 10000,
      inflation_rate: -5,
      years: 3
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('La tasa de inflación no puede ser negativa');
  });

  it('debe rechazar tasa de inflación mayor a 100%', () => {
    const invalidData = {
      amount_nominal: 10000,
      inflation_rate: 150,
      years: 3
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('La tasa de inflación no puede exceder 100%');
  });

  it('debe rechazar años negativos', () => {
    const invalidData = {
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: -2
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('El número de años no puede ser negativo');
  });

  it('debe rechazar años muy grandes', () => {
    const invalidData = {
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 150
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('El número de años no puede exceder 100');
  });

  it('debe rechazar granularidad inválida', () => {
    const invalidData = {
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 3,
      granularity: 'invalid'
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('La granularidad debe ser: none, yearly o quarterly');
  });

  it('debe rechazar valores no numéricos', () => {
    const invalidData = {
      amount_nominal: 'not a number',
      inflation_rate: 6.5,
      years: 3
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('El monto nominal debe ser un número válido');
  });

  it('debe rechazar valores infinitos', () => {
    const invalidData = {
      amount_nominal: Infinity,
      inflation_rate: 6.5,
      years: 3
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('El monto nominal debe ser un número válido');
  });

  it('debe rechazar valores NaN', () => {
    const invalidData = {
      amount_nominal: NaN,
      inflation_rate: 6.5,
      years: 3
    };
    
    expect(() => validateInflationEffectData(invalidData)).toThrow('El monto nominal debe ser un número válido');
  });
});

describe('validateFinancialNumber', () => {
  it('debe validar números válidos', () => {
    expect(validateFinancialNumber(100, 'test')).toBe(100);
    expect(validateFinancialNumber(0, 'test')).toBe(0);
    expect(validateFinancialNumber(999.99, 'test')).toBe(999.99);
  });

  it('debe rechazar valores no numéricos', () => {
    expect(() => validateFinancialNumber('string', 'test')).toThrow('test debe ser un número válido');
    expect(() => validateFinancialNumber(null, 'test')).toThrow('test debe ser un número válido');
    expect(() => validateFinancialNumber(undefined, 'test')).toThrow('test debe ser un número válido');
  });

  it('debe rechazar valores infinitos', () => {
    expect(() => validateFinancialNumber(Infinity, 'test')).toThrow('test debe ser un número válido');
    expect(() => validateFinancialNumber(-Infinity, 'test')).toThrow('test debe ser un número válido');
  });

  it('debe rechazar valores NaN', () => {
    expect(() => validateFinancialNumber(NaN, 'test')).toThrow('test debe ser un número válido');
  });

  it('debe rechazar valores negativos', () => {
    expect(() => validateFinancialNumber(-100, 'test')).toThrow('test no puede ser negativo');
  });
});

describe('validatePercentage', () => {
  it('debe validar porcentajes válidos', () => {
    expect(validatePercentage(0)).toBe(0);
    expect(validatePercentage(50)).toBe(50);
    expect(validatePercentage(100)).toBe(100);
  });

  it('debe rechazar porcentajes mayores a 100', () => {
    expect(() => validatePercentage(150)).toThrow('El porcentaje no puede exceder 100%');
  });

  it('debe rechazar porcentajes negativos', () => {
    expect(() => validatePercentage(-10)).toThrow('El porcentaje no puede ser negativo');
  });
});

describe('validateMonetaryAmount', () => {
  it('debe validar montos válidos', () => {
    expect(validateMonetaryAmount(0.01)).toBe(0.01);
    expect(validateMonetaryAmount(1000)).toBe(1000);
    expect(validateMonetaryAmount(999999999)).toBe(999999999);
  });

  it('debe rechazar montos cero', () => {
    expect(() => validateMonetaryAmount(0)).toThrow('El monto debe ser mayor a cero');
  });

  it('debe rechazar montos negativos', () => {
    expect(() => validateMonetaryAmount(-100)).toThrow('El monto no puede ser negativo');
  });

  it('debe rechazar montos muy grandes', () => {
    expect(() => validateMonetaryAmount(1000000000)).toThrow('El monto no puede exceder 999,999,999');
  });
});

describe('validateYears', () => {
  it('debe validar años válidos', () => {
    expect(validateYears(0.25)).toBe(0.25);
    expect(validateYears(1)).toBe(1);
    expect(validateYears(100)).toBe(100);
  });

  it('debe rechazar años negativos', () => {
    expect(() => validateYears(-1)).toThrow('El número de años no puede ser negativo');
  });

  it('debe rechazar años muy grandes', () => {
    expect(() => validateYears(150)).toThrow('El número de años no puede exceder 100');
  });
});

describe('sanitizeFormData', () => {
  it('debe sanitizar datos de formulario correctamente', () => {
    const formData = {
      amount_nominal: '10000',
      inflation_rate: '6.5',
      years: '3',
      granularity: 'yearly'
    };
    
    const result = sanitizeFormData(formData);
    expect(result).toEqual({
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 3,
      granularity: 'yearly'
    });
  });

  it('debe usar granularity none por defecto', () => {
    const formData = {
      amount_nominal: '10000',
      inflation_rate: '6.5',
      years: '3'
    };
    
    const result = sanitizeFormData(formData);
    expect(result.granularity).toBe('none');
  });

  it('debe rechazar datos de formulario inválidos', () => {
    const invalidFormData = {
      amount_nominal: 'invalid',
      inflation_rate: '6.5',
      years: '3'
    };
    
    expect(() => sanitizeFormData(invalidFormData)).toThrow();
  });

  it('debe manejar valores decimales en strings', () => {
    const formData = {
      amount_nominal: '10000.50',
      inflation_rate: '6.75',
      years: '2.5'
    };
    
    const result = sanitizeFormData(formData);
    expect(result.amount_nominal).toBe(10000.50);
    expect(result.inflation_rate).toBe(6.75);
    expect(result.years).toBe(2.5);
  });
});
