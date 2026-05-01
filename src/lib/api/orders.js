import { api } from '../api-client';
import { PAGINATION } from '../constants';

const ORDERS_POPULATE = [
  'populate[0]=cart.Items',
  'populate[1]=cart.Items.jewelries.image',
  'populate[2]=cart.Items.waistbeads.image',
  'populate[3]=cart.Items.merchandises.image',
  'populate[4]=cart.Items.aftercares.image',
  'populate[5]=cart.User'
].join('&');

export function getOrdersByStatus({ token, orderStatus, page, signal }) {
  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;
  const path =
    `/api/orders?${ORDERS_POPULATE}` +
    `&filters[order_status][$eq]=${orderStatus}` +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  return api.get(path, { token, signal });
}

export function getOrdersForUser({ token, userDocumentId, page, pageSize = 5 }) {
  const path =
    `/api/orders?${ORDERS_POPULATE}` +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}` +
    `&filters[cart][User][documentId][$eq]=${userDocumentId}`;
  return api.get(path, { token });
}

export function getUnpaidOrders({ token, includeAftercare = true } = {}) {
  const populates = [
    'populate[0]=cart.Items',
    'populate[1]=cart.Items.jewelries.image',
    'populate[2]=cart.Items.waistbeads.image',
    'populate[3]=cart.Items.merchandises.image'
  ];
  if (includeAftercare) populates.push('populate[4]=cart.Items.aftercares.image');
  const path = `/api/orders?${populates.join('&')}&filters[isPaid][$eq]=false`;
  return api.get(path, { token });
}

export function getOrderByOrderId(orderId, token) {
  const path =
    `/api/orders?populate[0]=cart.Items.aftercares.image` +
    '&populate[1]=cart.Items.jewelries.image' +
    '&populate[2]=cart.Items.waistbeads.image' +
    '&populate[3]=cart.Items.merchandises.image' +
    `&filters[orderId][$eq]=${orderId}`;
  return api.get(path, { token });
}

export function updateOrder(orderDocumentId, data, token) {
  return api.put(`/api/orders/${orderDocumentId}`, { data }, { token });
}

export function createOrder(payload, token) {
  return api.post('/api/orders', payload, { token });
}

export function updateOrderStatus(orderId, status, token) {
  return api.put(`/api/orders/${orderId}`, { data: { order_status: status } }, { token });
}
