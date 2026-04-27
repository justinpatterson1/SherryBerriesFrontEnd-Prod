import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockSession } from '@/test/mocks/session';

vi.mock('@/lib/auth', () => ({
  requireAuth: vi.fn()
}));

vi.mock('../../../../../../lib/paypalClient', () => ({
  captureOrder: vi.fn()
}));

import { POST } from '../route';
import { requireAuth } from '@/lib/auth';
import { captureOrder } from '../../../../../../lib/paypalClient';

describe('POST /api/paypal/orders/[OrderID]/capture', () => {
  beforeEach(() => {
    requireAuth.mockResolvedValue({ session: mockSession, unauthorized: null });
  });

  it('returns 401 when unauthenticated', async () => {
    requireAuth.mockResolvedValueOnce({
      session: null,
      unauthorized: Response.json({ error: 'Unauthorized' }, { status: 401 })
    });

    const res = await POST({}, { params: { OrderID: 'PAYPAL-ORDER-123' } });
    expect(res.status).toBe(401);
  });

  it('returns 400 when OrderID is missing', async () => {
    const res = await POST({}, { params: {} });
    expect(res.status).toBe(400);
  });

  it('captures the order and returns success', async () => {
    captureOrder.mockResolvedValueOnce({
      jsonResponse: { id: 'PAYPAL-ORDER-123', status: 'COMPLETED' },
      httpStatusCode: 201
    });

    const res = await POST({}, { params: { OrderID: 'PAYPAL-ORDER-123' } });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.status).toBe('COMPLETED');
    expect(captureOrder).toHaveBeenCalledWith('PAYPAL-ORDER-123');
  });

  it('returns 500 when capture throws', async () => {
    captureOrder.mockRejectedValueOnce(new Error('Capture failed'));

    const res = await POST({}, { params: { OrderID: 'PAYPAL-ORDER-123' } });
    expect(res.status).toBe(500);
  });
});
