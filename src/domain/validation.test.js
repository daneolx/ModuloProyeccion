// src/domain/validation.test.js
import { describe, it, expect } from 'vitest';
import {
  validateInflationEffectData,
  validateFinancialNumber,
  validatePercentage,
  validateMonetaryAmount,
  validateYears,
  sanitizeFormData,
} from './validation.js';

describe('Domain | validation (Vitest)', () => {
  describe('validateInflationEffectData', () => {
    it('acepta datos válidos', () => {
      const data = validateInflationEffectData({
        amount_nominal: 10000,
        inflation_rate: 6.5,
        years: 3,
        granularity: 'yearly',
      });
      expect(data.amount_nominal).toBe(10000);
      expect(data.inflation_rate).toBe(6.5);
      expect(data.years).toBe(3);
      expect(data.granularity).toBe('yearly');
    });

    it('rechaza inflación > 100', () => {
      expect(() =>
        validateInflationEffectData({
          amount_nominal: 10000,
          inflation_rate: 150,
          years: 3,
          granularity: 'yearly',
        }),
      ).toThrow();
    });

    it('rechaza monto negativo', () => {
      expect(() =>
        validateInflationEffectData({
          amount_nominal: -1000,
          inflation_rate: 6.5,
          years: 3,
          granularity: 'yearly',
        }),
      ).toThrow();
    });
  });

  describe('validateFinancialNumber', () => {
    it('acepta números positivos', () => {
      expect(validateFinancialNumber(1.5, 'test')).toBe(1.5);
    });

    it('rechaza NaN', () => {
      expect(() => validateFinancialNumber(NaN, 'test')).toThrow('test debe ser un número válido');
    });

    it('rechaza negativos', () => {
      expect(() => validateFinancialNumber(-1, 'test')).toThrow('test no puede ser negativo');
    });
  });

  describe('validatePercentage', () => {
    it('acepta 0..100', () => {
      expect(validatePercentage(0)).toBe(0);
      expect(validatePercentage(99.9)).toBe(99.9);
      expect(validatePercentage(100)).toBe(100);
    });

    it('rechaza > 100', () => {
      expect(() => validatePercentage(101)).toThrow('El porcentaje debe estar entre 0 y 100');
    });

    it('rechaza negativos', () => {
      expect(() => validatePercentage(-0.1)).toThrow('El porcentaje debe estar entre 0 y 100');
    });
  });

  describe('validateMonetaryAmount', () => {
    it('acepta montos válidos', () => {
      expect(validateMonetaryAmount(100)).toBe(100);
    });

    it('rechaza 0', () => {
      expect(() => validateMonetaryAmount(0)).toThrow('El monto debe ser mayor a 0');
    });

    it('rechaza montos muy grandes', () => {
      expect(() => validateMonetaryAmount(1_000_000_000)).toThrow('El monto no puede exceder 999,999,999');
    });
  });

  describe('validateYears', () => {
    it('acepta rango válido', () => {
      expect(validateYears(0)).toBe(0);
      expect(validateYears(0.25)).toBeCloseTo(0.25, 6);
      expect(validateYears(100)).toBe(100);
    });

    it('rechaza > 100', () => {
      expect(() => validateYears(101)).toThrow('Los años no pueden exceder 100');
    });

    it('rechaza negativos', () => {
      expect(() => validateYears(-1)).toThrow('Los años no pueden ser negativos');
    });
  });

  describe('sanitizeFormData', () => {
    it('parsea strings a números', () => {
      const sanitized = sanitizeFormData({
        amount_nominal: '10000',
        inflation_rate: '6.5',
        years: '3',
        granularity: 'quarterly',
      });
      expect(sanitized.amount_nominal).toBe(10000);
      expect(sanitized.inflation_rate).toBe(6.5);
      expect(sanitized.years).toBe(3);
      expect(sanitized.granularity).toBe('quarterly');
    });
  });
});