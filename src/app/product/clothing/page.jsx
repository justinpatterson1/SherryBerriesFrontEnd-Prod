import { getMerchandiseList } from '@/lib/api/products';
import ClothingListClient from './ClothingListClient';

export default async function ClothingPage({ searchParams }) {
  const params = (await searchParams) || {};
  const initialPage = Number(params.page ?? 1) || 1;

  let initialProducts = [];
  try {
    const merchandiseData = await getMerchandiseList({
      page: initialPage,
      pageSize: 12
    });
    initialProducts = merchandiseData?.data ?? [];
  } catch {
    initialProducts = [];
  }

  return (
    <ClothingListClient
      initialProducts={initialProducts}
      initialPage={initialPage}
    />
  );
}
