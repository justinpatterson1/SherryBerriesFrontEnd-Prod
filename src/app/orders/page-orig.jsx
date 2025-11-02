// app/orders/page.tsx or pages/orders.tsx (depending on routing setup)
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader';
import Image from 'next/image';
import Pagination from '../components/Pagination';

function Page() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const getCartItem = item => {
    const arr = [];
    item.forEach(i => {
      if (i.ItemType === 'Jewelry') {
        arr.push({ info: i, item: i.jewelries[0] });
      }
      if (i.ItemType === 'Merchandise') {
        arr.push({ info: i, item: i.merchandises[0] });
      }
      if (i.ItemType === 'Waistbead') {
        arr.push({ info: i, item: i.waistbeads[0] });
      }
      if (i.ItemType === 'Aftercare') {
        arr.push({ info: i, item: i.aftercares[0] });
      }
    });
    return arr;
  };

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchOrders = async() => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders?populate[0]=cart.Items&populate[1]=cart.Items.jewelries.image&populate[2]=cart.Items.waistbeads.image&populate[3]=cart.Items.merchandises.image&populate[4]=cart.Items.aftercares.image&populate[5]=cart.User&pagination[page]=${page}&pagination[pageSize]=5&filters[cart][User][documentId][$eq]=${session?.user?.documentId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log('Got data: ' + JSON.stringify(data));

          if (data.data.length !== 0) {
            data.data.map((item, index) => {
              console.log(index);
              const cart = getCartItem(item.cart.Items);

              data.data[index].newCart = cart;
            });
            setOrders(data);
            setLoading(false);
          } else {
            setOrders([]);
            setLoading(false);
            setPage(1);
          }
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };

    fetchOrders();
  }, [page]);

  if (loading) return <Loader />;
  return (
    <div className='bg-[#ffefef] py-5 min-h-screen '>
      <div className='p-6 max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Your Orders</h1>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className='space-y-6'>
            {orders.data.map(order => (
              <div
                key={order.id}
                className='border rounded-lg p-4 shadow-sm bg-white'
              >
                <div className='flex flex-col md:flex-row justify-between gap-4 mb-4'>
                  <div>
                    <p className='font-semibold'>Order ID:</p>
                    <p>{order.orderId}</p>
                  </div>
                  <div>
                    <p className='font-semibold'>Date:</p>
                    <p>{order.date}</p>
                  </div>
                  <div>
                    <p className='font-semibold'>Status:</p>
                    <p className='capitalize text-blue-600'>
                      {order.order_status}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  <div>
                    <p className='font-semibold'>Payment Method:</p>
                    <p>
                      {order.paymentType === 'C.O.D'
                        ? 'Cash On Delivery'
                        : order.paymentType === 'CC'
                          ? 'Credit Card'
                          : ''}
                    </p>
                  </div>
                  <div>
                    <p className='font-semibold'>Shipping Method:</p>
                    <p>{order.shipping_method}</p>
                  </div>
                </div>

                {/* Optional: show ordered items */}
                {order.newCart?.length > 0 && (
                  <div className='mt-4'>
                    <p className='font-semibold mb-2'>Items:</p>
                    <ul className='list-disc pl-5 text-sm'>
                      {order.newCart.map((item, index) => {
                        const isMerch = item?.item?.ItemType === 'Merchandise';
                        const merchImage =
                          item?.item?.image?.[0]?.formats?.thumbnail;
                        const defaultImage =
                          item?.item?.image?.formats?.thumbnail;

                        const imageSrc = isMerch
                          ? `${merchImage?.url}`
                          : `${defaultImage?.url}`;

                        const imageWidth = isMerch
                          ? merchImage?.width || 100
                          : defaultImage?.width || 100;
                        const imageHeight = isMerch
                          ? merchImage?.height || 100
                          : defaultImage?.height || 100;

                        return (
                          <li
                            key={index}
                            className='flex items-center gap-4 mb-4'
                          >
                            {imageSrc && (
                              <Image
                                src={imageSrc}
                                width={imageWidth}
                                height={imageHeight}
                                alt={item?.item?.name || 'Product Image'}
                                className='rounded-md object-cover'
                              />
                            )}

                            <div>
                              <p className='font-semibold'>
                                {item?.item?.name || item?.item?.Name}
                              </p>
                              <p className='text-sm text-gray-600'>
                                Quantity: {item?.info?.quantity}
                              </p>
                              <p className='text-sm text-gray-600'>
                                Price: ${item?.item?.price}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination page={page} setPage={setPage} />
    </div>
  );
}

export default Page;
