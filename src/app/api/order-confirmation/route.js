import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { ServerClient } from "postmark";
import { generateOrderConfirmationTemplate, generatePlainTextOrderConfirmation } from '../../../utils/emailTemplates';

// const mailgun = new Mailgun(FormData);
// const mgClient = mailgun.client({
//   username: 'api',
//   key: process.env.MAILGUN_API_KEY // Ensure the key is correct in .env.local
// });
var client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN);
export async function POST(req) {
  try {
    const { email, order, orderId } = await req.json();
    console.log('Received POST body:', { email, order, orderId });
    const response = await mgClient.messages.create(
      process.env.NEXT_PUBLIC_MAILGUN_DOMAIN,
      {
        from: `SherryBerries <noreply@sherry-berries.com>`,
        to: `${email}`,
        subject: 'order confirmation',
        //text: mailGenerator.generate(emailOps),
        html: `
                       <html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px;">
    
    <h2 style="color: #333;">Thank you for your order!</h2>
    
    <p>Hello <strong>${order.firstName|| order.address.firstName} ${order.lastName|| order.address.lastName}</strong>,</p>

    <p>We're happy to let you know that your order <strong>#${orderId}</strong> has been received and is now being processed.</p>

    <hr style="margin: 20px 0;">

    <h4 style="margin-bottom: 5px;">Order Summary:</h4>
    <p><strong>Order ID:</strong> #${orderId}</p>
    <p><strong>Date:</strong> ${order.date || '2025-04-30'}</p>
    <p><strong>Total:</strong> ${order.subtotal}</p>
    
    <div style="margin-top: 20px;">
      <h4 style="margin-bottom: 5px;">Shipping Details:</h4>
      <p>${order.firstName|| order.address.firstName} ${order.lastName|| order.address.lastName}</p>
      <p>${order.street|| order.address.street},${order?.apartment|| order.address.apartment}</p>
      <p>${order.city|| order.address.city}, ${order.shippingLocation|| order.address.shippingLocation}</p>
      <p><strong>Phone:</strong> ${order.phone|| order.address.phone}</p>
    </div>

     s<div style="margin-top: 20px;">
      <h4 style="margin-bottom: 5px;">Items:</h4>
      <ul style="padding-left: 0; list-style-type: none;">
        ${order.cart
    .map(
      item => `
          <li style="display: flex; align-items: center; margin-bottom: 15px;">
            <img src="${
  item.info.ItemType === 'Merchandise'
    ? `${item.item.image[0].url}`
    : `${item.item.image.url}`
}" alt="${item.item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
            <div>
              <p style="margin: 0; font-weight: bold;">${item.item.name}</p>
              <p style="margin: 0;">Quantity: ${item.info.quantity}</p>
              <p style="margin: 0;">Price: $${item.item.price}</p>
            </div>
          </li>
        `
    )
    .join('')}
      </ul>
    </div>

    <hr style="margin: 20px 0;">

    <p>If you have any questions about your order, feel free to reply to this email or contact our support team.</p>

    <p style="margin-top: 30px;">Thanks again for shopping with us!</p>

    <p><strong>SherryBerries</strong><br>
    sherryberries.com</p>
  </div>
</body>
</html>
                    `
      }
    );
    console.log('Mailgun response:', response); // Log the successful response
    return new Response(
      JSON.stringify({
        message: 'Confirmation Email was successfully sent',
        status: 200
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
