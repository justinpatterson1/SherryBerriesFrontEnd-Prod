import { z } from 'zod';

/**
 * Shared Zod schemas for API route input validation.
 *
 * Usage:
 *   import { orderConfirmationSchema } from '@/lib/validation';
 *   const result = orderConfirmationSchema.safeParse(body);
 *   if (!result.success) return Response.json({ error: 'Invalid request', details: result.error.flatten() }, { status: 400 });
 */

// -- Reusable primitives --

export const emailSchema = z.string().email('Invalid email address');

// -- Route schemas --

export const orderConfirmationSchema = z.object({
  email: z.string().email(),
  orderId: z.string().min(1, 'orderId is required'),
  order: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    date: z.string().optional(),
    subtotal: z.union([z.string(), z.number()]).optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    shippingLocation: z.string().optional(),
    phone: z.string().optional(),
    cart: z.array(z.object({
      item: z.object({
        name: z.string(),
        price: z.union([z.string(), z.number()]).optional(),
        image: z.any().optional()
      }),
      info: z.object({
        quantity: z.union([z.string(), z.number()]),
        ItemType: z.string().optional()
      }).optional(),
      quantity: z.union([z.string(), z.number()]).optional()
    }))
  })
});

export const contactEmailSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(5000)
});

export const subscribeSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(50)
});

export const paypalOrderSchema = z.object({
  cart: z.any()
});

export const paypalCaptureParamsSchema = z.object({
  OrderID: z.string().min(1, 'OrderID is required')
});

/**
 * Helper to validate a request body against a schema.
 * Returns { data, error } where error is a Response to return directly.
 */
export function validateBody(body, schema) {
  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      data: null,
      error: Response.json(
        { error: 'Invalid request', details: result.error.flatten() },
        { status: 400 }
      )
    };
  }
  return { data: result.data, error: null };
}
