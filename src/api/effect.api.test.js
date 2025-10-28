// src/api/effect.api.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('API | inflation', () => {
  it('POST /api/v1/inflation/effect -> 200 y persiste', async () => {
    const res = await request(app)
      .post('/api/v1/inflation/effect')
      .send({
        amount_nominal: 10000,
        inflation_rate: 6.5,
        years: 3,
        granularity: 'yearly',
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.real_value).toBeDefined();
  });

  it('GET /api/v1/inflation/history -> 200', async () => {
    const res = await request(app).get('/api/v1/inflation/history?limit=5&offset=0').expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/inflation/statistics -> 200', async () => {
    const res = await request(app).get('/api/v1/inflation/statistics').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('total_queries');
  });

  it('Validación: payload inválido -> 400', async () => {
    const res = await request(app)
      .post('/api/v1/inflation/effect')
      .send({ amount_nominal: -1, inflation_rate: 6.5, years: 3 })
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});