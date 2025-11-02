// Alternative implementation using SendGrid for better deliverability
// Install with: npm install @sendgrid/mail

import sgMail from '@sendgrid/mail';
import { generateOrderConfirmationTemplate, generatePlainTextOrderConfirmation } from '../../../utils/emailTemplates';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { email, order, orderId } = await req.json();
    console.log('Received POST body:', { email, order, orderId });

    const msg = {
      to: email,
      from: {
        email: 'orders@sherryberries.com',
        name: 'SherryBerries'
      },
      subject: `Order Confirmation #${orderId} - SherryBerries`,
      text: generatePlainTextOrderConfirmation(order, orderId),
      html: generateOrderConfirmationTemplate(order, orderId),
      categories: ['order-confirmation'],
      customArgs: {
        orderId: orderId,
        customerEmail: email
      },
      // SendGrid specific settings for better deliverability
      mailSettings: {
        sandboxMode: {
          enable: false // Set to true for testing
        }
      },
      trackingSettings: {
        clickTracking: {
          enable: false,
          enableText: false
        },
        openTracking: {
          enable: false
        }
      }
    };

    // Send email using SendGrid
    const response = await sgMail.send(msg);
    console.log('SendGrid response:', response);

    return Response.json({
      message: 'Confirmation Email was successfully sent',
      status: 200,
      messageId: response[0].headers['x-message-id']
    });

  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    
    // Handle specific SendGrid errors
    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }
    
    return Response.json(
      { 
        error: 'Failed to send email', 
        details: error.message,
        response: error.response?.body 
      },
      { status: 500 }
    );
  }
}







