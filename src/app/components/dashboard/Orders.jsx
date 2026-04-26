'use client';

import React, { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '../../components/Loader';
import Pagination from '../Pagination';
import OrderFilters from './OrderFilters';
import OrderRow from './OrderRow';
import { ORDER_STATUSES } from '@/lib/constants';
import { useOrders } from '../../hooks/useOrders';

function Orders() {
  const { data: session, status } = useSession();
  const [orderStatus, setOrderStatus] = useState(ORDER_STATUSES.OPEN);
  const [page, setPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const { orders, loading, updateOrderStatus } = useOrders({
    session,
    status,
    orderStatus,
    page
  });

  const toggleOrder = useCallback(orderId => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  }, []);

  const completeOrder = useCallback(
    id => updateOrderStatus(id, ORDER_STATUSES.CLOSED),
    [updateOrderStatus]
  );

  const cancelOrder = useCallback(
    id => updateOrderStatus(id, ORDER_STATUSES.CANCELLED),
    [updateOrderStatus]
  );

  const handleStatusChange = useCallback(newStatus => {
    setOrderStatus(newStatus);
    setPage(1);
    setExpandedOrderId(null);
  }, []);

  if (status === 'loading') return <p>Loading session...</p>;
  if (loading) return <Loader />;

  const showActions =
    orderStatus !== ORDER_STATUSES.CLOSED && orderStatus !== ORDER_STATUSES.CANCELLED;

  return (
    <div className='min-h-screen p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Order Management</h1>
        <p className='text-gray-600'>Manage and track all customer orders</p>
      </div>

      <OrderFilters orderStatus={orderStatus} onChange={handleStatusChange} />

      <div className='space-y-6'>
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderRow
              key={order.id}
              order={order}
              expanded={expandedOrderId === order.id}
              onToggle={toggleOrder}
              onComplete={completeOrder}
              onCancel={cancelOrder}
              showActions={showActions}
            />
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
