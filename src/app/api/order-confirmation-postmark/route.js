import { ServerClient } from 'postmark';
import { generateOrderConfirmationTemplate, generatePlainTextOrderConfirmation } from '../../../utils/emailTemplates';
import { requireAuth } from '@/lib/auth';
import { orderConfirmationSchema, validateBody } from '@/lib/validation';

const client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN);

export async function POST(req) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const { data: validated, error: validationError } = validateBody(body, orderConfirmationSchema);
    if (validationError) return validationError;

    const { email, order, orderId } = validated;

    // Send email using Postmark
    const response = await client.sendEmail({
      From: 'orders@sherry-berries.com', // Must be verified in Postmark
      To: email,
      Subject: `Order Confirmation #${orderId} - SherryBerries`,
      HtmlBody: generateOrderConfirmationTemplate(order, orderId),
      TextBody: generatePlainTextOrderConfirmation(order, orderId),
      MessageStream: 'outbound', // Use transactional stream
      Tag: 'order-confirmation',
      Metadata: {
        orderId: orderId,
        customerEmail: email
      }
    });

    
    return Response.json({
      message: 'Confirmation Email was successfully sent',
      status: 200,
      messageId: response.MessageID
    });

  } catch (error) {
    
    // Handle specific Postmark errors
    if (error.code) {
    }
    
    return Response.json(
      { 
        error: 'Failed to send email', 
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  }
}

// Optional: Add webhook handler for delivery status updates
export async function PUT(req) {
  try {
    const webhookData = await req.json();
    
    // Handle Postmark webhook events (bounces, opens, clicks, etc.)
    
    // You can update your database based on delivery status
    // For example, mark email as delivered, bounced, etc.
    
    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}




