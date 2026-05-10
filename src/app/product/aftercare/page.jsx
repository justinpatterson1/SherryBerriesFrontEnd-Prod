import { getAftercareList } from '@/lib/api/products';
import AftercareListClient from './AftercareListClient';

export default async function AftercarePage({ searchParams }) {
  const params = (await searchParams) || {};
  const initialPage = Number(params.page ?? 1) || 1;

  let initialProducts = [];
  try {
    const aftercareData = await getAftercareList({
      page: initialPage,
      pageSize: 12
    });
    initialProducts = aftercareData?.data ?? [];
  } catch {
    initialProducts = [];
  }

  return (
    <AftercareListClient
      initialProducts={initialProducts}
      initialPage={initialPage}
    />
  );
}
