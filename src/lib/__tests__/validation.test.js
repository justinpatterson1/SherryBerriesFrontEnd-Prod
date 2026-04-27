import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  orderConfirmationSchema,
  contactEmailSchema,
  subscribeSchema,
  couponSchema,
  validateBody
} from '../validation';

describe('emailSchema', () => {
  it('accepts valid email', () => {
    expect(emailSchema.safeParse('test@example.com').success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });
});

describe('orderConfirmationSchema', () => {
  const valid = {
    email: 'a@b.com',
    orderId: 'oid_x',
    order: { cart: [{ item: { name: 'x' }, info: { quantity: 1 } }] }
  };

  it('accepts valid order confirmation body', () => {
    expect(orderConfirmationSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects missing orderId', () => {
    // eslint-disable-next-line no-unused-vars
    const { orderId: _orderId, ...rest } = valid;
    expect(orderConfirmationSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects when cart is not an array', () => {
    expect(orderConfirmationSchema.safeParse({ ...valid, order: { cart: 'nope' } }).success).toBe(false);
  });
});

describe('contactEmailSchema', () => {
  it('accepts valid contact form', () => {
    const result = contactEmailSchema.safeParse({
      name: 'Test',
      email: 'a@b.com',
      message: 'Hello there'
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = contactEmailSchema.safeParse({ name: '', email: 'a@b.com', message: 'hi' });
    expect(result.success).toBe(false);
  });

  it('rejects message over 5000 chars', () => {
    const result = contactEmailSchema.safeParse({
      name: 'a',
      email: 'a@b.com',
      message: 'x'.repeat(5001)
    });
    expect(result.success).toBe(false);
  });
});

describe('subscribeSchema', () => {
  it('accepts valid email', () => {
    expect(subscribeSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
  });

  it('rejects missing email', () => {
    expect(subscribeSchema.safeParse({}).success).toBe(false);
  });
});

describe('couponSchema', () => {
  it('accepts valid coupon code', () => {
    expect(couponSchema.safeParse({ code: 'SAVE10' }).success).toBe(true);
  });

  it('rejects empty code', () => {
    expect(couponSchema.safeParse({ code: '' }).success).toBe(false);
  });

  it('rejects code over 50 chars', () => {
    expect(couponSchema.safeParse({ code: 'x'.repeat(51) }).success).toBe(false);
  });
});

describe('validateBody', () => {
  it('returns data on success', () => {
    const result = validateBody({ code: 'SAVE10' }, couponSchema);
    expect(result.error).toBeNull();
    expect(result.data.code).toBe('SAVE10');
  });

  it('returns 400 Response on failure', async() => {
    const result = validateBody({}, couponSchema);
    expect(result.data).toBeNull();
    expect(result.error.status).toBe(400);
    const body = await result.error.json();
    expect(body.error).toBe('Invalid request');
  });
});
