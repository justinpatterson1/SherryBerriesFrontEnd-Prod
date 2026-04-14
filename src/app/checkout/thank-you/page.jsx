'use server';
import React from 'react';
import crypto from 'crypto';
import { authOptions } from '../../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { endCart, reduceQuantity } from '../../lib/reduceCart';
import { getCartItem } from '../../lib/func';

function verifyWiPayHash(transactionId, total, apiKey, receivedHash) {
  if (!transactionId || !total || !apiKey || !receivedHash) return false;
  const computed = crypto
    .createHash('md5')
    .update(`${transactionId}${total}${apiKey}`)
    .digest('hex');
  return computed === receivedHash;
}

async function page({ searchParams }) {
  const params = await searchParams;
  const id = params?.order_id;
  const status = params?.status;
  const transactionId = params?.transaction_id;
  const wipayMessage = params?.message;
  const wipayTotal = params?.total;
  const wipayDate = params?.date;
  const wipayHash = params?.hash;

  const session = await getServerSession(authOptions);

  if (status === 'success' && id) {
    // Verify WiPay hash to prevent spoofed success responses
    const apiKey = process.env.WIPAY_API_KEY;
    if (apiKey && wipayHash) {
      const isValid = verifyWiPayHash(transactionId, wipayTotal, apiKey, wipayHash);
      if (!isValid) {
        return (
          <div className='min-h-screen flex flex-col justify-center items-center bg-[#ffefef] px-4'>
            <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
              <h1 className='text-3xl font-bold text-red-600 mb-4'>
                Payment Verification Failed
              </h1>
              <p className='text-lg text-gray-700 mb-6'>
                We could not verify this transaction. Please contact support if you believe this is an error.
              </p>
              <a href='/' className='mt-6 inline-block text-blue-600 hover:underline'>
                Return to Home
              </a>
            </div>
          </div>
        );
      }
    }

    if (!process.env.NEXT_PUBLIC_SHERRYBERRIES_URL) {
      throw new Error('API URL environment variable is not configured');
    }

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders?populate[0]=cart.Items.aftercares.image&populate[1]=cart.Items.jewelries.image&populate[2]=cart.Items.waistbeads.image&populate[3]=cart.Items.merchandises.image&filters[orderId][$eq]=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.jwt}`
        }
      }
    );

    const json = await resp.json();

    const orders = json?.data?.[0];
    const items = getCartItem(json?.data?.[0]?.cart?.Items);
    const cartId = json?.data?.[0]?.cart?.documentId;

    if (!orders) {
      throw new Error(`No order found with ID: ${id}`);
    }

    const sendConfirmationEmail = async() => {
      if (!session?.user?.email) {
        throw new Error('User email is required for order confirmation');
      }

      if (!session?.user?.firstname || !session?.user?.lastname) {
        throw new Error('User name is required for order confirmation');
      }

      const orderData = {
        firstName: session.user.firstname,
        lastName: session.user.lastname,
        date: orders.date,
        subtotal: orders.subtotal,
        street: orders.shipping_address.split(',')[0],
        city: orders.shipping_address.split(',')[1],
        shippingLocation: orders.shipping_address.split(',')[2],
        phone: orders.phone,
        cart: items
      };

      if (orders.address?.apartment) {
        orderData.apartment = orders.address.apartment;
      }

      const payload = {
        email: session.user.email,
        order: orderData,
        orderId: id
      };

      const baseUrl = process.env.NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL || 'http://localhost:3000';
      const emailUrl = `${baseUrl}/api/order-confirmation-postmark`;

      const resp = await fetch(emailUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Unable to send confirmation Email: ${resp.status} ${resp.statusText}`);
      }
    };

    if (orders) {
      try {
        if (!orders.documentId) {
          throw new Error('Order documentId is missing');
        }

        if (!session?.jwt) {
          throw new Error('User session JWT is missing');
        }

        const updateOrder = await fetch(
          `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders/${orders.documentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.jwt}`
            },
            body: JSON.stringify({
              data: {
                order_status: 'open',
                isPaid: true,
                transaction_id: transactionId || null,
                wipay_total: wipayTotal || null,
                wipay_message: wipayMessage || null,
                wipay_date: wipayDate || null
              }
            })
          }
        );

        if (!updateOrder.ok) {
          const errorText = await updateOrder.text();
          throw new Error(`Order update failed: ${updateOrder.status} ${updateOrder.statusText} - ${errorText}`);
        }

        const updateResult = await updateOrder.json();

        if (updateOrder.status === 200) {
          //await sendConfirmationEmail();
          await reduceQuantity(items, session?.jwt);
          await endCart(cartId, session);
        }
      } catch (error) {
        // Don't throw — the user should still see the thank you page
      }
    }

    return (
      <div className='min-h-screen flex flex-col justify-center items-center bg-[#ffefef] px-4'>
        <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
          <h1 className='text-3xl font-bold text-[#EA4492] mb-4'>
            Thank You for Your Order!
          </h1>
          <p className='text-lg text-gray-700 mb-6'>
            Your order has been placed successfully.
          </p>
          <div className='bg-gray-100 rounded-md p-4 border border-dashed border-gray-300'>
            <span className='text-sm text-gray-500'>Order ID</span>
            <p className='text-l font-semibold text-gray-800'>
              {id}
            </p>
          </div>
          {wipayTotal && (
            <p className='text-sm text-gray-600 mt-3'>
              Amount charged: ${wipayTotal} TTD
            </p>
          )}
          <p className='text-sm text-gray-500 mt-6'>
            A confirmation email has been sent to {session?.user?.email}.
          </p>
          <a href='/' className='mt-6 inline-block text-blue-600 hover:underline'>
            Return to Home
          </a>
        </div>
      </div>
    );
  } else if (status === 'failed') {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center bg-[#ffefef] px-4'>
        <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
          <h1 className='text-3xl font-bold text-[#EA4492] mb-4'>
            Payment Failed
          </h1>
          <p className='text-lg text-gray-700 mb-6'>
            Your transaction was not successful. Please try again.
          </p>
          {wipayMessage && (
            <p className='text-sm text-gray-500 mb-4'>
              Reason: {wipayMessage}
            </p>
          )}
          <a href='/checkout' className='mt-4 inline-block text-blue-600 hover:underline mr-4'>
            Try Again
          </a>
          <a href='/' className='mt-4 inline-block text-blue-600 hover:underline'>
            Return to Home
          </a>
        </div>
      </div>
    );
  } else if (status === 'error') {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center bg-[#ffefef] px-4'>
        <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
          <h1 className='text-3xl font-bold text-red-600 mb-4'>
            Transaction Error
          </h1>
          <p className='text-lg text-gray-700 mb-6'>
            An error occurred while processing your payment. No charge was made.
          </p>
          {wipayMessage && (
            <p className='text-sm text-gray-500 mb-4'>
              Details: {wipayMessage}
            </p>
          )}
          <a href='/checkout' className='mt-4 inline-block text-blue-600 hover:underline mr-4'>
            Try Again
          </a>
          <a href='/' className='mt-4 inline-block text-blue-600 hover:underline'>
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // No status param — user navigated here directly
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-[#ffefef] px-4'>
      <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
        <h1 className='text-3xl font-bold text-gray-700 mb-4'>
          No Transaction Found
        </h1>
        <p className='text-lg text-gray-500 mb-6'>
          It looks like you arrived here without completing a payment.
        </p>
        <a href='/' className='mt-6 inline-block text-blue-600 hover:underline'>
          Return to Home
        </a>
      </div>
    </div>
  );
}

export default page;
