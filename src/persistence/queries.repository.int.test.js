// src/persistence/queries.repository.int.test.js
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { query, closePool, testConnection } from './db.js';
import {
  saveInflationQuery,
  getInflationQueryById,
  getAllInflationQueries,
  getQueryStatistics,
  getQueriesByDateRange,
  deleteOldQueries,
  getRecentQueries,
} from './queries.repository.js';

describe('Integration | queries.repository', () => {
  beforeAll(async () => {
    const ok = await testConnection();
    expect(ok).toBe(true);
    await query('DELETE FROM inflation_queries;');
  });

  afterAll(async () => {
    await closePool();
  });

  it('saveInflationQuery -> getInflationQueryById', async () => {
    const saved = await saveInflationQuery({
      amount_nominal: 10000,
      inflation_rate: 6.5,
      years: 3,
      granularity: 'yearly',
      real_value: 8256.11,
      absolute_loss: 1743.89,
      loss_percent: 17.44,
      series: [{ t: 1, years: 1, real_value: 9300, loss_percent: 7 }],
      client_ip: '127.0.0.1',
      user_agent: 'vitest',
    });
    expect(saved.id).toBeDefined();

    const found = await getInflationQueryById(saved.id);
    expect(found).toBeTruthy();
    expect(Number(found.amount_nominal)).toBe(10000);
  });

  it('getAllInflationQueries paginado', async () => {
    const res = await getAllInflationQueries({ limit: 10, offset: 0 });
    expect(Array.isArray(res.data)).toBe(true);
    expect(typeof res.total).toBe('number');
  });

  it('getQueryStatistics agrega métricas', async () => {
    const stats = await getQueryStatistics();
    expect(Number(stats.total_queries)).toBeGreaterThanOrEqual(1);
  });

  it('getRecentQueries y getQueriesByDateRange', async () => {
    const recent = await getRecentQueries(5);
    expect(Array.isArray(recent)).toBe(true);

    const start = new Date(Date.now() - 24 * 3600 * 1000);
    const end = new Date();
    const range = await getQueriesByDateRange(start, end);
    expect(Array.isArray(range)).toBe(true);
  });

  it('deleteOldQueries devuelve número', async () => {
    const deleted = await deleteOldQueries(0);
    expect(typeof deleted).toBe('number');
  });
});