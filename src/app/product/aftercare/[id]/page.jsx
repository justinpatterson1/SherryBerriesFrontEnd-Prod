import { getAftercareById } from '@/lib/api/products';
import ProductLayout from '../../../components/ProductLayout';

export default async function AftercareDetailPage({ params }) {
  const resolvedParams = (await params) || {};
  const productId = resolvedParams.id;

  let product = null;
  try {
    const json = await getAftercareById(productId);
    product = json?.data ?? null;
  } catch {
    product = null;
  }

  return (
    <ProductLayout
      productId={productId}
      productType='aftercare'
      params={resolvedParams}
      product={product}
    />
  );
}
