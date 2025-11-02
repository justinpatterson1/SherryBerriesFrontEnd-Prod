'use client';
import { useState } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AppContext from '../../context/AppContext';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../../context/CartContext';
import InactivityHandler from './components/TimeOut';
import ErrorBoundary from './components/ErrorBoundary';
import SkipNavigation from './components/SkipNavigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function RootLayout({ children }) {
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [cartId, setCartId] = useState(0);

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='flex flex-col min-h-screen'>
          <SkipNavigation />
          <AppContext.Provider
            value={{
              page,
              setPage,
              isLoggedIn,
              setIsLoggedIn,
              user,
              setUser,
              cartId,
              setCartId
            }}
          >
            <ErrorBoundary>
              <div className='min-h-screen'>
                <SessionProvider>
                  <InactivityHandler>
                    {/* <CartProvider>   */}
                    <Navigation />
                    {/* <ClerkProvider> */}
                    {/* <div className=' flex items-center justify-center h-[85vh]'>
              <SignedOut className='h-screen'>
                <SignIn routing="hash"/>
              </SignedOut>
            </div> */}

                    {children}

                    {/* </ClerkProvider> */}
                    {/* </CartProvider> */}
                  </InactivityHandler>
                </SessionProvider>
              </div>
              <Footer />
            </ErrorBoundary>
          </AppContext.Provider>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
