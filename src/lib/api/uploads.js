import { api } from '../api-client';

export function uploadFile(file, token) {
  const formData = new FormData();
  formData.append('files', file);
  return api.post('/api/upload', formData, { token });
}
