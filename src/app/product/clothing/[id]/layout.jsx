import { api } from '@/lib/api-client';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { data } = await api.get(`/api/merchandises/${id}?populate=image`);
    return {
      title: data?.name || 'Clothing',
      description: data?.description?.slice(0, 160) || 'Shop clothing from SherryBerries.',
      openGraph: {
        images: data?.image?.url ? [{ url: data.image.url }] : []
      }
    };
  } catch {
    return { title: 'Clothing' };
  }
}

export default function Layout({ children }) { return children; }
