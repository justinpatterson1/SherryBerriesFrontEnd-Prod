'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AiOutlineProduct, AiFillTags } from 'react-icons/ai';
import { FaChevronDown, FaChevronUp, FaBars, FaTimes ,FaHome, FaUser} from 'react-icons/fa';
import { FaChartSimple } from 'react-icons/fa6';
import Orders from '../components/dashboard/Orders.jsx';
import Jewelry from '../components/dashboard/Jewelry.jsx';
import Waistbead from '../components/dashboard/Waistbeads.jsx';
import Merchandise from '../components/dashboard/Merchandise.jsx';
import Blogs from '../components/dashboard/Blog.jsx';
import Aftercare from '../components/dashboard/Aftercare.jsx';
import DashboardOverview from '../components/dashboard/DashboardOverview.jsx';
import { FaPencilAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader.jsx';

function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOrdersDropdown, setOrdersShowDropdown] = useState(false);
  const [displayOpenOrderComponent, setDisplayOpenOrderComponent] =
    useState(false);
  const [displayJewelryComponent, setDisplayJewelryComponent] = useState(false);
  const [displayWaistbeadComponent, setDisplayWaistbeadComponent] =
    useState(false);
  const [displayMerchandiseComponent, setDisplayMerchandiseComponent] =
    useState(false);
  const [displayBlogComponent, setDisplayBlogComponent] = useState(false);
  const [displayAftercareComponent, setDisplayAftercareComponent] =
    useState(false);
  const [displayOverview, setDisplayOverview] = useState(true);
  const [orders, setOrders] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);


  // if(session.user.role_type !== 'admin'){
  //   redirect("/")

  // }

  useEffect(() => {
    const fetchData = async() => {
      try {
        if (session?.jwt) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/orders?populate[0]=cart.Items&populate[1]=cart.Items.jewelries.image&populate[2]=cart.Items.waistbeads.image&populate[3]=cart.Items.merchandises.image&populate[4]=cart.Items.aftercares.image&filters[isPaid][$eq]=false`,
            {
              headers: {
                Authorization: `Bearer ${session.jwt}`,
                'Content-Type': 'application/json'
              }
            }
          );
          const orderData = await res.json();
          setOrders(orderData);
        }
      } catch (error) {
      }
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    if (status === 'loading') return; // Don't redirect while loading

    if (session.user.role_type !== 'admin') {
      router.replace('/'); // Redirect to home if not admin
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.user.role_type !== 'admin') {
    return <Loader />; // Optionally show a loader instead
  }
  const resetAllComponents = () => {
    setDisplayOpenOrderComponent(false);
    setDisplayJewelryComponent(false);
    setDisplayWaistbeadComponent(false);
    setDisplayMerchandiseComponent(false);
    setDisplayBlogComponent(false);
    setDisplayAftercareComponent(false);
    setShowDropdown(false);
    setOrdersShowDropdown(false);
  };

  const handleOverviewClick = () => {
    resetAllComponents();
    setDisplayOverview(true);
  };

  return (
    <div className='flex h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Sidebar */}
      <div
        className={`bg-white w-64 p-6 space-y-6 transition-transform duration-300 ease-in-out shadow-xl
                      ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                      md:translate-x-0 md:relative fixed z-50 h-full`}
      >
        {/* Header */}
        <div className='flex items-center space-x-3 mb-8'>
          <div className='w-10 h-10 bg-brand rounded-lg flex items-center justify-center'>
            <FaChartSimple className='text-white text-xl' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>Dashboard</h1>
            <p className='text-sm text-gray-500'>Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className='space-y-2'>
          {/* Overview */}
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              displayOverview ? 'bg-brand text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={handleOverviewClick}
          >
            <FaHome className='text-lg' />
            <span className='font-medium'>Overview</span>
          </div>

          {/* Products */}
          <div>
            <div
              className='flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100'
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className='flex items-center space-x-3'>
                <AiOutlineProduct className='text-lg text-gray-700' />
                <span className='font-medium text-gray-700'>Products</span>
              </div>
              {showDropdown ? <FaChevronUp className='text-gray-500' /> : <FaChevronDown className='text-gray-500' />}
            </div>
            {showDropdown && (
              <div className='ml-6 mt-2 space-y-1'>
                <div
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    displayJewelryComponent ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    resetAllComponents();
                    setDisplayJewelryComponent(true);
                  }}
                >
                  Jewelry
                </div>
                <div
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    displayWaistbeadComponent ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    resetAllComponents();
                    setDisplayWaistbeadComponent(true);
                  }}
                >
                  Waistbeads
                </div>
                <div
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    displayMerchandiseComponent ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    resetAllComponents();
                    setDisplayMerchandiseComponent(true);
                  }}
                >
                  Merchandise
                </div>
                <div
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    displayAftercareComponent ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    resetAllComponents();
                    setDisplayAftercareComponent(true);
                  }}
                >
                  After Care
                </div>
              </div>
            )}
          </div>

          {/* Orders */}
          <div>
            <div
              className='flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100'
              onClick={() => {
                setOrdersShowDropdown(!showOrdersDropdown);
              }}
            >
              <div className='flex items-center space-x-3'>
                <AiFillTags className='text-lg text-gray-700' />
                <span className='font-medium text-gray-700'>Orders</span>
              </div>
              {showOrdersDropdown ? <FaChevronUp className='text-gray-500' /> : <FaChevronDown className='text-gray-500' />}
            </div>
            {showOrdersDropdown && (
              <div className='ml-6 mt-2 space-y-1'>
                <div
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    displayOpenOrderComponent ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    resetAllComponents();
                    setDisplayOpenOrderComponent(true);
                  }}
                >
                  Manage Orders
                </div>
              </div>
            )}
          </div>

          {/* Blogs */}
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              displayBlogComponent ? 'bg-brand text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => {
              resetAllComponents();
              setDisplayBlogComponent(true);
            }}
          >
            <FaPencilAlt className='text-lg' />
            <span className='font-medium'>Blogs</span>
          </div>
        </nav>

        {/* User Info */}
        <div className='mt-auto pt-6 border-t border-gray-200'>
          <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
            <div className='w-8 h-8 bg-brand rounded-full flex items-center justify-center'>
              <FaUser className='text-white text-sm' />
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium text-gray-900'>{session?.user?.firstName} {session?.user?.lastName}</p>
              <p className='text-xs text-gray-500'>Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Sidebar Button (Mobile) */}
      <button
        className='md:hidden fixed top-4 left-4 z-50 bg-brand text-white p-3 rounded-lg shadow-lg hover:bg-pink-600 transition-colors duration-300'
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Overlay */}
      {showSidebar && (
        <div 
          className='md:hidden fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto bg-gray-50'>
        {displayOverview && <DashboardOverview />}
        {displayOpenOrderComponent && <Orders />}
        {displayJewelryComponent && <Jewelry />}
        {displayWaistbeadComponent && <Waistbead />}
        {displayMerchandiseComponent && <Merchandise />}
        {displayBlogComponent && <Blogs />}
        {displayAftercareComponent && <Aftercare />}
      </main>
    </div>
  );
}

export default Page;
