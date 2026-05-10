import { api } from '../api-client';

const WISHLIST_POPULATE = [
  'populate[jewelries][populate]=image',
  'populate[aftercares][populate]=image',
  'populate[merchandises][populate]=image'
].join('&');

export function getUserWishlist({ userDocumentId, token, signal } = {}) {
  if (!userDocumentId) return Promise.resolve(null);
  const path =
    `/api/wishlists?filters[users_permissions_user][documentId][$eq]=${userDocumentId}` +
    `&${WISHLIST_POPULATE}`;
  return api.get(path, { token, signal });
}
