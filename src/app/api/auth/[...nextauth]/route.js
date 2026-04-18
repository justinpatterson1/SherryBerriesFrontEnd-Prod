import NextAuth from 'next-auth';
import { authOptions } from './options';
import { createRateLimiter } from '../../../../lib/rate-limit';

const handler = NextAuth(authOptions);
const limiter = createRateLimiter({ windowMs: 60_000, max: 5 });

export { handler as GET };

export async function POST(req, context) {
  const limited = limiter(req);
  if (limited) return limited;
  return handler(req, context);
}
