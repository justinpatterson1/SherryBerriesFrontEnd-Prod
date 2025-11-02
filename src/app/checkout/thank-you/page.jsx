'use server';
import React from 'react';
import { authOptions } from '../../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { endCart, reduceQuantity } from '../../lib/reduceCart';
import { getCartItem } from '../../lib/func';

async function page({ searchParams }) {
  const params = await searchParams;
  const id = params?.order_id;

  const session = await getServerSession(authOptions);
  console.log('Session:', session);

  if (params?.status === 'success'  && id) {
    // Debug environment variable
    console.log('Environment URL:', process.env.NEXT_PUBLIC_SHERRYBERRIES_URL);
    
    if (!process.env.NEXT_PUBLIC_SHERRYBERRIES_URL) {
      console.error('NEXT_PUBLIC_SHERRYBERRIES_URL environment variable is not set!');
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
    console.log('Order fetch response:', json);

    const orders = json?.data?.[0];
    const items = getCartItem(json?.data?.[0]?.cart?.Items);
    const cartId = json?.data?.[0]?.cart?.documentId;

    // Additional validation for Strapi v5
    if (!orders) {
      console.error('No order found with ID:', id);
      throw new Error(`No order found with ID: ${id}`);
    }

    console.log('Found order:', {
      documentId: orders.documentId,
      orderId: orders.orderId,
      status: orders.order_status,
      isPaid: orders.isPaid
    });

    const sendConfirmationEmail = async() => {
      // Validate required data for email
      if (!session?.user?.email) {
        console.error('User email is missing from session');
        throw new Error('User email is required for order confirmation');
      }

      if (!session?.user?.firstname || !session?.user?.lastname) {
        console.error('User name is missing from session:', {
          firstname: session?.user?.firstname,
          lastname: session?.user?.lastname
        });
        throw new Error('User name is required for order confirmation');
      }

      // Build order object with conditional apartment field
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

      // Only add apartment if it exists
      if (orders.address?.apartment) {
        orderData.apartment = orders.address.apartment;
      }

      const payload = {
        email: session.user.email,
        order: orderData,
        orderId: id
      };

      console.log('Payload:', payload);

      // Use absolute URL for server-side fetch
      const baseUrl = process.env.NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL || 'http://localhost:3000';
      const emailUrl = `${baseUrl}/api/order-confirmation-postmark`;
      
      console.log('Sending confirmation email to:', emailUrl);
      
      const resp = await fetch(
        emailUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Email confirmation failed:', {
          status: resp.status,
          statusText: resp.statusText,
          error: errorText
        });
        throw new Error(`Unable to send confirmation Email: ${resp.status} ${resp.statusText}`);
      }

      if (resp.ok) {
        const order = await resp.json();
        console.log('Email confirmation sent successfully:', order);
      }
    };

    if (orders) {
      try {
        // Validate required data
        if (!orders.documentId) {
          throw new Error('Order documentId is missing');
        }
        
        if (!session?.jwt) {
          throw new Error('User session JWT is missing');
        }

        console.log('Updating order with data:', {
          orderId: orders.documentId,
          order_status: 'open',
          isPaid: true,
          transaction_id: params?.transaction_id || null
        });

        // Log the current order state for debugging
        console.log('Current order state:', {
          documentId: orders.documentId,
          currentStatus: orders.order_status,
          currentIsPaid: orders.isPaid,
          currentTransactionId: orders.transaction_id
        });

        // For Strapi v5, we need to use the correct API structure
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
                transaction_id: params?.transaction_id || null
              }
            })
          }
        );

        console.log('Update response status:', updateOrder.status);
        console.log('Update response headers:', Object.fromEntries(updateOrder.headers.entries()));
        
        if (!updateOrder.ok) {
          const errorText = await updateOrder.text();
          console.error('Order update failed:', {
            status: updateOrder.status,
            statusText: updateOrder.statusText,
            error: errorText,
            url: `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders/${orders.documentId}`,
            requestData: {
              order_status: 'open',
              isPaid: true,
              transaction_id: params?.transaction_id || null
            }
          });
          throw new Error(`Order update failed: ${updateOrder.status} ${updateOrder.statusText} - ${errorText}`);
        }

        const updateResult = await updateOrder.json();
        console.log('Order update successful:', updateResult);

        if (updateOrder.status === 200) {
          //await sendConfirmationEmail();
          await reduceQuantity(items, session?.jwt);
          await endCart(cartId, session);
        }
      } catch (error) {
        console.error('Error updating order:', error);
        // Don't throw the error to prevent the page from crashing
        // The user should still see the thank you page
      }
    }
  

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-[#ffefef]  px-4'>
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
            {params?.order_id}
          </p>
        </div>
        <p className='text-sm text-gray-500 mt-6'>
          A confirmation email has been sent to {session?.user?.email}.
        </p>
        <a href='/' className='mt-6 inline-block text-blue-600 hover:underline'>
          Return to Home
        </a>
      </div>
    </div>
  );
}  else if (params?.status === 'failed') {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-[#ffefef]  px-4'>
      <div className='bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center'>
        <h1 className='text-3xl font-bold text-[#EA4492] mb-4'>
          Sorry! Something went wrong.
        </h1>
        <p className='text-lg text-gray-700 mb-6'>
          Your transaction was not successful. Try again later.
        </p>
        {/* <div className='bg-gray-100 rounded-md p-4 border border-dashed border-gray-300'>
          <span className='text-sm text-gray-500'>Order ID</span>
          <p className='text-l font-semibold text-gray-800'>
            {params?.order_id}
          </p>
        </div>
        <p className='text-sm text-gray-500 mt-6'>
          A confirmation email has been sent to {session?.user?.email}.
        </p> */}
        <a href='/' className='mt-6 inline-block text-blue-600 hover:underline'>
          Return to Home
        </a>
      </div>
    </div>
  );
}
}

export default page;
