import { escapeHtml } from '../lib/sanitize';

// Email templates for better deliverability and professional appearance

export function generateOrderConfirmationTemplate(order, orderId) {
  const safeFirstName = escapeHtml(order.firstName || order.address?.firstName || '');
  const safeLastName = escapeHtml(order.lastName || order.address?.lastName || '');
  const safeOrderId = escapeHtml(orderId);
  const safeStreet = escapeHtml(order.street || order.address?.street || '');
  const safeApartment = escapeHtml(order.apartment || order.address?.apartment || '');
  const safeCity = escapeHtml(order.city || order.address?.city || '');
  const safeLocation = escapeHtml(order.shippingLocation || order.address?.shippingLocation || '');
  const safePhone = escapeHtml(order.phone || order.address?.phone || '');
  const safeDate = escapeHtml(order.date || new Date().toLocaleDateString());
  const safeSubtotal = escapeHtml(String(order.subtotal || '0.00'));

  const itemsHtml = (order.cart || []).map(item => {
    const safeName = escapeHtml(item.item?.name || 'Unknown item');
    const imageUrl = item.info?.ItemType === 'Merchandise'
      ? item.item?.image?.[0]?.url
      : item.item?.image?.url;
    const qty = Number(item.info?.quantity) || 0;
    const price = Number(item.item?.price) || 0;

    return `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 15px; text-align: center;">
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${safeName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">` : ''}
      </td>
      <td style="padding: 15px;">
        <strong style="color: #333; font-size: 16px;">${safeName}</strong><br>
        <span style="color: #666; font-size: 14px;">Quantity: ${qty}</span>
      </td>
      <td style="padding: 15px; text-align: right; font-weight: bold; color: #333;">
        $${(price * qty).toFixed(2)}
      </td>
    </tr>
  `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - SherryBerries</title>
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #ff6b6b; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .order-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .footer { background-color: #333; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your order has been confirmed</p>
        </div>

        <div class="content">
          <p>Dear <strong>${safeFirstName} ${safeLastName}</strong>,</p>

          <p>Thank you for choosing SherryBerries! We're excited to confirm that your order <strong>#${safeOrderId}</strong> has been received and is now being processed.</p>

          <div class="order-details">
            <h3 style="margin-top: 0; color: #333;">Order Information</h3>
            <p><strong>Order Number:</strong> #${safeOrderId}</p>
            <p><strong>Order Date:</strong> ${safeDate}</p>
            <p><strong>Total Amount:</strong> $${safeSubtotal}</p>
          </div>

          <h3 style="color: #333;">Shipping Address</h3>
          <p>
            ${safeFirstName} ${safeLastName}<br>
            ${safeStreet}${safeApartment ? ', ' + safeApartment : ''}<br>
            ${safeCity}, ${safeLocation}<br>
            <strong>Phone:</strong> ${safePhone}
          </p>

          <h3 style="color: #333;">Order Items</h3>
          <table class="items-table">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 15px; text-align: left;">Image</th>
                <th style="padding: 15px; text-align: left;">Item</th>
                <th style="padding: 15px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; margin: 20px 0;">
            <p style="font-size: 18px; font-weight: bold; color: #333;">
              Order Total: $${safeSubtotal}
            </p>
          </div>

          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #2d5a2d;">What's Next?</h4>
            <ul style="color: #2d5a2d;">
              <li>We'll send you a shipping confirmation once your order is dispatched</li>
              <li>Estimated delivery time: 3-7 business days</li>
              <li>Track your order status in your account dashboard</li>
            </ul>
          </div>

          <p>If you have any questions about your order, please don't hesitate to contact our customer support team. We're here to help!</p>

          <p>Thank you for shopping with SherryBerries!</p>

          <p>Best regards,<br>
          <strong>The SherryBerries Team</strong></p>
        </div>

        <div class="footer">
          <p style="margin: 0;">&copy; 2024 SherryBerries. All rights reserved.</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">
            <a href="mailto:support@sherryberries.com" style="color: #ff6b6b;">support@sherryberries.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePlainTextOrderConfirmation(order, orderId) {
  const firstName = order.firstName || order.address?.firstName || '';
  const lastName = order.lastName || order.address?.lastName || '';
  const street = order.street || order.address?.street || '';
  const apartment = order.apartment || order.address?.apartment || '';
  const city = order.city || order.address?.city || '';
  const location = order.shippingLocation || order.address?.shippingLocation || '';
  const phone = order.phone || order.address?.phone || '';

  return `
Order Confirmation #${orderId} - SherryBerries

Dear ${firstName} ${lastName},

Thank you for choosing SherryBerries! We're excited to confirm that your order has been received and is now being processed.

ORDER INFORMATION:
Order Number: #${orderId}
Order Date: ${order.date || new Date().toLocaleDateString()}
Total Amount: $${order.subtotal || '0.00'}

SHIPPING ADDRESS:
${firstName} ${lastName}
${street}${apartment ? ', ' + apartment : ''}
${city}, ${location}
Phone: ${phone}

ORDER ITEMS:
${(order.cart || []).map(item =>
  `- ${item.item?.name || 'Unknown'} (Qty: ${item.info?.quantity || 0}) - $${((Number(item.item?.price) || 0) * (Number(item.info?.quantity) || 0)).toFixed(2)}`
).join('\n')}

ORDER TOTAL: $${order.subtotal || '0.00'}

WHAT'S NEXT?
- We'll send you a shipping confirmation once your order is dispatched
- Estimated delivery time: 3-7 business days
- Track your order status in your account dashboard

If you have any questions about your order, please contact our customer support team at support@sherryberries.com

Thank you for shopping with SherryBerries!

Best regards,
The SherryBerries Team
  `;
}
