import { getJewelryById } from '@/lib/api/products';
import ProductLayout from '../../../components/ProductLayout';

export default async function JewelryDetailPage({ params }) {
  const resolvedParams = (await params) || {};
  const productId = resolvedParams.id;

  let product = null;
  try {
    const json = await getJewelryById(productId);
    product = json?.data ?? null;
  } catch {
    product = null;
  }

  return (
    <ProductLayout
      productId={productId}
      productType='jewelry'
      params={resolvedParams}
      product={product}
    />
  );
}
