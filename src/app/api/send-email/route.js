import { ServerClient } from 'postmark';
import { createRateLimiter } from '@/lib/rate-limit';

const client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN);
const limiter = createRateLimiter({ windowMs: 60_000, max: 3 });

export async function POST(req) {
  const limited = limiter(req);
  if (limited) return limited;

  try {
    const { name, email, message } = await req.json();

    const response = await client.sendEmail({
      From: 'info@sherry-berries.com',
      To: process.env.NEXT_PUBLIC_EMAIL,
      Subject: `Message from ${name}`,
      HtmlBody: `<strong>${message}</strong>`,
      TextBody: message,
      ReplyTo: email,
      MessageStream: 'outbound'
    });

    return Response.json({
      message: 'Email was successfully sent',
      messageId: response.MessageID
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
