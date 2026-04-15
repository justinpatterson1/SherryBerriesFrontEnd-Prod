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

    console.log('Postmark response:', response);
    
    return Response.json({
      message: 'Confirmation Email was successfully sent',
      status: 200,
      messageId: response.MessageID
    });

  } catch (error) {
    console.error('Error sending email via Postmark:', error);
    
    // Handle specific Postmark errors
    if (error.code) {
      console.error('Postmark error code:', error.code);
      console.error('Postmark error message:', error.message);
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
    console.log('Postmark webhook received:', webhookData);
    
    // You can update your database based on delivery status
    // For example, mark email as delivered, bounced, etc.
    
    return Response.json({ received: true });
  } catch (error) {
    console.error('Error processing Postmark webhook:', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}




