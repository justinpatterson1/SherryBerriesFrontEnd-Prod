/**
 * Reusable Strapi response shapes for tests.
 */

export const mockJewelryItem = {
  id: 1,
  documentId: 'jewelry-1',
  name: 'Test Necklace',
  price: 50,
  discount: 0,
  color: 'Gold',
  image: { url: 'https://example.com/test.jpg', formats: { thumbnail: { url: 'https://example.com/thumb.jpg' } } }
};

export const mockOrder = {
  id: 1,
  documentId: 'order-1',
  orderId: 'oid_test123',
  order_status: 'open',
  paymentType: 'CC',
  shipping_method: 'courier',
  shipping_address: '123 Test St,Port of Spain,Trinidad',
  phone: '18681234567',
  subtotal: 100,
  isPaid: true,
  date: '2026-04-18',
  createdAt: '2026-04-18T00:00:00Z',
  cart: { documentId: 'cart-1', User: { firstName: 'Test', lastName: 'User' }, Items: [] },
  newCart: []
};

export const mockCoupon = {
  valid: true,
  discountType: 'percentage',
  discountValue: 10
};
