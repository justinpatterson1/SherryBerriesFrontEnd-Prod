import { getWaistbeadsById } from '@/lib/api/products';
import ProductLayout from '../../../components/ProductLayout';

export default async function WaistbeadsDetailPage({ params }) {
  const resolvedParams = (await params) || {};
  const productId = resolvedParams.id;

  let product = null;
  try {
    const json = await getWaistbeadsById(productId);
    product = json?.data ?? null;
  } catch {
    product = null;
  }

  return (
    <ProductLayout
      productId={productId}
      productType='waistbead'
      params={resolvedParams}
      product={product}
    />
  );
}
