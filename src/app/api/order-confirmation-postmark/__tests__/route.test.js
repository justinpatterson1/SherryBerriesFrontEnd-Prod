import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockSession } from '@/test/mocks/session';

vi.mock('@/lib/auth', () => ({
  requireAuth: vi.fn()
}));

const { mockSendEmail } = vi.hoisted(() => ({ mockSendEmail: vi.fn() }));

vi.mock('postmark', () => ({
  ServerClient: function ServerClient() {
    return { sendEmail: mockSendEmail };
  }
}));

vi.mock('../../../../utils/emailTemplates', () => ({
  generateOrderConfirmationTemplate: vi.fn(() => '<html>email</html>'),
  generatePlainTextOrderConfirmation: vi.fn(() => 'plain text email')
}));

import { POST } from '../route';
import { requireAuth } from '@/lib/auth';

describe('POST /api/order-confirmation-postmark', () => {
  beforeEach(() => {
    requireAuth.mockResolvedValue({ session: mockSession, unauthorized: null });
    mockSendEmail.mockReset();
  });

  function makeRequest(body) {
    return { json: () => Promise.resolve(body) };
  }

  const validBody = {
    email: 'customer@example.com',
    orderId: 'oid_test123',
    order: {
      firstName: 'Test',
      lastName: 'User',
      cart: [{
        item: { name: 'Test Item', price: 50 },
        info: { quantity: 2, ItemType: 'Jewelry' }
      }]
    }
  };

  it('returns 401 when unauthenticated', async () => {
    requireAuth.mockResolvedValueOnce({
      session: null,
      unauthorized: Response.json({ error: 'Unauthorized' }, { status: 401 })
    });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(401);
  });

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ orderId: 'oid_x', order: { cart: [] } }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when orderId is missing', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com', order: { cart: [] } }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await POST(makeRequest({ ...validBody, email: 'not-an-email' }));
    expect(res.status).toBe(400);
  });

  it('sends email and returns success on valid input', async () => {
    mockSendEmail.mockResolvedValueOnce({ MessageID: 'msg-123' });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.messageId).toBe('msg-123');
    expect(mockSendEmail).toHaveBeenCalledOnce();
  });

  it('returns 500 when Postmark throws', async () => {
    mockSendEmail.mockRejectedValueOnce(new Error('Postmark down'));

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
  });
});
