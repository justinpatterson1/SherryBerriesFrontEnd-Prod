/**
 * Shared constants used across the application.
 * Import from here instead of hardcoding values in components.
 */

// -- Order statuses --
export const ORDER_STATUSES = {
  OPEN: 'open',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered'
};

// -- Status display config (color + label) --
export const STATUS_CONFIG = {
  [ORDER_STATUSES.OPEN]: {
    color: 'bg-blue-100 text-blue-800',
    label: 'Processing'
  },
  [ORDER_STATUSES.PENDING]: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending Payment'
  },
  [ORDER_STATUSES.SHIPPED]: {
    color: 'bg-purple-100 text-purple-800',
    label: 'Shipped'
  },
  [ORDER_STATUSES.DELIVERED]: {
    color: 'bg-green-100 text-green-800',
    label: 'Delivered'
  },
  [ORDER_STATUSES.CLOSED]: {
    color: 'bg-green-100 text-green-800',
    label: 'Completed'
  },
  [ORDER_STATUSES.CANCELLED]: {
    color: 'bg-red-100 text-red-800',
    label: 'Cancelled'
  }
};

export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG[ORDER_STATUSES.OPEN];
}

// -- Product categories --
export const PRODUCT_CATEGORIES = ['Jewelry', 'Waistbeads', 'Clothing', 'Aftercare'];

// -- Jewelry sizes --
export const JEWELRY_SIZES = [14, 16, 18, 20, 22];

// -- Pagination --
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12
};

// -- Sender emails --
export const SENDER_EMAILS = {
  ORDERS: 'orders@sherry-berries.com',
  INFO: 'info@sherry-berries.com'
};
