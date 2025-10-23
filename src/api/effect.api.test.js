/**
 * Tests de API para el módulo de inflación
 * Pruebas de integración de los endpoints REST
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('API Endpoints', () => {
  describe('GET /api/v1/info', () => {
    it('debe retornar información de la API', async () => {
      const response = await request(app)
        .get('/api/v1/info')
        .expect(200);
      
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body).toHaveProperty('authors');
      expect(response.body).toHaveProperty('institution');
      
      expect(response.body.name).toBe('Módulo de Efecto de la Inflación sobre el Ahorro');
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('POST /api/v1/inflation/effect', () => {
    it('debe calcular el efecto de inflación correctamente', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 6.5,
        years: 3,
        granularity: 'yearly'
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('amount_nominal', 10000);
      expect(response.body.data).toHaveProperty('inflation_rate', 6.5);
      expect(response.body.data).toHaveProperty('years', 3);
      expect(response.body.data).toHaveProperty('real_value');
      expect(response.body.data).toHaveProperty('absolute_loss');
      expect(response.body.data).toHaveProperty('loss_percent');
      expect(response.body.data).toHaveProperty('series');
      
      // Verificar valores específicos del ejemplo del informe
      expect(response.body.data.real_value).toBeCloseTo(8256.11, 2);
      expect(response.body.data.absolute_loss).toBeCloseTo(1743.89, 2);
      expect(response.body.data.loss_percent).toBeCloseTo(17.44, 2);
      
      // Verificar serie temporal
      expect(response.body.data.series).toHaveLength(3);
      expect(response.body.data.series[0]).toHaveProperty('t', 1);
      expect(response.body.data.series[0]).toHaveProperty('years', 1);
      expect(response.body.data.series[0]).toHaveProperty('real_value');
      expect(response.body.data.series[0]).toHaveProperty('loss_percent');
    });

    it('debe funcionar sin serie temporal cuando granularity es none', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 6.5,
        years: 3,
        granularity: 'none'
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.series).toBeUndefined();
    });

    it('debe usar granularity none por defecto', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 6.5,
        years: 3
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.series).toBeUndefined();
    });

    it('debe manejar años fraccionales', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 10,
        years: 2.5
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.real_value).toBeCloseTo(7874.02, 2);
      expect(response.body.data.loss_percent).toBeCloseTo(21.26, 2);
    });

    it('debe manejar inflación cero', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 0,
        years: 5
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.real_value).toBe(10000);
      expect(response.body.data.absolute_loss).toBe(0);
      expect(response.body.data.loss_percent).toBe(0);
    });

    it('debe generar serie trimestral correctamente', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 10,
        years: 1,
        granularity: 'quarterly'
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.series).toHaveLength(4);
      expect(response.body.data.series[0].years).toBe(0.25);
      expect(response.body.data.series[3].years).toBe(1);
    });
  });

  describe('Validación de errores', () => {
    it('debe rechazar monto nominal negativo', async () => {
      const payload = {
        amount_nominal: -1000,
        inflation_rate: 6.5,
        years: 3
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('monto nominal');
    });

    it('debe rechazar monto nominal cero', async () => {
      const payload = {
        amount_nominal: 0,
        inflation_rate: 6.5,
        years: 3
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('monto nominal');
    });

    it('debe rechazar tasa de inflación negativa', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: -5,
        years: 3
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('inflación');
    });

    it('debe rechazar tasa de inflación mayor a 100%', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 150,
        years: 3
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('inflación');
    });

    it('debe rechazar años negativos', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 6.5,
        years: -2
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('años');
    });

    it('debe rechazar granularidad inválida', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 6.5,
        years: 3,
        granularity: 'invalid'
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('granularidad');
    });

    it('debe rechazar valores no numéricos', async () => {
      const payload = {
        amount_nominal: 'not a number',
        inflation_rate: 6.5,
        years: 3
      };
      
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send(payload)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('número válido');
    });

    it('debe rechazar JSON inválido', async () => {
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });

    it('debe rechazar payload vacío', async () => {
      const response = await request(app)
        .post('/api/v1/inflation/effect')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });

  describe('Rutas no encontradas', () => {
    it('debe retornar 404 para rutas inexistentes', async () => {
      const response = await request(app)
        .get('/api/v1/nonexistent')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Endpoint no encontrado');
      expect(response.body.path).toBe('/api/v1/nonexistent');
    });

    it('debe retornar 404 para métodos no permitidos', async () => {
      const response = await request(app)
        .put('/api/v1/inflation/effect')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Endpoint no encontrado');
    });
  });

  describe('Rate limiting', () => {
    it('debe aplicar rate limiting después de muchas solicitudes', async () => {
      const payload = {
        amount_nominal: 10000,
        inflation_rate: 6.5,
        years: 3
      };
      
      // Hacer muchas solicitudes rápidamente
      const promises = Array(110).fill().map(() => 
        request(app)
          .post('/api/v1/inflation/effect')
          .send(payload)
      );
      
      const responses = await Promise.allSettled(promises);
      
      // Al menos una debe ser rechazada por rate limiting
      const rateLimitedResponses = responses.filter(
        result => result.status === 'fulfilled' && result.value.status === 429
      );
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Headers de seguridad', () => {
    it('debe incluir headers de seguridad', async () => {
      const response = await request(app)
        .get('/api/v1/info')
        .expect(200);
      
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });
});
