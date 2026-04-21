'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Loader from '../../components/Loader';
import Pagination from '../Pagination';

function Orders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState('open');
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [page, setPage] = useState(1);

  const toggleOrder = orderId => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const completeOrder = async id => {
    setLoading(true);
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${session.jwt}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              order_status: 'closed'
            }
          })
        }
      );

      if (result.ok) {
        setOrders(prevOrders =>
          prevOrders.filter(order => order.documentId !== id)
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async id => {
    setLoading(true);
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${session.jwt}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              order_status: 'cancelled'
            }
          })
        }
      );

      if (result.ok) {
        setOrders(prevOrders =>
          prevOrders.filter(order => order.documentId !== id)
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.jwt) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders?populate[0]=cart.Items&populate[1]=cart.Items.jewelries.image&populate[2]=cart.Items.waistbeads.image&populate[3]=cart.Items.merchandises.image&populate[4]=cart.Items.aftercares.image&populate[5]=cart.User&filters[order_status][$eq]=${orderStatus}&pagination[page]=${page}&pagination[pageSize]=10`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.jwt}`,
            'Content-Type': 'application/json'
          }
        }
      )
        .then(res => res.json())
        .then(json => {
          if (json?.data.length !== 0) {
            setOrders(json.data);
          } else {
            setOrders([]);
          }

          // if(json?.data.length ==0 && page > 1 ){

          //   setPage((prev) => prev - 1)
          // } else {

          // }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [orderStatus, page]);

  if (status === 'loading') return <p>Loading session...</p>;
  if (loading) return <Loader />;

  return (
    <div className='min-h-screen p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Order Management</h1>
        <p className='text-gray-600'>Manage and track all customer orders</p>
      </div>

      {/* Order Status Buttons */}
      <div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Filter Orders</h2>
        <div className='flex flex-wrap gap-3'>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              orderStatus === 'open' 
                ? 'bg-brand text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setOrderStatus('open')}
          >
            Open Orders
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              orderStatus === 'closed' 
                ? 'bg-brand text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setOrderStatus('closed')}
          >
            Completed
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              orderStatus === 'cancelled'
                ? 'bg-brand text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setOrderStatus('cancelled');
              setPage(1);
            }}
          >
            Cancelled
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              orderStatus === 'pending' 
                ? 'bg-brand text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setOrderStatus('pending');
              setPage(1);
            }}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className='space-y-6'>
        {orders.length > 0 ? (
          orders.map(order => (
            <div
              key={order?.id}
              className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'
            >
              {/* Header */}
              <div
                className='cursor-pointer grid grid-cols-1 sm:grid-cols-4 gap-4 items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300'
                onClick={() => toggleOrder(order?.id)}
              >
                <div>
                  <p className='text-sm text-gray-500'>Order ID</p>
                  <p className='font-semibold text-gray-900'>#{order?.orderId}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Customer</p>
                  <p className='font-medium text-gray-900'>
                    {order?.cart?.User?.firstName} {order?.cart?.User?.lastName}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Date</p>
                  <p className='font-medium text-gray-900'>
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Status</p>
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                    order.order_status === 'closed' ? 'bg-green-100 text-green-800' :
                    order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.order_status || 'Open'}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrderId === order.id && (
                <div className='p-6 border-t border-gray-200 bg-gray-50'>
                  <div className='grid grid-cols-2'>
                    <div>
                      <h3 className='font-semibold mb-3'>Cart Items:</h3>
                      <ul className='space-y-4'>
                        {order.cart?.Items?.map((item, index) => {
                          const commonClasses =
                            'flex flex-col sm:flex-row gap-4 items-start';
                          const imgWrapper = 'w-full sm:w-[100px]';

                          if (item.ItemType === 'Waistbead') {
                            return (
                              <li key={index} className={commonClasses}>
                                <div className={imgWrapper}>
                                  <Image
                                    src={
                                      item?.waistbeads[0]?.image?.formats
                                        ?.thumbnail?.url
                                    }
                                    width={
                                      item?.waistbeads[0]?.image?.formats
                                        ?.thumbnail?.width || 100
                                    }
                                    height={
                                      item?.waistbeads[0]?.image?.formats
                                        ?.thumbnail?.height || 100
                                    }
                                    alt='Waistbead'
                                    className='rounded-md object-cover'
                                  />
                                </div>
                                <div className='flex flex-col text-sm sm:text-base'>
                                  {item.waistbeads[0].Name} - {item.quantity}{' '}
                                  pcs
                                  <span>Size: {item.waistbeadSize} inches</span>
                                  <span>
                                    Cost: {item.waistbeads[0].price.toFixed(2)}
                                  </span>
                                </div>
                              </li>
                            );
                          }

                          if (item.ItemType === 'Merchandise') {
                            return (
                              <li key={index} className={commonClasses}>
                                <div className={imgWrapper}>
                                  <Image
                                    src={
                                      item?.merchandises[0]?.image[0]?.formats
                                        ?.thumbnail?.url
                                    }
                                    width={
                                      item?.merchandises[0]?.image[0]?.formats
                                        ?.thumbnail?.width || 100
                                    }
                                    height={
                                      item?.merchandises[0]?.image[0]?.formats
                                        ?.thumbnail?.height || 100
                                    }
                                    alt='Merchandise'
                                    className='rounded-md object-cover'
                                  />
                                </div>
                                <div className='flex flex-col text-sm sm:text-base'>
                                  <span className='font-bold'>
                                    {item.merchandises[0].name} -{' '}
                                    {item.quantity} pcs
                                  </span>
                                  <span>
                                    Color: {item.merchandises[0].color}
                                  </span>
                                  <span>
                                    Discount: {item.merchandises[0].discount}
                                  </span>
                                  <span>
                                    Cost:{' '}
                                    {item.merchandises[0].price.toFixed(2)}
                                  </span>
                                </div>
                              </li>
                            );
                          }

                          if (item.ItemType === 'Jewelry') {
                            return (
                              <li key={index} className={commonClasses}>
                                <div className={imgWrapper}>
                                  <Image
                                    src={
                                      item?.jewelries[0]?.image?.formats
                                        ?.thumbnail?.url
                                    }
                                    width={
                                      item?.jewelries[0]?.image?.formats
                                        ?.thumbnail?.width || 100
                                    }
                                    height={
                                      item?.jewelries[0]?.image?.formats
                                        ?.thumbnail?.height || 100
                                    }
                                    alt='Jewelry'
                                    className='rounded-md object-cover'
                                  />
                                </div>
                                <div className='flex flex-col text-sm sm:text-base'>
                                  <span className='font-bold'>
                                    {item.jewelries[0].name} - {item.quantity}{' '}
                                    pcs
                                  </span>
                                  <span>Color: {item.jewelries[0].color}</span>
                                  <span>
                                    Discount: {item.jewelries[0].discount}
                                  </span>
                                  <span>
                                    Cost: {item.jewelries[0].price.toFixed(2)}
                                  </span>
                                </div>
                              </li>
                            );
                          }

                          if (item.ItemType === 'Aftercare') {
                            return (
                              <li key={index} className={commonClasses}>
                                <div className={imgWrapper}>
                                  <Image
                                    src={
                                      item?.aftercares[0]?.image?.formats
                                        ?.thumbnail?.url
                                    }
                                    width={
                                      item?.aftercares[0]?.image?.formats
                                        ?.thumbnail?.width || 100
                                    }
                                    height={
                                      item?.aftercares[0]?.image?.formats
                                        ?.thumbnail?.height || 100
                                    }
                                    alt='Jewelry'
                                    className='rounded-md object-cover'
                                  />
                                </div>
                                <div className='flex flex-col text-sm sm:text-base'>
                                  <span className='font-bold'>
                                    {item.aftercares[0].name} - {item.quantity}{' '}
                                    pcs
                                  </span>
                                  <span>
                                    Discount:{' '}
                                    {item.aftercares[0].discount
                                      ? item.aftercares[0].discount
                                      : 0}
                                  </span>
                                  <span>
                                    Cost: {item.aftercares[0].price.toFixed(2)}
                                  </span>
                                </div>
                              </li>
                            );
                          }

                          return <li key={index}>Unknown Item</li>;
                        })}
                      </ul>
                    </div>

                    <div className=' p-4 space-y-2 text-md text-gray-700'>
                      <p>
                        <span className='font-semibold'>Order ID:</span>{' '}
                        {order.orderId}
                      </p>
                      <p>
                        <span className='font-semibold'>Address:</span>{' '}
                        {order.shipping_address}
                      </p>
                      <p>
                        <span className='font-semibold'>Method:</span>{' '}
                        {order.shipping_method}
                      </p>
                      <p>
                        <span className='font-semibold'>Paid:</span>{' '}
                        {order.isPaid ? 'Yes' : 'No'}
                      </p>
                      <p>
                        <span className='font-semibold'>Payment Type:</span>{' '}
                        {order.paymentType}
                      </p>
                      {order.phone && (
                        <p>
                          <span className='font-semibold'>Phone:</span>{' '}
                          {order.phone}
                        </p>
                      )}
                      <p>
                        <span className='font-semibold'>Total:</span>{' '}
                        {order?.subtotal}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className={`mt-6 ${
                      orderStatus !== 'closed' && orderStatus !== 'cancelled'
                        ? 'flex flex-col sm:flex-row gap-4 justify-end'
                        : 'hidden'
                    }`}
                  >
                    <button
                      className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md'
                      onClick={() => completeOrder(order.documentId)}
                    >
                      Mark Complete
                    </button>
                    <button
                      className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md'
                      onClick={() => cancelOrder(order.documentId)}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>No Orders Found</h3>
            <p className='text-gray-500'>There are no orders with the selected status.</p>
          </div>
        )}
      </div>
      <div className='mt-10'>
        <Pagination page={page} setPage={setPage} length={orders.length} />
      </div>
    </div>
  );
}

export default Orders;
