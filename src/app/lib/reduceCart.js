import { updateCart as apiUpdateCart } from '@/lib/api/cart';
import {
  getJewelryWithSizes,
  updateJewelry,
  getMerchandiseWithSizes,
  updateMerchandise,
  getAftercare,
  updateAftercare
} from '@/lib/api/products';

export async function reduceQuantity(cartItems, jwt) {
  for (const item of cartItems) {
    const itemType = item.info.ItemType;
    const docId = item.item.documentId;

    try {
      if (itemType === 'Jewelry' || itemType === 'Merchandise') {
        const sizeKey = itemType === 'Jewelry' ? 'size' : 'clothingSize';
        const data =
          itemType === 'Jewelry'
            ? await getJewelryWithSizes(docId, jwt)
            : await getMerchandiseWithSizes(docId, jwt);

        const updatedSizes = data.data.sizes.map(({ id, ...sizeObj }) => {
          if (sizeObj.Size === item.info[sizeKey]) {
            return {
              ...sizeObj,
              quantity: sizeObj.quantity - item.info.quantity
            };
          }
          return { Size: sizeObj.Size, quantity: sizeObj.quantity };
        });

        if (itemType === 'Jewelry') {
          await updateJewelry(docId, { sizes: updatedSizes }, jwt);
        } else {
          await updateMerchandise(docId, { sizes: updatedSizes }, jwt);
        }
      } else if (itemType === 'Aftercare') {
        const data = await getAftercare(docId, jwt);
        const newQty = data.data.quantity - item.info.quantity;
        await updateAftercare(docId, { quantity: newQty }, jwt);
      }
    } catch (err) {
    }
  }
}

export const endCart = async(cartId, session) => {
  try {
    await apiUpdateCart(cartId, { data: { active: false } }, session?.jwt);
  } catch {}
};
