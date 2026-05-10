import { api } from '../api-client';
import { PAGINATION } from '../constants';

const DEFAULT_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

// Jewelry
export function getJewelryList({ page = 1, pageSize = DEFAULT_PAGE_SIZE, signal } = {}) {
  const path =
    '/api/jewelries?populate[0]=image&populate[1]=sizes' +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  return api.get(path, { signal });
}

export function getJewelryListPopulated({ page = 1, pageSize = DEFAULT_PAGE_SIZE, signal } = {}) {
  const path =
    '/api/jewelries?populate=*' +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  return api.get(path, { signal });
}

export function getFeaturedJewelries({ page = 1, pageSize = 8, signal } = {}) {
  const path =
    '/api/jewelries?populate=*' +
    '&filters[isFeatured][$eq]=true' +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  return api.get(path, { signal });
}

export function getJewelryById(id, { signal } = {}) {
  return api.get(`/api/jewelries/${id}?populate=*`, { signal });
}

export function getJewelryWithSizes(documentId, token) {
  return api.get(`/api/jewelries/${documentId}?populate[0]=sizes`, { token });
}

export function createJewelry(payload, token) {
  return api.post('/api/jewelries', payload, { token });
}

export function updateJewelry(documentId, data, token) {
  return api.put(`/api/jewelries/${documentId}`, { data }, { token });
}

// Merchandise (clothing)
export function getMerchandiseList({ page = 1, pageSize = DEFAULT_PAGE_SIZE, withSizes = false, signal } = {}) {
  const populate = withSizes
    ? 'populate[0]=image&populate[1]=sizes'
    : 'populate=*';
  const path =
    `/api/merchandises?${populate}` +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  return api.get(path, { signal });
}

export function getMerchandiseById(id, { signal } = {}) {
  return api.get(`/api/merchandises/${id}?populate=*`, { signal });
}

export function getMerchandiseWithSizes(documentId, token) {
  return api.get(`/api/merchandises/${documentId}?populate[0]=sizes`, { token });
}

export function createMerchandise(payload, token) {
  return api.post('/api/merchandises', payload, { token });
}

export function updateMerchandise(documentId, data, token) {
  return api.put(`/api/merchandises/${documentId}`, { data }, { token });
}

// Waistbeads
export function getWaistbeadsList({ page = 1, pageSize = DEFAULT_PAGE_SIZE, signal } = {}) {
  const path =
    '/api/waistbeads?populate=*' +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  return api.get(path, { signal });
}

export function getWaistbeadsListWithImage({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const path =
    '/api/waistbeads?populate[0]=image' +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  return api.get(path);
}

export function getWaistbeadsById(id, { signal } = {}) {
  return api.get(`/api/waistbeads/${id}?populate=*`, { signal });
}

export function createWaistbeads(payload, token) {
  return api.post('/api/waistbeads', payload, { token });
}

export function updateWaistbeads(documentId, data, token) {
  return api.put(`/api/waistbeads/${documentId}`, { data }, { token });
}

// Aftercare
export function getAftercareList({ page = 1, pageSize = DEFAULT_PAGE_SIZE, withImage = false, signal } = {}) {
  const populate = withImage ? 'populate[0]=image' : 'populate=*';
  const path =
    `/api/aftercares?${populate}` +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  return api.get(path, { signal });
}

export function getAftercareById(id, { signal } = {}) {
  return api.get(`/api/aftercares/${id}?populate=*`, { signal });
}

export function getAftercare(documentId, token) {
  return api.get(`/api/aftercares/${documentId}`, { token });
}

export function createAftercare(payload, token) {
  return api.post('/api/aftercares', payload, { token });
}

export function updateAftercare(documentId, data, token) {
  return api.put(`/api/aftercares/${documentId}`, { data }, { token });
}

// Cross-collection search.
// Returns { jewelry, merchandise, waistbeads, aftercare, total }.
// Each item is the raw Strapi entry plus { _type, _href } for routing/rendering.
export async function searchProducts(query, { pageSize = 8, signal } = {}) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return { jewelry: [], merchandise: [], waistbeads: [], aftercare: [], total: 0 };
  }
  const q = encodeURIComponent(trimmed);

  // $or over name and description, case-insensitive contains.
  // Waistbead schema uses capital `Name`; the others use `name`.
  const orNameDesc = nameField =>
    `filters[$or][0][${nameField}][$containsi]=${q}` +
    `&filters[$or][1][description][$containsi]=${q}`;

  const pag = `&pagination[page]=1&pagination[pageSize]=${pageSize}`;

  const [jewelry, merch, waist, after] = await Promise.all([
    api.get(`/api/jewelries?populate=*&${orNameDesc('name')}${pag}`, { signal }),
    api.get(`/api/merchandises?populate=*&${orNameDesc('name')}${pag}`, { signal }),
    api.get(`/api/waistbeads?populate=*&${orNameDesc('Name')}${pag}`, { signal }),
    api.get(`/api/aftercares?populate=*&${orNameDesc('name')}${pag}`, { signal })
  ]);

  const tag = (resp, type, route) =>
    (resp?.data || []).map(it => ({
      ...it,
      _type: type,
      _href: `/product/${route}/${it.documentId}`,
      _name: it.name || it.Name || ''
    }));

  const j = tag(jewelry, 'Jewelry', 'jewelry');
  const m = tag(merch, 'Clothing', 'clothing');
  const w = tag(waist, 'Waistbeads', 'waistbeads');
  const a = tag(after, 'Aftercare', 'aftercare');

  return {
    jewelry: j,
    merchandise: m,
    waistbeads: w,
    aftercare: a,
    total: j.length + m.length + w.length + a.length
  };
}
