'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiPackage, FiTrendingUp, FiClock, FiEye, FiTruck, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { getCartItem } from '../lib/func';

function Page() {
  const { data: session, status } = useSession();

  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  // Fetch orders - simplified version that matches your original structure
  const fetchOrders = async () => {
    if (status !== 'authenticated') return;
    
    setLoading(true);
    setError(null);
    
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

        if (data.data && data.data.length !== 0) {
          data.data.map((item, index) => {
            const cart = getCartItem(item.cart.Items || []);
            data.data[index].newCart = cart;
          });
          setOrders(data);
        } else {
          setOrders([]);
          setPage(1);
        }
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when dependencies change
  useEffect(() => {
    fetchOrders();
  }, [page]);

  // Show error state
  if (error) {
    return (
      <div className="bg-brand-light py-5 min-h-screen">
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchOrders()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) return <Loader />;

  return (
    <div className="bg-brand-light py-5 min-h-screen">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.data.map(order => (
              <div
                key={order.id}
                className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.order_status === 'open' ? 'bg-blue-100 text-blue-800' :
                      order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.order_status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.order_status === 'open' && <FiClock className="h-3 w-3" />}
                      {order.order_status === 'shipped' && <FiTruck className="h-3 w-3" />}
                      {order.order_status === 'delivered' && <FiCheckCircle className="h-3 w-3" />}
                      {order.order_status === 'pending' && <FiClock className="h-3 w-3" />}
                      {order.order_status?.charAt(0).toUpperCase() + order.order_status?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-lg font-bold text-brand">${order.subtotal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="text-sm text-gray-900">
                      {order.paymentType === 'C.O.D' ? 'Cash On Delivery' :
                       order.paymentType === 'CC' ? 'Credit Card' :
                       order.paymentType === 'BT' ? 'Bank Transfer' : order.paymentType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shipping</p>
                    <p className="text-sm text-gray-900">{order.shipping_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="text-sm text-gray-900">{order.newCart?.length || 0}</p>
                  </div>
                </div>

                {/* Order Items */}
                {order.newCart?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.newCart.map((item, index) => {
                        const isMerch = item?.item?.ItemType === 'Merchandise';
                        const imageSrc = isMerch
                          ? item?.item?.image?.[0]?.formats?.thumbnail?.url
                          : item?.item?.image?.formats?.thumbnail?.url;

                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            {imageSrc && (
                              <Image
                                src={imageSrc}
                                width={60}
                                height={60}
                                alt={item?.item?.name || item?.item?.Name || 'Product'}
                                className="rounded-md object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {item?.item?.name || item?.item?.Name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item?.info?.quantity} × ${item?.item?.price}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                ${(item?.info?.quantity * item?.item?.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
