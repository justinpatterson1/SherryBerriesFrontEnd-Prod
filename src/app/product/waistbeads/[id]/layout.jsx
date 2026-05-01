import { api } from '@/lib/api-client';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { data } = await api.get(`/api/waistbeads/${id}?populate=image`);
    return {
      title: data?.name || 'Waistbeads',
      description: data?.description?.slice(0, 160) || 'Handmade waistbeads from SherryBerries.',
      openGraph: {
        images: data?.image?.url ? [{ url: data.image.url }] : []
      }
    };
  } catch {
    return { title: 'Waistbeads' };
  }
}

export default function Layout({ children }) { return children; }
