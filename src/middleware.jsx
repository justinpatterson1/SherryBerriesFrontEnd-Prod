import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/sign-in' // Redirect here if not authenticated
  }
});

export const config = {
  matcher: [
    '/cart',
    '/checkout',
    '/dashboard',
    '/orders',
    '/checkout/thank-you'
  ], // Protect specific routes
  runtime: 'nodejs' // ← this is key!
};

// export async function session(req) {
//   const session = await getServerSession(authOptions);

//   console.log("🔍 Middleware Session:", session);
//   return Response.next()
// }
