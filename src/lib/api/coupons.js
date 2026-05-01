import { api } from '../api-client';

export function findCouponByCode(code, token) {
  return api.get(`/api/coupons?filters[code][$eq]=${code}`, { token });
}
