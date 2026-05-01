import { api } from '@/lib/api-client';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { data } = await api.get(`/api/aftercares/${id}?populate=image`);
    return {
      title: data?.name || 'Aftercare',
      description: data?.description?.slice(0, 160) || 'Aftercare products from SherryBerries.',
      openGraph: {
        images: data?.image?.url ? [{ url: data.image.url }] : []
      }
    };
  } catch {
    return { title: 'Aftercare' };
  }
}

export default function Layout({ children }) { return children; }
