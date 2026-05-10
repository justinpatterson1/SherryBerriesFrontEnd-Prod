import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from './components/Providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
});
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap'
});

export const metadata = {
  title: {
    default: 'SherryBerries | Jewelry, Waistbeads & More',
    template: '%s | SherryBerries'
  },
  description: 'Shop premium handcrafted jewelry, waistbeads, clothing and aftercare products from SherryBerries.',
  openGraph: {
    siteName: 'SherryBerries',
    type: 'website'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
