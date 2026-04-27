'use client';

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from '../../../context/AppContext';
import ErrorBoundary from './ErrorBoundary';
import InactivityHandler from './TimeOut';
import Navigation from './Navigation';
import Footer from './Footer';
import SkipNavigation from './SkipNavigation';

export default function Providers({ children }) {
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [cartId, setCartId] = useState(0);

  return (
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
                <Navigation />
                <div id='main-content' tabIndex={-1}>
                  {children}
                </div>
              </InactivityHandler>
            </SessionProvider>
          </div>
          <Footer />
        </ErrorBoundary>
      </AppContext.Provider>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
}
