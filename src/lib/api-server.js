import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { api } from './api-client';

async function getToken() {
  const session = await getServerSession(authOptions);
  return session?.jwt || session?.user?.jwt || null;
}

export const serverApi = {
  get: async (path, opts) => api.get(path, { ...opts, token: opts?.token ?? (await getToken()) }),
  post: async (path, body, opts) =>
    api.post(path, body, { ...opts, token: opts?.token ?? (await getToken()) }),
  put: async (path, body, opts) =>
    api.put(path, body, { ...opts, token: opts?.token ?? (await getToken()) }),
  delete: async (path, opts) => api.delete(path, { ...opts, token: opts?.token ?? (await getToken()) })
};
