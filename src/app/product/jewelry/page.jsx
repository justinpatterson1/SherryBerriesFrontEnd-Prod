import { getJewelryListPopulated } from '@/lib/api/products';
import JewelryListClient from './JewelryListClient';

export default async function JewelryPage({ searchParams }) {
  const params = (await searchParams) || {};
  const initialPage = Number(params.page ?? 1) || 1;

  let initialProducts = [];
  try {
    const jewelryData = await getJewelryListPopulated({
      page: initialPage,
      pageSize: 12
    });
    initialProducts = jewelryData?.data ?? [];
  } catch {
    initialProducts = [];
  }

  return (
    <JewelryListClient
      initialProducts={initialProducts}
      initialPage={initialPage}
    />
  );
}
