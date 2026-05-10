import { getWaistbeadsList } from '@/lib/api/products';
import WaistbeadsListClient from './WaistbeadsListClient';

export default async function WaistbeadsPage({ searchParams }) {
  const params = (await searchParams) || {};
  const initialPage = Number(params.page ?? 1) || 1;

  let initialProducts = [];
  try {
    const waistbeadData = await getWaistbeadsList({
      page: initialPage,
      pageSize: 12
    });
    initialProducts = waistbeadData?.data ?? [];
  } catch {
    initialProducts = [];
  }

  return (
    <WaistbeadsListClient
      initialProducts={initialProducts}
      initialPage={initialPage}
    />
  );
}
