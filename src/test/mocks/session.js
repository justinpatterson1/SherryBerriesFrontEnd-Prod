/**
 * Mock NextAuth session objects for tests.
 */

export const mockSession = {
  user: {
    id: 1,
    email: 'test@sherryberries.com',
    username: 'testuser',
    firstname: 'Test',
    lastname: 'User',
    role_type: 'customer',
    documentId: 'test-doc-id'
  },
  jwt: 'mock-jwt-token',
  expires: '2099-12-31T23:59:59.999Z'
};

export const mockAdminSession = {
  ...mockSession,
  user: { ...mockSession.user, role_type: 'admin' }
};

export const noSession = null;
