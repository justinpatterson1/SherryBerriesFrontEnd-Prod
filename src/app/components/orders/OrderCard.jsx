'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiRefreshCw,
  FiMapPin,
  FiCreditCard,
  FiCalendar
} from 'react-icons/fi';
import Button from '../ui/Button';
import { getStatusConfig as getSharedStatusConfig } from '@/lib/constants';

const STATUS_ICONS = {
  open: FiClock,
  pending: FiClock,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  closed: FiCheckCircle,
  cancelled: FiPackage
};

const PAYMENT_LABELS = {
  'C.O.D': 'Cash on Delivery',
  CC: 'Credit Card',
  BT: 'Bank Transfer'
};

const SHIPPING_LABELS = {
  ttpost: 'TT Post',
  courier: 'Courier',
  DHL: 'DHL Express'
};

const OrderCard = ({ order, onTrackOrder, onReorder }) => {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = useMemo(() => {
    const shared = getSharedStatusConfig(order.order_status);
    return { ...shared, icon: STATUS_ICONS[order.order_status] || FiClock };
  }, [order.order_status]);

  const StatusIcon = statusConfig.icon;
  const paymentLabel = PAYMENT_LABELS[order.paymentType] || order.paymentType;
  const shippingLabel = SHIPPING_LABELS[order.shipping_method] || order.shipping_method;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Order Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.orderId}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                aria-label={`Order status: ${statusConfig.label}`}
              >
                <StatusIcon className="h-3 w-3" aria-hidden='true' />
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <FiCalendar className="h-4 w-4" />
                <span>{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiCreditCard className="h-4 w-4" />
                <span>{paymentLabel}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              icon={expanded ? FiEye : FiEye}
            >
              {expanded ? 'Hide Details' : 'View Details'}
            </Button>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-xl font-bold text-brand">
              ${order.subtotal}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 mb-1">Items</p>
            <p className="text-lg font-semibold text-gray-900">
              {order.newCart?.length || 0}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 mb-1">Shipping</p>
            <p className="text-lg font-semibold text-gray-900">
              {shippingLabel}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-sm font-mono text-gray-600">
              {order.orderId}
            </p>
          </div>
        </div>

        {/* Order Actions */}
        <div className="flex flex-wrap gap-2">
          {order.order_status === 'shipped' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onTrackOrder(order.orderId)}
              icon={FiTruck}
            >
              Track Order
            </Button>
          )}
          
          {order.order_status === 'delivered' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReorder(order)}
              icon={FiRefreshCw}
            >
              Reorder
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipping Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiMapPin className="h-4 w-4" />
                Shipping Address
              </h4>
              <div className="text-sm text-gray-600">
                <p>{order.shipping_address}</p>
                <p className="mt-1">Phone: {order.phone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiPackage className="h-4 w-4" />
                Order Items
              </h4>
              <div className="space-y-3">
                {order.newCart?.map((item, index) => {
                  const isMerch = item?.item?.ItemType === 'Merchandise';
                  const imageSrc = isMerch
                    ? item?.item?.image?.[0]?.formats?.thumbnail?.url
                    : item?.item?.image?.formats?.thumbnail?.url;
                  const itemKey = item?.item?.documentId || item?.item?.id || `${order.orderId}-${index}`;

                  return (
                    <div key={itemKey} className="flex items-center gap-3 p-3 bg-white rounded-lg">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
