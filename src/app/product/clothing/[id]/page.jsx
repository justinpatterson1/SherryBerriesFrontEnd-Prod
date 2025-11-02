'use client';
import ProductLayout from '../../../components/ProductLayout';

function page({ params }) {
  const productId = params?.id || window.location.pathname.split('/').pop();
  
  return (
    <ProductLayout
      productId={productId}
      productType="clothing"
      params={params}
    />
  );
}

export default page;
