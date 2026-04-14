// pages/api/sendEmail.js

import { ServerClient } from 'postmark';
import FormData from 'form-data';


const client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN);

// const mailGenerator = new Mailgen({
//   theme: 'default',
//   product: {
//       // Appears in header & footer of e-mails
//       name: 'SherryBerries',
//       link: process.env.NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL
//       // Optional product logo
//       // logo: 'https://mailgen.js/img/logo.png'
//   }
// });

export async function POST(req) {
  //return Response.json({ message: "Hello, world!" });
  // Log the incoming request to check if it's reaching the backend
  console.log('Received request:', req.method);
  // console.log('Request body:', req.body);  // This will log the request data

  if (req.method === 'POST') {
    const { name, email, message } = await req.json();

    // const data = {
    //   from: `${email}`,
    //   to: `${process.env.NEXT_PUBLIC_EMAIL}`,
    //   subject: `New message from ${name}`
    //   //text: `Message from: ${email}\n\n${message}`,
    //   // outro:'Need help, or have questions? Just reply to this email, we\'d love to help.',
    //   // intro:'Thank you for Messaging Sherry Berries',
    //   // html
    // };

    // const emailOps = {
    //   body: {
    //     name,
    //     intro: 'Thank you for Messaging Sherry Berries',
    //     outro: message
    //   }
    // };

    // console.log(data);

    try {
      const response = await client.sendEmail({
        From: 'info@sherry-berries.com',// Must be verified in Postmark
        To: process.env.NEXT_PUBLIC_EMAIL,
        Subject: `Message from ${name}`,
        HtmlBody: `<strong>${message}</strong>`,
        TextBody: message,
        ReplyTo: email,
        MessageStream: 'outbound', // Use transactional stream
        // Tag: 'order-confirmation',
        // Metadata: {
        //   orderId: orderId,
        //   customerEmail: email
        // }
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
}

//  export async function POST(req) {
//     try {
//       console.log("Received request:", req.method);

//       // Parse the request body properly
//     //   const body = await req.json();
//     //   console.log("Request body:", body);

//       return new Response(JSON.stringify({ message: "Email sent successfully!" }), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (error) {
//       console.error("Error in sendEmail route:", error);

//       return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   }
