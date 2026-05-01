import { api } from '@/lib/api-client';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { data } = await api.get(`/api/jewelries/${id}?populate=image`);
    return {
      title: data?.name || 'Jewelry',
      description: data?.description?.slice(0, 160) || 'Handcrafted jewelry from SherryBerries.',
      openGraph: {
        images: data?.image?.url ? [{ url: data.image.url }] : []
      }
    };
  } catch {
    return { title: 'Jewelry' };
  }
}

export default function Layout({ children }) { return children; }
