'use client';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image';

/**
 * Resolves the underlying product entity from a cart item based on ItemType.
 * Replaces the four duplicated renderers in the dashboard Orders view.
 */
function resolveItem(item) {
  switch (item.ItemType) {
    case 'Waistbead':
      return { product: item.waistbeads?.[0], image: item.waistbeads?.[0]?.image, label: item.waistbeads?.[0]?.Name, alt: 'Waistbead' };
    case 'Merchandise':
      return { product: item.merchandises?.[0], image: item.merchandises?.[0]?.image, label: item.merchandises?.[0]?.name, alt: 'Merchandise' };
    case 'Jewelry':
      return { product: item.jewelries?.[0], image: item.jewelries?.[0]?.image, label: item.jewelries?.[0]?.name, alt: 'Jewelry' };
    case 'Aftercare':
      return { product: item.aftercares?.[0], image: item.aftercares?.[0]?.image, label: item.aftercares?.[0]?.name, alt: 'Aftercare' };
    default:
      return null;
  }
}

export default function OrderItemList({ items = [] }) {
  return (
    <ul className='space-y-4'>
      {items.map((item, index) => {
        const resolved = resolveItem(item);
        const itemKey = item.documentId || item.id || `item-${index}`;

        if (!resolved || !resolved.product) {
          return <li key={itemKey}>Unknown Item</li>;
        }

        const { product, image, label, alt } = resolved;
        const imageUrl = getImageUrl(image);

        return (
          <li key={itemKey} className='flex flex-col sm:flex-row gap-4 items-start'>
            <div className='w-full sm:w-[100px]'>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  width={100}
                  height={100}
                  alt={alt}
                  className='rounded-md object-cover'
                />
              )}
            </div>
            <div className='flex flex-col text-sm sm:text-base'>
              <span className='font-bold'>
                {label} - {item.quantity} pcs
              </span>
              {item.ItemType === 'Waistbead' && item.waistbeadSize && (
                <span>Size: {item.waistbeadSize} inches</span>
              )}
              {product.color && <span>Color: {product.color}</span>}
              {product.discount !== undefined && (
                <span>Discount: {product.discount || 0}</span>
              )}
              {product.price !== undefined && (
                <span>Cost: {Number(product.price).toFixed(2)}</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
