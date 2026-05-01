import { api } from '../api-client';

export function getBlogList({ page = 1, pageSize = 12, sortOrder = 'desc', signal } = {}) {
  const path =
    `/api/blogs?pagination[page]=${page}&pagination[pageSize]=${pageSize}` +
    `&sort[date]=${sortOrder}&populate=*`;
  return api.get(path, { signal });
}

export function getBlogListWithImage({ page = 1, pageSize = 4 } = {}) {
  const path =
    '/api/blogs?populate[0]=image' +
    `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  return api.get(path);
}

export function getBlogById(id, { populateImageOnly = false, signal } = {}) {
  const populate = populateImageOnly ? 'populate=image' : 'populate=*';
  return api.get(`/api/blogs/${id}?${populate}`, { signal });
}

export function createBlog(payload, token) {
  return api.post('/api/blogs', payload, { token });
}

export function updateBlog(id, data, token) {
  return api.put(`/api/blogs/${id}`, { data }, { token });
}
