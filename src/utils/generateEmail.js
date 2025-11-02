// lib/generateEmail.js
import Mailgen from 'mailgen';

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'SherryBerries',
    link:
      process.env.NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL ||
      'http://localhost:3000'
  }
});

export function generateEmail({ name, intro, outro }) {
  return mailGenerator.generate({
    body: {
      name,
      intro,
      outro
    }
  });
}

export function generatePlainText({ name, intro, outro }) {
  return mailGenerator.generatePlaintext({
    body: {
      name,
      intro,
      outro
    }
  });
}
