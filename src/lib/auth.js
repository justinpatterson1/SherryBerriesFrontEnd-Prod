import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

/**
 * Checks for a valid NextAuth session. Returns the session on success,
 * or a 401 Response that the caller can return directly.
 *
 * Usage in an API route:
 *   const { session, unauthorized } = await requireAuth();
 *   if (unauthorized) return unauthorized;
 *   // session is guaranteed to exist here
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      session: null,
      unauthorized: Response.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }
  return { session, unauthorized: null };
}
