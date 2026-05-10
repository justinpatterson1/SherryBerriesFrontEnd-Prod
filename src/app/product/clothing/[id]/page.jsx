import { getMerchandiseById } from '@/lib/api/products';
import ProductLayout from '../../../components/ProductLayout';

export default async function ClothingDetailPage({ params }) {
  const resolvedParams = (await params) || {};
  const productId = resolvedParams.id;

  let product = null;
  try {
    const json = await getMerchandiseById(productId);
    product = json?.data ?? null;
  } catch {
    product = null;
  }

  return (
    <ProductLayout
      productId={productId}
      productType='clothing'
      params={resolvedParams}
      product={product}
    />
  );
}
