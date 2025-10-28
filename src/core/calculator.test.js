// src/core/calculator.test.js
import { describe, it, expect } from 'vitest';
import {
  calculateDiscountFactor,
  calculateRealValue,
  calculateAbsoluteLoss,
  calculateLossPercentage,
  generateTimeSeries,
  calculateInflationEffect,
} from './calculator.js';

describe('Core | calculator (Vitest)', () => {
  describe('calculateDiscountFactor', () => {
    it('valida que la tasa no sea negativa', () => {
      expect(() => calculateDiscountFactor(-0.1, 1)).toThrow('La tasa de inflación no puede ser negativa');
    });

    it('valida que los años no sean negativos', () => {
      expect(() => calculateDiscountFactor(0.1, -1)).toThrow('Los años no pueden ser negativos');
    });

    it('calcula correctamente con años = 0', () => {
      expect(calculateDiscountFactor(0.1, 0)).toBeCloseTo(1, 8);
    });

    it('calcula correctamente el factor de descuento', () => {
      expect(calculateDiscountFactor(0.1, 2)).toBeCloseTo(Math.pow(1.1, 2), 8);
    });
  });

  describe('calculateRealValue', () => {
    it('rechaza monto <= 0', () => {
      expect(() => calculateRealValue(0, 0.05, 1)).toThrow('El monto nominal debe ser mayor a 0');
      expect(() => calculateRealValue(-100, 0.05, 1)).toThrow('El monto nominal debe ser mayor a 0');
    });

    it('calcula correctamente el valor real', () => {
      const v = calculateRealValue(1000, 0.1, 1);
      expect(v).toBeCloseTo(909.0909, 3);
    });
  });

  describe('calculateAbsoluteLoss', () => {
    it('calcula la diferencia nominal - real', () => {
      expect(calculateAbsoluteLoss(1000, 900)).toBeCloseTo(100, 6);
    });
  });

  describe('calculateLossPercentage', () => {
    it('valida que la tasa no sea negativa', () => {
      expect(() => calculateLossPercentage(-0.1, 1)).toThrow('La tasa de inflación no puede ser negativa');
    });

    it('valida que los años no sean negativos', () => {
      expect(() => calculateLossPercentage(0.1, -1)).toThrow('Los años no pueden ser negativos');
    });

    it('calcula correctamente el porcentaje de pérdida', () => {
      const p = calculateLossPercentage(0.1, 1);
      expect(p).toBeCloseTo(0.090909, 3);
    });
  });

  describe('generateTimeSeries', () => {
    it('requiere nominal > 0', () => {
      expect(() => generateTimeSeries(0, 0.1, 1, 'yearly')).toThrow('El monto nominal debe ser mayor a 0');
    });

    it('genera serie anual correctamente', () => {
      const s = generateTimeSeries(1000, 0.1, 3, 'yearly');
      expect(s.length).toBe(3);
      expect(s[0]).toHaveProperty('real_value');
      expect(typeof s[0].real_value).toBe('number');
    });

    it('genera serie trimestral correctamente', () => {
      const s = generateTimeSeries(1000, 0.1, 1, 'quarterly');
      expect(s.length).toBe(4);
    });
  });

  describe('calculateInflationEffect', () => {
    it('resultado básico sin series cuando granularity=none', () => {
      const r = calculateInflationEffect({
        amount_nominal: 1000,
        inflation_rate: 10,
        years: 1,
        granularity: 'none',
      });
      expect(r.real_value).toBeGreaterThan(0);
      expect(r.absolute_loss).toBeGreaterThan(0);
      expect(r.loss_percent).toBeGreaterThan(0);
      expect(r.series).toBeUndefined();
    });

    it('incluye series cuando granularity=yearly', () => {
      const r = calculateInflationEffect({
        amount_nominal: 1000,
        inflation_rate: 10,
        years: 2,
        granularity: 'yearly',
      });
      expect(Array.isArray(r.series)).toBe(true);
      expect(r.series.length).toBe(2);
    });
  });
});