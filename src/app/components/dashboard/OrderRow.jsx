'use client';
import OrderItemList from './OrderItemList';
import { ORDER_STATUSES } from '@/lib/constants';

const STATUS_BADGE_CLASSES = {
  [ORDER_STATUSES.CLOSED]: 'bg-green-100 text-green-800',
  [ORDER_STATUSES.CANCELLED]: 'bg-red-100 text-red-800',
  [ORDER_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUSES.OPEN]: 'bg-blue-100 text-blue-800'
};

export default function OrderRow({
  order,
  expanded,
  onToggle,
  onComplete,
  onCancel,
  showActions
}) {
  const badgeClass = STATUS_BADGE_CLASSES[order.order_status] || STATUS_BADGE_CLASSES[ORDER_STATUSES.OPEN];

  return (
    <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
      {/* Header */}
      <div
        className='cursor-pointer grid grid-cols-1 sm:grid-cols-4 gap-4 items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300'
        onClick={() => onToggle(order.id)}
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
          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
            {order.order_status || 'Open'}
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className='p-6 border-t border-gray-200 bg-gray-50'>
          <div className='grid grid-cols-2'>
            <div>
              <h3 className='font-semibold mb-3'>Cart Items:</h3>
              <OrderItemList items={order.cart?.Items || []} />
            </div>
            <div className='p-4 space-y-2 text-md text-gray-700'>
              <p><span className='font-semibold'>Order ID:</span> {order.orderId}</p>
              <p><span className='font-semibold'>Address:</span> {order.shipping_address}</p>
              <p><span className='font-semibold'>Method:</span> {order.shipping_method}</p>
              <p><span className='font-semibold'>Paid:</span> {order.isPaid ? 'Yes' : 'No'}</p>
              <p><span className='font-semibold'>Payment Type:</span> {order.paymentType}</p>
              {order.phone && <p><span className='font-semibold'>Phone:</span> {order.phone}</p>}
              <p><span className='font-semibold'>Total:</span> {order?.subtotal}</p>
            </div>
          </div>

          {showActions && (
            <div className='mt-6 flex flex-col sm:flex-row gap-4 justify-end'>
              <button
                className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md'
                onClick={() => onComplete(order.documentId)}
              >
                Mark Complete
              </button>
              <button
                className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md'
                onClick={() => onCancel(order.documentId)}
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
