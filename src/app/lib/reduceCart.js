// lib/reduceQuantity.js

export async function reduceQuantity(cartItems, jwt) {
  const collectionMap = {
    Jewelry: 'jewelries',
    Merchandise: 'merchandises',
    Aftercare: 'aftercares'
  };

  for (const item of cartItems) {
    const itemType = item.info.ItemType;
    const docId = item.item.documentId;
    const collection = collectionMap[itemType];

    if (!collection) {
      continue;
    }

    try {
      if (itemType === 'Jewelry' || itemType === 'Merchandise') {
        // Fetch current sizes
        const url = `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/${collection}/${docId}?populate[0]=sizes`;
        const resp = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          }
        });

        const data = await resp.json();

        const sizeKey = itemType === 'Jewelry' ? 'size' : 'clothingSize';

        const updatedSizes = data.data.sizes.map(({ id, ...sizeObj }) => {
          if (sizeObj.Size === item.info[sizeKey]) {
            return {
              ...sizeObj,
              quantity: sizeObj.quantity - item.info.quantity
            };
          }
          return { Size: sizeObj.Size, quantity: sizeObj.quantity };
        });

        
        // Update sizes
        const updateResp = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/${collection}/${docId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({ data: { sizes: updatedSizes } })
          }
        );

        if (!updateResp.ok) {
            `Failed to update ${itemType} quantity for item ${docId}`
          );
        }
      } else if (itemType === 'Aftercare') {
        // Fetch current quantity
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/aftercares/${docId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`
            }
          }
        );

        const data = await resp.json();
        const newQty = data.data.quantity - item.info.quantity;

        // Update quantity
        const updateResp = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/aftercares/${docId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({ data: { quantity: newQty } })
          }
        );

        if (!updateResp.ok) {
            `Failed to update Aftercare quantity for item ${docId}`
          );
        }
      }
    } catch (err) {
    }
  }
}

export const endCart = async(cartId, session) => {
  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items/${cartId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.jwt}`
      },
      body: JSON.stringify({
        data: {
          active: false
        }
      })
    }
  );

  if (resp.ok) {
  }
};
