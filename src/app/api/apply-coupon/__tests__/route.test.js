import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockSession } from '@/test/mocks/session';

// Mock the auth helper
vi.mock('@/lib/auth', () => ({
  requireAuth: vi.fn()
}));

import { POST } from '../route';
import { requireAuth } from '@/lib/auth';

describe('POST /api/apply-coupon', () => {
  beforeEach(() => {
    requireAuth.mockResolvedValue({ session: mockSession, unauthorized: null });
    global.fetch = vi.fn();
  });

  function makeRequest(body) {
    return {
      json: () => Promise.resolve(body)
    };
  }

  it('returns 401 when unauthenticated', async () => {
    requireAuth.mockResolvedValueOnce({
      session: null,
      unauthorized: Response.json({ error: 'Unauthorized' }, { status: 401 })
    });

    const res = await POST(makeRequest({ code: 'SAVE10' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 when code is missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid request');
  });

  it('returns 400 when code is empty string', async () => {
    const res = await POST(makeRequest({ code: '' }));
    expect(res.status).toBe(400);
  });

  it('returns discount on valid code', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ valid: true, discountType: 'percentage', discountValue: 10 })
    });

    const res = await POST(makeRequest({ code: 'SAVE10' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.discount.discountValue).toBe(10);
  });

  it('forwards downstream error status from Strapi', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: 'Coupon not found' })
    });

    const res = await POST(makeRequest({ code: 'BADCODE' }));
    expect(res.status).toBe(404);
  });
});
