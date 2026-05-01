'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader';
import AppContext from '../../../context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import EmptyCartModal from '../components/cart/EmptyCartModal';
import { toast } from 'react-toastify';
import { calculateDiscountedPrice, getCartItem } from '../lib/func';
import {
  getActiveCart,
  getCartByIdWithItems,
  updateCart as apiUpdateCart
} from '@/lib/api/cart';

function Page() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [cartId, setCartId] = useState();
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);

  useEffect(() => {
    if (session?.user?.documentId) {
      getActiveCart(session.user.documentId, session.jwt)
        .then(json => {
          setIsCartEmpty(json?.data[0]?.Items ? false : true);
          setCartId(json?.data[0]?.documentId);
          setCart(json?.data[0]?.Items ? getCartItem(json.data[0].Items) : []);
          setShowEmptyModal(json?.data[0]?.Items.length !== 0);
          setDelivery(json?.data[0]?.deliveryFee?.toFixed(2));
          setLoading(false);
        })
        .catch(() => {});
    }
  }, [session]);

  // Calculate subtotal whenever the cart changes
  useEffect(() => {
    const newSubtotal = cart.reduce(
      (total, item) => {
        const discountedPrice = parseFloat(calculateDiscountedPrice(item.item.price, item.item.discount));
        return total + item.info.quantity * discountedPrice;
      },
      0
    );
    setSubtotal(newSubtotal.toFixed(2));
  }, [cart]);

  const handleIncreaseQuantity = async (index) => {
    setUpdatingItem(index);
    try {
      setCart(prevCart => {
        const updatedCart = [...prevCart];
        updatedCart[index] = {
          ...updatedCart[index],
          info: {
            ...updatedCart[index].info,
            quantity: updatedCart[index].info.quantity + 1
          }
        };
        updateCart(updatedCart);
        return updatedCart;
      });
      toast.success('Quantity updated!');
      // Dispatch event to notify other components of cart update
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  useEffect(() => {
    if (cart.length === 0) {
      setShowEmptyModal(true);
      setIsCartEmpty(true);
    }
  }, [cart]);

  const handleDecreaseQuantity = async (index) => {
    setUpdatingItem(index);
    try {
      setCart(prevCart => {
        const updatedCart = [...prevCart];
        if (updatedCart[index].info.quantity > 1) {
          updatedCart[index] = {
            ...updatedCart[index],
            info: {
              ...updatedCart[index].info,
              quantity: updatedCart[index].info.quantity - 1
            }
          };
        }
        updateCart(updatedCart);
        return updatedCart;
      });
      toast.success('Quantity updated!');
      // Dispatch event to notify other components of cart update
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const updateCart = async updatedCart => {
    const updatedItems = updatedCart.map(item =>
      item.info.ItemType === 'Jewelry'
        ? {
          ItemType: item.info.ItemType,
          jewelries: item.item.documentId,
          quantity: item.info.quantity,
          size: item.info.size,
          color: item.info.color
        }
        : item.info.ItemType === 'Merchandise'
          ? {
            ItemType: item.info.ItemType,
            merchandises: item.item.documentId,
            quantity: item.info.quantity,
            size: item.info.size,
            color: item.info.color
          }
          : item.info.ItemType === 'Waistbead'
            ? {
              ItemType: item.info.ItemType,
              merchandises: item.item.documentId,
              quantity: item.info.quantity,
              size: item.info.size,
              color: item.info.color
            }
            : item.info.ItemType === 'Aftercare'
              ? {
                ItemType: item.info.ItemType,
                aftercares: item.item.documentId,
                quantity: item.info.quantity
              }
              : ''
    );

    const totalPrice = updatedCart.reduce(
      (acc, item) => {
        const discountedPrice = parseFloat(calculateDiscountedPrice(item.item.price, item.item.discount));
        let price = acc + item?.info?.quantity * discountedPrice
        return price.toFixed(2) ;
      },
      0
    );

    const updatedPayload = {
      data: {
        Items: updatedItems,
        TotalPrice: totalPrice,
        User: session?.user?.documentId
      }
    };


    try {
      await apiUpdateCart(cartId, updatedPayload, session?.jwt);
    } catch (error) {
    }
  };

  // const handleRemoveItem = async (index, itemId) => {
  //   try {
  //     // Send DELETE request to the backend
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items/${itemId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         Authorization: `Bearer ${session?.jwt}`, // Include the session token
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (response.ok) {
  //       // Remove item from the local cart state
  //       setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  //     } else {
  //     }
  //   } catch (error) {
  //   }
  // };

  const deleteRepeatableComponent = async(parentId, componentId) => {
    setRemovingItem(componentId);
    try {
      const parentData = await getCartByIdWithItems(parentId, session?.jwt);
      if (!parentData?.data) {
        return;
      }

      const existingItems = getCartItem(parentData.data.Items);
      const updatedItems = existingItems.filter(
        item => item.info.id !== componentId
      );


      const newTotalPrice = updatedItems.reduce((total, item) => {
        const discountedPrice = parseFloat(calculateDiscountedPrice(item.item?.price || 0, item.item?.discount || 0));
        const quantity = item.info.quantity || 0;
        return total + discountedPrice * quantity;
      }, 0);

      const updatedPayload = {
        data: {
          Items: updatedItems.map(item => ({
            ItemType: item.info.ItemType,
            jewelries:
              item.info.ItemType === 'Jewelry'
                ? item.item?.documentId
                  ? { set: [item.item.documentId] }
                  : []
                : [],
            merchandises:
              item.info.ItemType === 'Merchandise'
                ? item.item?.documentId
                  ? { set: [item.item.documentId] }
                  : []
                : [],
            waistbeads:
              item.info.ItemType === 'Waistbead'
                ? item.item?.documentId
                  ? { set: [item.item.documentId] }
                  : []
                : [],
            aftercares:
              item.info.ItemType === 'Aftercare'
                ? item.item?.documentId
                  ? { set: [item.item.documentId] }
                  : []
                : [],
            quantity: item.info.quantity || 0,
            size: item.info.ItemType === 'Jewelry' ? item.info.size : 0,
            color: item.info.color || '',
            clothingSize:
              item.info.ItemType === 'Merchandise'
                ? item.info.clothingSize
                : '',
            waistbeadSize:
              item.info.ItemType === 'Waistbead' ? item.info.waistbeadSize : 0
          })),
          TotalPrice: newTotalPrice,
          User: session?.user?.id
        }
      };


      try {
        await apiUpdateCart(parentId, updatedPayload, session?.jwt);
        toast.success('Item removed from cart');
        setCart(prevCart =>
          prevCart.filter(item => item.info.id !== componentId)
        );
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      toast.error('Error removing item');
    } finally {
      setRemovingItem(null);
    }
  };

  // Example usage:
  if (loading) return <Loader />;

  return (
    <div className='bg-gradient-to-br from-pink-50 to-rose-50 min-h-screen'>
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>Shopping Cart</h1>
          <p className='text-gray-600'>Review your items before checkout</p>
        </div>

        {isCartEmpty || cart.length == 0 ? (
          <div className='flex flex-col items-center justify-center py-16'>
            <EmptyCartModal
              isOpen={showEmptyModal}
              onClose={() => setShowEmptyModal(false)}
            />
            <div className='text-center'>
              <div className='w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center'>
                <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01' />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Your cart is empty</h2>
              <p className='text-gray-600 mb-8'>Looks like you haven't added anything yet.</p>
              <Link href='/product/jewelry' className='inline-flex items-center px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors duration-200 font-medium'>
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                </svg>
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-2 space-y-4'>
              {cart.map((jewelry, index) => (
                <div
                  key={index}
                  className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200'
                >
                  <div className='p-4 md:p-6'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                      {/* Product Image */}
                      <div className='relative flex-shrink-0'>
                        {jewelry?.item?.image?.[0]?.formats?.thumbnail?.url ? (
                          jewelry?.info?.ItemType == 'Merchandise' && (
                            <Image
                              src={jewelry?.item?.image[0]?.formats?.thumbnail?.url}
                              width={jewelry?.item?.image[0]?.formats?.thumbnail?.width || 120}
                              height={jewelry?.item?.image[0]?.formats?.thumbnail?.height || 120}
                              alt={jewelry?.item?.name || 'Product Image'}
                              className='w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg'
                            />
                          )
                        ) : (
                          <Image
                            src={jewelry?.item?.image?.formats?.thumbnail?.url}
                            width={jewelry?.item?.image?.formats?.thumbnail?.width || 120}
                            height={jewelry?.item?.image?.formats?.thumbnail?.height || 120}
                            alt={jewelry?.item?.name || 'Product Image'}
                            className='w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg'
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex justify-between items-start mb-3'>
                          <h3 className='text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2'>
                            {jewelry.info.ItemType === 'Waistbead'
                              ? jewelry?.item?.Name
                              : jewelry?.item?.name}
                          </h3>
                          <button
                            className='ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200'
                            onClick={() => deleteRepeatableComponent(cartId, jewelry.info.id)}
                            disabled={removingItem === jewelry.info.id}
                          >
                            {removingItem === jewelry.info.id ? (
                              <div className='w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
                            ) : (
                              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                              </svg>
                            )}
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className='space-y-2 text-sm text-gray-600 mb-4'>
                          {jewelry.info.ItemType === 'Jewelry' && (
                            <div className='flex items-center'>
                              <span className='font-medium mr-2'>Category:</span>
                              <span>{jewelry?.item?.category}</span>
                            </div>
                          )}
                          {(jewelry.info.ItemType === 'Jewelry' || jewelry.info.ItemType === 'Merchandise') && (
                            <div className='flex items-center'>
                              <span className='font-medium mr-2'>Color:</span>
                              <span className='flex items-center'>
                                <span className='w-4 h-4 rounded-full border border-gray-300 mr-2' style={{backgroundColor: jewelry?.info?.color}}></span>
                                {jewelry?.info?.color}
                              </span>
                            </div>
                          )}
                          {jewelry.info.ItemType !== 'Aftercare' && (
                            <div className='flex items-center'>
                              <span className='font-medium mr-2'>Size:</span>
                              <span className='bg-gray-100 px-2 py-1 rounded text-xs font-medium'>
                                {jewelry.info.ItemType === 'Jewelry'
                                  ? jewelry?.info?.size
                                  : jewelry.info.ItemType === 'Merchandise'
                                    ? jewelry?.info?.clothingSize
                                    : jewelry.info.ItemType === 'Waistbead'
                                      ? jewelry?.info?.waistbeadSize
                                      : ''}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                          <div className='text-xl font-bold text-brand'>
                            ${calculateDiscountedPrice(jewelry?.item?.price, jewelry?.item?.discount)}
                            {jewelry?.item?.discount && jewelry?.item?.discount > 0 && (
                              <span className='text-gray-400 text-sm ml-2'>
                                <strike>${jewelry?.item?.price}</strike>
                              </span>
                            )}
                          </div>
                          
                          <div className='flex items-center space-x-3'>
                            <span className='text-sm font-medium text-gray-700'>Qty:</span>
                            <div className='flex items-center border border-gray-200 rounded-lg overflow-hidden'>
                              <button
                                className='px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                onClick={() => handleDecreaseQuantity(index)}
                                disabled={updatingItem === index || jewelry?.info?.quantity <= 1}
                              >
                                {updatingItem === index ? (
                                  <div className='w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
                                ) : (
                                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
                                  </svg>
                                )}
                              </button>
                              <span className='px-4 py-2 bg-white text-center font-medium min-w-[3rem]'>
                                {jewelry?.info?.quantity}
                              </span>
                              <button
                                className='px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                onClick={() => handleIncreaseQuantity(index)}
                                disabled={updatingItem === index}
                              >
                                {updatingItem === index ? (
                                  <div className='w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
                                ) : (
                                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8'>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>Order Summary</h2>
                
                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                    <span className='font-medium'>${subtotal}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Delivery Fee</span>
                    <span className='font-medium'>${delivery}</span>
                  </div>
                  <div className='border-t border-gray-200 pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-semibold text-gray-900'>Total</span>
                      <span className='text-xl font-bold text-brand'>
                        ${(parseFloat(subtotal) + parseFloat(delivery)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {cart.length > 0 ? (
                  <Link href='/checkout' className='block'>
                    <button className='w-full py-4 bg-brand text-white rounded-lg font-semibold hover:bg-brand-hover transition-colors duration-200 flex items-center justify-center space-x-2'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01' />
                      </svg>
                      <span>Proceed to Checkout</span>
                    </button>
                  </Link>
                ) : (
                  <button
                    className='w-full py-4 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed'
                    disabled={true}
                  >
                    Cart Empty
                  </button>
                )}

                <div className='mt-6 pt-6 border-t border-gray-200'>
                  <Link href='/product/jewelry' className='text-center block text-brand hover:text-brand-hover font-medium transition-colors duration-200'>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
