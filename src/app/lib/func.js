export const getCartItem = item => {
  const arr = [];
  item.forEach(i => {
    if (i.ItemType === 'Jewelry') {
      arr.push({ info: i, item: i.jewelries[0] });
    }
    if (i.ItemType === 'Merchandise') {
      arr.push({ info: i, item: i.merchandises[0] });
    }
    if (i.ItemType === 'Waistbead') {
      arr.push({ info: i, item: i.waistbeads[0] });
    }
    if (i.ItemType === 'Aftercare') {
      arr.push({ info: i, item: i.aftercares[0] });
    }
  });
  return arr;
};

export const calculateDiscountedPrice = (price, discount) => {
  if (discount && discount != 0) {
    return ((1 + discount / 100) * price).toFixed(2);
  }
  return price.toFixed(2);
};

import { api } from '@/lib/api-client';

export const normalizeCart = async(id, session, item, size) => {
  try {
    const path =
      `/api/cart-items/${id}?populate[0]=Items.jewelries.image` +
      '&populate[1]=Items.merchandises.image' +
      '&populate[2]=Items.waistbeads.image' +
      '&populate[3]=Items.aftercares.image';
    let cart = await api.get(path, { token: session?.jwt });

    cart = getCartItem(cart.data.Items);

    const reoccuringItem = cart.find(
      items => items.item.documentId == item && items.info.size == size
    );

    if (reoccuringItem) {
      return { isExisting: true, quantity: reoccuringItem.info.quantity };
    } else {
      return { isExisting: false };
    }
  } catch (error) {}
};
