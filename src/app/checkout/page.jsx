'use client';
import React, { useEffect, useState, useReducer } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSession } from 'next-auth/react';
import Loader from '../components/Loader';
import Image from 'next/image';
import { nanoid, customAlphabet } from 'nanoid';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { reduceQuantity } from '../lib/reduceCart';
import { setConfig } from 'next/config';
import { RxCross2 } from 'react-icons/rx';
import Jewelry from '../product/jewelry/page';
import { calculateDiscountedPrice } from '../lib/func';
import PayPalButton from '../components/paypalButtons/PayPalButton';

// const customId = customAlphabet(
//   '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_',
//   10
// );

const full = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_", 5);
const safeEnd = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 4);

function generateOrderId() {
  return full() +"_"+ safeEnd();
}
console.log(`oid_${generateOrderId()}`);

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  street: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  postalCode: Yup.string().required('Postal code is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  shippingLocation: Yup.string().required('Shipping location is required'),
  paymentType: Yup.string().required('Payment type is required')
});

const checkoutState = {
  openPanelOne: false,
  openPanelTwo: false,
  loading: true,
  cart: [],
  subtotal: 0,
  delivery: 0,
  address: {
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    postalCode: '',
    shippingLocation: '',
    paymentType: ''
  }
};

function reducer(state, action) {
  switch (action.type) {
  case 'SET_CART':
    return { ...state, cart: action.payload };
  case 'SET_SUBTOTAL':
    return { ...state, subtotal: action.payload };
  case 'SET_DELIVERY':
    return { ...state, delivery: action.payload };
  case 'TOGGLE_PANEL_ONE':
    return { ...state, openPanelOne: !state.openPanelOne };
  case 'TOGGLE_PANEL_TWO':
    return { ...state, openPanelTwo: !state.openPanelTwo };
  case 'SET_LOADING':
    return { ...state, loading: action.payload };
  case 'UPDATE_ADDRESS':
    return {
      ...state,
      address: { ...state.address, [action.field]: action.value }
    };
  default:
    return state;
  }
}
function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cartId, setCartId] = useState();
  const [state, dispatch] = useReducer(reducer, checkoutState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState();
  const [error, setError] = useState();
  const [coupon, setCoupon] = useState();
  const [code, setCode] = useState('');
  const [couponError, setCouponError] = useState('');
  //   const [subtotal, setSubtotal] = useState(0);
  //   const [delivery, setDelivery] = useState(0);

  useEffect(() => {
    if (!session?.user?.documentId) return;

    const getCartItem = item => {
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

    const fetchCart = async() => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items?filters[User][documentId][$eq]=${session?.user?.documentId}&filters[isCompleted][$eq]=false&filters[active][$eq]=true&populate[Items][populate][jewelries][populate][image]=true&populate[Items][populate][merchandises][populate][image]=true&populate[Items][populate][waistbeads][populate][image]=true&populate[Items][populate][aftercares][populate][image]=true`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const json = await res.json();
        console.log(json.data[0].documentId);
        dispatch({
          type: 'SET_CART',
          payload: getCartItem(json.data?.[0]?.Items) || []
        });
        dispatch({
          type: 'SET_DELIVERY',
          payload: json.data?.[0]?.deliveryFee?.toFixed(2) || 0
        });
        setCartId(json.data[0].documentId);
        setOrderId(`oid_${generateOrderId()}`);
        setCoupon(
          json.data[0].code
            ? {
              code: json.data[0].code,
              discountValue: json.data[0].discountValue,
              discountType: json.data[0].discountType
            }
            : null
        );
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [session?.user?.documentId]);

  // useEffect(()=>{

  // },[orderConfirmed])

  useEffect(() => {
    if (coupon) {
      console.log('In coupon');
      if (coupon?.discountType === 'fixed') {
        const newSubtotal = state.cart.reduce(
          (total, item) => {
            const discountedPrice = parseFloat(calculateDiscountedPrice(item.item.price, item.item.discount));
            return total + item.info.quantity * discountedPrice;
          },
          0
        );
        const newPrice = newSubtotal.toFixed(2) - coupon?.discountValue;
        dispatch({ type: 'SET_SUBTOTAL', payload: newPrice.toFixed(2) });
      }
      if (coupon?.discountType === 'percentage') {
        const newSubtotal = state.cart.reduce(
          (total, item) => {
            const discountedPrice = parseFloat(calculateDiscountedPrice(item.item.price, item.item.discount));
            return total + item.info.quantity * discountedPrice;
          },
          0
        );

        const newPrice =
          newSubtotal.toFixed(2) -
          newSubtotal.toFixed(2) * (coupon?.discountValue / 100);
        dispatch({ type: 'SET_SUBTOTAL', payload: newPrice.toFixed(2) });
      }
    } else {
      const newSubtotal = state.cart.reduce(
        (total, item) => {
          const discountedPrice = parseFloat(calculateDiscountedPrice(item.item.price, item.item.discount));
          return total + item.info.quantity * discountedPrice;
        },
        0
      );
      dispatch({ type: 'SET_SUBTOTAL', payload: newSubtotal.toFixed(2) });
    }
  }, [state.cart, coupon]);

  // const completeCart = async()=>{

  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items?filters[User][documentId][$eq]=${session.user.documentId}`,{
  //       method:"PUT",
  //       headers :{

  //                   "Content-Type": "application/json",
  //                   Authorization: `Bearer ${session?.jwt}`,

  //               },
  //       body:
  //     })
  //   } catch (error) {

  //   }
  // }

  const applyCoupon = async evt => {
    evt.preventDefault();
    setCouponError('');
    if (!coupon) {
      const currDate = dayjs().format('YYYY-MM-DD');
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/coupons?filters[code][$eq]=${code}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.jwt}`
          }
        }
      );

      console.log(code);

      console.log(resp);

      // if(!resp.data){
      //   setCouponError("Coupon Is Invalid");
      //   setCode("")
      //   return;
      // }

      const result = await resp.json();

      console.log(result);

      if (
        result.data.length > 0 &&
        result.data[0].expiresAt >= currDate &&
        result.data[0].code === code
      ) {
        try {
          const couponCheckResp = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items?filters[User][documentId][$eq]=${session?.user?.documentId}&filters[code][$eq]=${code}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.jwt}`
              }
            }
          );

          if (!couponCheckResp.ok) {
            setCouponError('Error Occured During Coupon Validation');
            setCode('');
          }

          const couponCheck = await couponCheckResp.json();

          if (couponCheck.data.length > 0) {
            setCouponError('You Already Applied This Code');
          } else {
            const couponUpdateResp = await fetch(
              `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items/${cartId}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session?.jwt}`
                },
                body: JSON.stringify({
                  data: {
                    discountValue: result.data[0].discountValue,
                    discountType: result.data[0].discountType,
                    code: result.data[0].code
                  }
                })
              }
            );

            console.log(result);

            if (couponUpdateResp.ok) {
              setCoupon(result.data[0]);
              setCode('');
            }
          }
        } catch (error) {
          setCouponError('Error Occured Applying Coupon');
          setCode('');
        }
      } else {
        setCouponError('This Coupon Is Invalid');
        setCode('');
      }
    }
  };

  const endCart = async() => {
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
      alert('cart ' + cartId + ' is not long active');
    }
  };

  const reduceQuantity = async() => {
    console.log('Cart stuff: ' + JSON.stringify(state.cart));
    for (let i = 0; i < state.cart.length; i++) {
      if (state.cart[i].info.ItemType === 'Jewelry') {
        console.log(
          'Cart data:' + JSON.stringify(state.cart[i].item.documentId)
        );
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelries/${state.cart[i].item.documentId}?populate[0]=sizes`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.jwt}`
            }
          }
        );

        const jewelry = await resp?.json();

        if (jewelry) {
          console.log('Jewelry Sizes: ' + JSON.stringify(jewelry));

          const updatedSizes = jewelry.data.sizes.map(({ id, ...sizeObj }) => {
            if (sizeObj.Size === state.cart[i].info.size) {
              return {
                ...sizeObj,
                quantity: sizeObj.quantity - state.cart[i].info.quantity
              }; // or any logic
            }
            return { Size: sizeObj.Size, quantity: sizeObj.quantity };
          });

          console.log(updatedSizes);
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelries/${state.cart[i].item.documentId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.jwt}`
              },
              body: JSON.stringify({ data: { sizes: updatedSizes } })
            }
          );

          if (!resp.ok) {
            console.log('Error occured reducing quantity');
          }
        }
      }

      if (state.cart[i].info.ItemType === 'Merchandise') {
        console.log(
          'Cart data:' + JSON.stringify(state.cart[i].item.documentId)
        );
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/merchandises/${state.cart[i].item.documentId}?populate[0]=sizes`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.jwt}`
            }
          }
        );

        const merchandise = await resp?.json();

        if (merchandise) {
          const updatedSizes = merchandise.data.sizes.map(
            ({ id, ...sizeObj }) => {
              if (sizeObj.Size == state.cart[i].info.clothingSize) {
                return {
                  ...sizeObj,
                  quantity: sizeObj.quantity - state.cart[i].info.quantity
                }; // or any logic
              }
              return { Size: sizeObj.Size, quantity: sizeObj.quantity };
            }
          );

          console.log(updatedSizes);
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/merchandises/${state.cart[i].item.documentId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.jwt}`
              },
              body: JSON.stringify({ data: { sizes: updatedSizes } })
            }
          );

          if (!resp.ok) {
            console.log('Error occured reducing quantity');
          }
        }
      }

      if (state.cart[i].info.ItemType === 'Aftercare') {
        console.log(
          'Cart data:' + JSON.stringify(state.cart[i].item.documentId)
        );
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/aftercares/${state.cart[i].item.documentId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.jwt}`
            }
          }
        );

        const aftercare = await resp?.json();

        if (aftercare) {
          const updatedSizes =
            aftercare.data.quantity - state.cart[i].info.quantity;
          //   if (sizeObj.Size == state.cart[i].info.clothingSize) {
          //     return {  quantity: sizeObj.quantity - state.cart[i].info.quantity}; // or any logic
          //   }
          //   return { Size: sizeObj.Size, quantity: sizeObj.quantity };
          // });

          console.log(updatedSizes);
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/aftercares/${state.cart[i].item.documentId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.jwt}`
              },
              body: JSON.stringify({ data: { quantity: updatedSizes } })
            }
          );

          if (!resp.ok) {
            console.log('Error occured reducing quantity');
          }
        }
      }
    }

    // const jewelry = await fetch(`${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelries`)
    // fetch(`${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelries`,{
    //   method:"PUT",
    //   headers :{

    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${session?.jwt}`,

    // },

    // })
  };

  const removeCoupon = async evt => {
    evt.preventDefault();
    try {
      const removeCouponResp = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/cart-items/${cartId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.jwt}`
          },
          body: JSON.stringify({
            data: {
              discountValue: null,
              discountType: '',
              code: ''
            }
          })
        }
      );

      if (removeCouponResp.ok) {
        setCoupon(null);
      }
    } catch (error) {
      throw new Error(`Failed to remove coupon: ${error}`);
    }
  };

  const sendConfirmationEmail = async() => {
    const body = {
      email: session?.user?.email,
      order: {
        firsName: state.address.firstName,
        lastName: state.address.lastName,
        date: state.date,
        subtotal: state.subtotal,
        street: state.address.street,
        ...(state.address.apartment && { apartment: state.address.apartment }),
        city: state.address.city,
        shippingLocation: state.address.shippingLocation,
        phone: state.address.phone,
        cart: state.cart
      },
      orderId
    };

    console.log('Body: ' + JSON.stringify(body));

    const resp = await fetch('/api/order-confirmation-postmark', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: session?.user?.email,
        order: state,
        orderId
      })
    });

    if (!resp.ok) {
      throw new Error('Unable to send confirmation Email');
    }

    if (resp.ok) {
      const order = await resp.json();
      console.log(order);
      console.log('Confirmation Email sent');
    }
  };

  const wiPayAPI = async() => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');

    const parameters = new URLSearchParams();
    parameters.append(
      'account_number',
      process.env.NEXT_PUBLIC_WIPAY_ACCOUNT_NUMBER
    );
    parameters.append('avs', '0');
    parameters.append('country_code', 'TT');
    parameters.append('currency', 'TTD');
    parameters.append('data', JSON.stringify({ cartId, orderId }));
    parameters.append('environment', 'live');
    parameters.append('fee_structure', 'customer_pay');
    parameters.append('method', 'credit_card');
    parameters.append('order_id', orderId);
    parameters.append('origin', 'SherryBerries_app');
    parameters.append(
      'response_url',
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL}/checkout/thank-you`
    );
    parameters.append('total', parseFloat(state.subtotal).toFixed(2));

    try {
      const response = await fetch('/api/wipay', {
        method: 'POST',
        headers,
        body: parameters,
        redirect: 'follow'
      });

      const result = await response.json();

      if (result?.data?.url) {
        console.log(result);
        window.location.href = result.data.url; // Redirect to WiPay payment page
      } else {
        console.error('WiPay error response:', result);
        alert('Failed to initiate payment.');
      }
    } catch (error) {
      console.error('Request error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const sendOrderToDB = async() => {
    console.log(state.cart);
    if (state.address.paymentType == 'C.O.D') {
      setIsSubmitted(true);
      const payload = {
        data: {
          cart: cartId,
          paymentType: state.address.paymentType,
          orderId,
          shipping_address: `${state.address.street},${state.address.city},${state.address.shippingLocation}`,
          shipping_method:
            state.address.shippingLocation === 'Tobago' ? 'ttpost' : 'courier',
          phone: state.address.phone,
          order_status: 'open',
          date: dayjs().format('YYYY-MM-DD'),
          subtotal: state.subtotal
        }
      };

      console.log("Payload: " + JSON.stringify(payload, null, 2));

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.jwt}`
            },
            body: JSON.stringify(payload)
          }
        );

        if (response.ok) {
          console.log('Successfull addition to orders');
          try {
            await sendConfirmationEmail();
            setIsSubmitted(false);
            await reduceQuantity();
            await endCart();
            setOrderConfirmed(true);
            setLoading(true);
          } catch (error) {
            setError(error.message);
          }

          router.push(`/checkout/thank-you?order_id=${orderId}`);
        }
        if (!response.ok) {
          console.log('Failed to complete order', response.statusText);
        }
      } catch (error) {
        console.log('Order Failed: ' + error);
      }
    }

    if (state.address.paymentType == 'BT') {
      setIsSubmitted(true);
      const payload = {
        data: {
          cart: cartId,
          paymentType: state.address.paymentType,
          orderId,
          shipping_address: `${state.address.street},${state.address.city},${state.address.shippingLocation}`,
          shipping_method: 'ttpost',
          phone: state.address.phone,
          order_status: 'open',
          date: dayjs().format('YYYY-MM-DD'),
          subtotal: state.subtotal
        }
      };

      console.log(payload);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.jwt}`
            },
            body: JSON.stringify(payload)
          }
        );

        if (response.ok) {
          try {
            await sendConfirmationEmail();
            setIsSubmitted(false);
            await reduceQuantity();
            await endCart();
            setOrderConfirmed(true);
            setLoading(true);
          } catch (error) {
            setError(error.message);
          }

          router.push(`/checkout/thank-you?order_id=${orderId}&status=success`);
        }
        if (!response.ok) {
          console.log('Failed to complete order', response.statusText);
          router.push(`/checkout/thank-you?order_id=${orderId}&status=failed`)
        }
      } catch (error) {
        console.log('Order Failed: ' + error);
      }
    }

    if (state.address.paymentType == 'CC') {
      setIsSubmitted(true);
      const payload = {
        data: {
          cart: cartId,
          paymentType: state.address.paymentType,
          orderId,
          shipping_address: `${state.address.street},${state.address.city},${state.address.shippingLocation}`,
          shipping_method: 'DHL',
          phone: state.address.phone,
          order_status: 'pending',
          date: dayjs().format('YYYY-MM-DD'),
          subtotal: state.subtotal
        }
      };

      console.log("Payload: " + JSON.stringify(payload, null, 2));
      console.log(process.env.NEXT_PUBLIC_SHERRYBERRIES_URL);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.jwt}`
            },
            body: JSON.stringify(payload)
          }
        );

        console.log('CC user added to DB');

        if (response.ok) {
          try {
            //await sendConfirmationEmail()
            await wiPayAPI();
            setLoading(true);
          } catch (error) {
            setError(error.message);
          }

          //   router.push(`/checkout/thank-you?orderId=${orderId}`)
        }
        if (!response.ok) {
          console.log('Failed to complete order', response.statusText);
        }
      } catch (error) {
        console.log('Order Failed: ' + error);
      }
    }
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

  if (status === 'loading' || loading) return <Loader />;

  return (
    <div className='bg-[#ffefef] min-h-screen px-4 lg:px-10 py-6'>
      <h1 className='text-4xl font-bold mb-6 text-center'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
        <div className='bg-white p-6 rounded-lg shadow-md w-full h-full flex flex-col'>
          <h2 className='text-2xl font-semibold pb-4'>Shipping Address</h2>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              street: '',
              apartment: '',
              city: '',
              //postalCode: "",
              phone: '',
              shippingLocation: '',
              paymentType: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              console.log('Form submitted successfully', values);

              setTimeout(setSubmitting(false), 3000);
            }}
          >
            {({
              values,
              handleChange,
              setFieldValue,
              isSubmitting,
              setSubmitting
            }) => (
              <Form className='flex flex-col flex-grow'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Field
                    name='firstName'
                    type='text'
                    placeholder='First Name'
                    className='p-4 border rounded-lg w-full'
                    value={values.firstName}
                    onChange={e => {
                      dispatch({
                        type: 'UPDATE_ADDRESS',
                        field: 'firstName',
                        value: e.target.value
                      });
                      setFieldValue('firstName', e.target.value);
                    }}
                  />
                  <ErrorMessage
                    name='firstName'
                    component='p'
                    className='text-red-500 text-sm'
                  />
                  <Field
                    name='lastName'
                    type='text'
                    placeholder='Last Name'
                    className='p-4 border rounded-lg w-full'
                    value={values.lastName}
                    onChange={e => {
                      dispatch({
                        type: 'UPDATE_ADDRESS',
                        field: 'lastName',
                        value: e.target.value
                      });
                      setFieldValue('lastName', e.target.value);
                    }}
                  />
                  <ErrorMessage
                    name='lastName'
                    component='p'
                    className='text-red-500 text-sm'
                  />
                </div>
                <Field
                  name='street'
                  type='text'
                  placeholder='Address'
                  className='p-4 border rounded-lg w-full mt-4'
                  value={values.street}
                  onChange={e => {
                    dispatch({
                      type: 'UPDATE_ADDRESS',
                      field: 'street',
                      value: e.target.value
                    });
                    setFieldValue('street', e.target.value);
                  }}
                />
                <ErrorMessage
                  name='street'
                  component='p'
                  className='text-red-500 text-sm'
                />
                <Field
                  name='apartment'
                  type='text'
                  placeholder='Apartment, suite, etc. (optional)'
                  className='p-4 border rounded-lg w-full mt-4'
                  value={values.apartment}
                  onChange={e => {
                    dispatch({
                      type: 'UPDATE_ADDRESS',
                      field: 'apartment',
                      value: e.target.value
                    });
                    setFieldValue('apartment', e.target.value);
                  }}
                />
                <Field
                  name='city'
                  type='text'
                  placeholder='City'
                  className='p-4 border rounded-lg w-full mt-4'
                  value={values.city}
                  onChange={e => {
                    dispatch({
                      type: 'UPDATE_ADDRESS',
                      field: 'city',
                      value: e.target.value
                    });
                    setFieldValue('city', e.target.value);
                  }}
                />
                <ErrorMessage
                  name='city'
                  component='p'
                  className='text-red-500 text-sm'
                />
                {/* <Field name="postalCode" type="text" placeholder="Postal Code" className="p-4 border rounded-lg w-full mt-4" value={values.postalCode}
                onChange={(e) => {
                    dispatch({type:"UPDATE_ADDRESS" ,field:"postalCode" ,value:e.target.value})
                    setFieldValue("postalCode", e.target.value);
                    }}  />
                <ErrorMessage name="postalCode" component="p" className="text-red-500 text-sm" /> */}
                <Field
                  name='phone'
                  type='tel'
                  placeholder='Phone eg: 3339829'
                  className='p-4 border rounded-lg w-full mt-4'
                  value={values.phone}
                  onChange={e => {
                    dispatch({
                      type: 'UPDATE_ADDRESS',
                      field: 'phone',
                      value: e.target.value
                    });
                    setFieldValue('phone', e.target.value);
                  }}
                />
                <ErrorMessage
                  name='phone'
                  component='p'
                  className='text-red-500 text-sm'
                />

                <h2 className='text-2xl font-semibold pt-6'>Shipping Method</h2>
                <div className='mt-4 flex flex-col'>
                  <Field name='shippingLocation'>
                    {({ field, form }) => (
                      <div className='flex gap-4'>
                        <label className='flex items-center space-x-2 cursor-pointer'>
                          <input
                            type='radio'
                            {...field}
                            value='Tobago'
                            checked={field.value === 'Tobago'}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_ADDRESS',
                                field: 'shippingLocation',
                                value: 'Tobago'
                              })
                            }
                          />
                          <span>Tobago</span>
                        </label>
                        <label className='flex items-center space-x-2 cursor-pointer'>
                          <input
                            type='radio'
                            {...field}
                            value='Trinidad'
                            checked={field.value === 'Trinidad'}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_ADDRESS',
                                field: 'shippingLocation',
                                value: 'Trinidad'
                              })
                            }
                          />
                          <span>Trinidad</span>
                        </label>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name='shippingLocation'
                    component='p'
                    className='text-red-500 text-sm'
                  />
                </div>

                <h2 className='text-2xl font-semibold pt-6'>Payment</h2>
                <div className='mt-4 flex flex-col'>
                  <Field name='paymentType'>
                    {({ field, form }) => (
                      <div className='flex gap-4'>
                        <label className='flex items-center space-x-2 cursor-pointer'>
                          <input
                            type='radio'
                            {...field}
                            value='CC'
                            checked={field.value === 'CC'}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_ADDRESS',
                                field: 'paymentType',
                                value: 'CC'
                              })
                            }
                          />
                          <span>Credit Card</span>
                        </label>
                        <label className='flex items-center space-x-2 cursor-pointer'>
                          <input
                            type='radio'
                            {...field}
                            value='C.O.D'
                            checked={field.value === 'C.O.D'}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_ADDRESS',
                                field: 'paymentType',
                                value: 'C.O.D'
                              })
                            }
                          />
                          <span>Cash On Delivery</span>
                        </label>
                        <label className='flex items-center space-x-2 cursor-pointer'>
                          <input
                            type='radio'
                            {...field}
                            value='BT'
                            checked={field.value === 'BT'}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_ADDRESS',
                                field: 'paymentType',
                                value: 'BT'
                              })
                            }
                          />
                          <span>Bank Transfer</span>
                        </label>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name='paymentType'
                    component='p'
                    className='text-red-500 text-sm'
                  />
                </div>

                <button
                  type='submit'
                  className='bg-blue-500 text-white p-3 rounded-lg w-full mt-4'
                  onClick={sendOrderToDB}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <div className={
                    state.address.paymentType === 'CC'
                      ? 'mt-8 p-4 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 shadow-sm'
                      : 'hidden'
                  }>
                    {/* <PayPalButton /> */}
                </div>

                <div
                  className={
                    state.address.paymentType === 'BT'
                      ? 'mt-8 p-4 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 shadow-sm'
                      : 'hidden'
                  }
                >
                  <h2 className='text-lg font-semibold mb-2 text-gray-900'>
                    Bank Transfer Information
                  </h2>
                  <ul className='list-disc list-inside space-y-1'>
                    <li>
                      <strong>Account Name:</strong> Sherryberries
                    </li>
                    <li>
                      <strong>Account Number:</strong> 2616628
                    </li>
                    <li>
                      <strong>Type:</strong> Savings
                    </li>
                  </ul>
                  <p className='mt-4 text-gray-600'>
                    Please include your <strong>Order ID</strong> in the bank
                    transaction description.
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className='bg-[#ffefef] min-h-screen px-4 lg:px-10 py-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
            {/* Cart Summary Section with Scrollable Items */}
            <div className='bg-white  p-6 rounded-lg shadow-md w-full lg:col-span-2'>
              <h1 className='text-3xl font-semibold py-5'>Cart Summary</h1>
              <div className='max-h-[70vh] overflow-y-auto space-y-4 relative'>
                {state.cart.map((jewelry, index) => (
                  <div key={index} className='flex items-center border-b pb-4'>
                    {jewelry?.item?.image?.[0]?.formats?.thumbnail?.url ? (
                      jewelry?.info?.ItemType == 'Merchandise' && (
                        <Image
                          src={jewelry?.item?.image[0]?.formats?.thumbnail?.url}
                          width={
                            jewelry?.item?.image[0]?.formats?.thumbnail
                              ?.width || 100
                          }
                          height={
                            jewelry?.item?.image[0]?.formats?.thumbnail
                              ?.height || 100
                          }
                          alt={jewelry?.item?.name || 'Product Image'}
                          className='rounded-md'
                        />
                      )
                    ) : (
                      <Image
                        src={jewelry?.item?.image?.formats?.thumbnail?.url}
                        width={
                          jewelry?.item?.image?.formats?.thumbnail?.width || 100
                        }
                        height={
                          jewelry?.item?.image?.formats?.thumbnail?.height ||
                          100
                        }
                        alt={jewelry?.item?.name || 'Product Image'}
                        className='rounded-md'
                      />
                    )}

                    <div className='ml-4 flex-grow'>
                      <h2 className='text-lg font-bold'>
                        {jewelry?.item?.name
                          ? jewelry?.item?.name
                          : jewelry?.item?.Name}
                      </h2>
                    </div>
                    <div className='text-lg pr-4 font-bold text-[#EA4492]'>
                      {jewelry?.info?.quantity || 'N/A'} x $
                      {calculateDiscountedPrice(jewelry?.item?.price || 0, jewelry?.item?.discount || 0)}
                    </div>
                  </div>
                ))}
              </div>
              {/* Subtotal and Delivery Fee */}
              <div className='flex justify-between text-xl font-semibold mt-6'>
                <p>Subtotal:</p>
                <p>${state.subtotal}</p>
              </div>
              <div
                className={
                  state.address.paymentType === 'CC'
                    ? 'hidden'
                    : 'flex justify-between text-xl font-semibold mt-2'
                }
              >
                <p>Delivery:</p>
                <p>${state.delivery}</p>
              </div>
              <div
                className={
                  !coupon
                    ? 'hidden'
                    : 'flex justify-between text-xl font-semibold mt-2'
                }
              >
                <p>Coupon:</p>
                <p>{`${coupon?.discountType === 'percentage' ? '-%' : '-$'}${coupon?.discountValue || 0.0}`}</p>
              </div>
              <div>
                <form action='' className='mt-5'>
                  <span className='h-5 text-red-400 py-4'>
                    {setCouponError ? couponError : ''}
                  </span>
                  <div className='md:grid md:grid-cols-2 '>
                    <div className='flex space-x-4'>
                      <input
                        placeholder='Coupon Code'
                        className='w-[50%] h-[50px] px-5 border-2 border-black'
                        value={code}
                        onChange={evt => setCode(evt.target.value)}
                      />
                      <button
                        type='submit'
                        className='px-[40px] py-[10px] bg-pink-400 text-white hover:bg-white hover:text-pink-400'
                        onClick={applyCoupon}
                      >
                        Submit
                      </button>
                    </div>
                    <div className={coupon ? 'flex space-x-2 mt-2' : 'hidden'}>
                      <p className='text-green-400 text-2xl '>{coupon?.code}</p>
                      <RxCross2
                        className='text-xl cursor-pointer'
                        onClick={removeCoupon}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
