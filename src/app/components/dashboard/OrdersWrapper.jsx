// components/dashboard/OrdersWrapper.jsx (Server Component)
import Orders from './Orders'; // Import the Server Component
import { auth } from '../../lib/auth'; // ✅ Import the NextAuth authentication function

const OrdersWrapper = async() => {
  // Get session on the server
  const session = await auth();


  if (!session) {
    return <div>Please log in to view orders.</div>;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders?populate[0]=cart.Items&populate[1]=cart.Items.jewelries.image&populate[2]=cart.Items.waistbeads.image&populate[3]=cart.Items.merchandises.image&filters[isPaid][$eq]=false`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.user.jwt}`, // ✅ Correctly use JWT from session
        'Content-Type': 'application/json'
      }
    }
  );

  const data = await response.json();

  return <Orders data={data} />;
};

export default OrdersWrapper;
