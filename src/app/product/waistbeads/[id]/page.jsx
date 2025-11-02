'use client';
import ProductLayout from '../../../components/ProductLayout';

function Page({ params }) {
  const productId = params?.id || window.location.pathname.split('/').pop();
  
  return (
    <ProductLayout
      productId={productId}
      productType="waistbead"
      params={params}
    />
  );
}

export default Page;
