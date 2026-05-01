import { api } from '../api-client';

const ITEMS_POPULATE = [
  'populate[Items][populate][jewelries][populate][image]=true',
  'populate[Items][populate][merchandises][populate][image]=true',
  'populate[Items][populate][waistbeads][populate][image]=true',
  'populate[Items][populate][aftercares][populate][image]=true'
].join('&');

const PARENT_ITEMS_POPULATE = [
  'populate[0]=Items.jewelries',
  'populate[1]=Items.merchandises',
  'populate[2]=Items.waistbeads',
  'populate[3]=Items.aftercares'
].join('&');

export function getActiveCart(userDocumentId, token, opts) {
  const path =
    `/api/cart-items?filters[User][documentId][$eq]=${userDocumentId}` +
    `&filters[isCompleted][$eq]=false&filters[active][$eq]=true&${ITEMS_POPULATE}`;
  return api.get(path, { token, ...opts });
}

export function getCartByIdWithItems(cartId, token, opts) {
  const path =
    `/api/cart-items/${cartId}?${PARENT_ITEMS_POPULATE}` +
    '&filters[isCompleted][$eq]=false&filters[active][$eq]=true';
  return api.get(path, { token, ...opts });
}

export function createCart(payload, token, opts) {
  return api.post('/api/cart-items', payload, { token, ...opts });
}

export function updateCart(cartId, payload, token, opts) {
  return api.put(`/api/cart-items/${cartId}`, payload, { token, ...opts });
}

export function findCartCoupon(userDocumentId, code, token, opts) {
  const path =
    '/api/cart-items' +
    `?filters[User][documentId][$eq]=${userDocumentId}&filters[code][$eq]=${code}`;
  return api.get(path, { token, ...opts });
}
