import { getServerSession } from 'next-auth/next';
import { authOptions } from '../app/api/auth/[...nextauth]/options';

export default async function fetchOrders() {
  const session = await getServerSession(authOptions);
  const results = await fetch(
    `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders?populate[0]=cart.Items&populate[1]=cart.Items.jewelries.image&populate[2]=cart.Items.waistbeads.image&populate[3]=cart.Items.merchandises.image&filters[isPaid][$eq]=false`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.user.jwt}`, // ✅ Correctly use JWT from session
        'Content-Type': 'application/json'
      }
    }
  );

  return results;
}
