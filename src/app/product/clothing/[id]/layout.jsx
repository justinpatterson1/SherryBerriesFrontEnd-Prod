const BASE_URL = process.env.NEXT_PUBLIC_SHERRYBERRIES_URL;

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/merchandises/${id}?populate=image`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: 'Clothing' };
    const { data } = await res.json();
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
