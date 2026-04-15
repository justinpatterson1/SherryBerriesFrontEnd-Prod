const BASE_URL = process.env.NEXT_PUBLIC_SHERRYBERRIES_URL;

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/jewelries/${id}?populate=image`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: 'Jewelry' };
    const { data } = await res.json();
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
