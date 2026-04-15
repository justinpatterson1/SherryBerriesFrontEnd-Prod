'use client';
import ProductLayout from '../../../components/ProductLayout';

function page({ params }) {
  const productId = params?.id;
  
  return (
    <ProductLayout
      productId={productId}
      productType="aftercare"
      params={params}
    />
  );
}

export default page;
