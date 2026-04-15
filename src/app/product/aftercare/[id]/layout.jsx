const BASE_URL = process.env.NEXT_PUBLIC_SHERRYBERRIES_URL;

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/aftercares/${id}?populate=image`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: 'Aftercare' };
    const { data } = await res.json();
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
