'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { 
  FaLocationDot, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaFacebookF, 
  FaInstagram, 
  FaTiktok, 
  FaXTwitter,
  FaPaperPlane,
  FaUser,
  FaComments,
 
} from 'react-icons/fa6';
import {FaCheckCircle} from 'react-icons/fa';
import FadeInSection from '../components/FadeInSection';
import Image from 'next/image';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState();
  const [errors, setErrors] = useState({});

  const success = () => toast('🎉 Message sent successfully! We\'ll get back to you soon.', {
    position: 'top-right',
    className: 'toast-success'
  });
  
  const failure = () => toast('❌ Oops! Unable to send your message. Please try again.', {
    position: 'top-right',
    className: 'toast-error'
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 429) {
        toast.error('Too many requests. Please try again in 1 minute.');
        return;
      }

      if (response.ok) {
        success();
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setErrors({});

        //Reset submitted state after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        failure();
      }
    } catch (error) {
      failure();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/sign-up?populate=*`)
      .then(res => res.json())
      .then(json => {
        setData(json.data);
      })
      .catch(() => {});
  }, []);

  const contactInfo = [
    // {
    //   icon: FaLocationDot,
    //   title: 'Visit Us',
    //   details: ['123 Fashion Street', 'Your City, State 12345'],
    //   color: 'text-blue-500'
    // },
    {
      icon: FaPhone,
      title: 'Call Us',
      details: ['+1 (868) 779-1838'],
      color: 'text-green-500'
    },
    {
      icon: FaEnvelope,
      title: 'Email Us',
      details: ['info@sherry-berries.com', 'support@sherry-berries.com'],
      color: 'text-purple-500'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Monday - Friday: 10AM - 8PM', 'Saturday: 10AM - 4PM', 'Sunday: Closed'],
      color: 'text-orange-500'
    }
  ];

  const socialLinks = [
    //{ icon: FaFacebookF, href: 'https://www.facebook.com', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://www.instagram.com/sherryberries_?igsh=MTRzOWF2aTQ4Y3A5OQ%3D%3D&utm_source=qr', label: 'Instagram' },
    { icon: FaTiktok, href: 'https://www.tiktok.com/@sherrybvanessa?_t=ZM-900BUOlr0Jf&_r=1', label: 'TikTok' },
   // { icon: FaXTwitter, href: 'https://www.twitter.com', label: 'Twitter' }
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50'>
      {/* Hero Section */}
      <FadeInSection>
        <div className='bg-gradient-to-r from-[#EA4492] to-pink-600 py-20 px-4'>
          <div className='container mx-auto text-center'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6'>
              Get In Touch
            </h1>
            <p className='text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto'>
              We'd love to hear from you! Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </FadeInSection>

      <div className='container mx-auto py-16 px-4'>
        <div className='grid lg:grid-cols-3 gap-12'>
          
          {/* Contact Information */}
          <FadeInSection>
            <div className='space-y-8'>
              <div>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>Contact Information</h2>
                <p className='text-gray-600 leading-relaxed'>
                  Have questions about our products or need help with your order? 
                  We're here to help! Reach out to us through any of the methods below.
                </p>
              </div>

              <div className='space-y-6'>
                {contactInfo.map((info, index) => (
                  <div key={index} className='flex items-start space-x-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100'>
                    <div className={`w-12 h-12 ${info.color} bg-current bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-1'>{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className='text-gray-600 text-sm'>
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
                <h3 className='font-semibold text-gray-900 mb-4'>Follow Us</h3>
                <div className='flex space-x-4'>
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='w-10 h-10 bg-gray-100 hover:bg-[#EA4492] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group'
                      aria-label={social.label}
                    >
                      <social.icon className='w-5 h-5 text-gray-600 group-hover:text-white' />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Contact Form */}
          <FadeInSection>
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
                <div className='p-8'>
                  <div className='mb-8'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-2'>Send us a Message</h2>
                    <p className='text-gray-600'>
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  {isSubmitted && (
                    <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center'>
                      <FaCheckCircle className='text-green-500 mr-3' size={20} />
                      <span className='text-green-700 font-medium'>
                        Thank you! Your message has been sent successfully.
                      </span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid md:grid-cols-2 gap-6'>
                      <div>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                          <FaUser className='inline mr-2' size={14} />
                          Full Name *
                        </label>
                        <input
                          type='text'
                          id='name'
                          name='name'
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA4492] focus:border-transparent transition-all duration-300 ${
                            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder='Enter your full name'
                        />
                        {errors.name && (
                          <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                          <FaEnvelope className='inline mr-2' size={14} />
                          Email Address *
                        </label>
                        <input
                          type='email'
                          id='email'
                          name='email'
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA4492] focus:border-transparent transition-all duration-300 ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder='Enter your email address'
                        />
                        {errors.email && (
                          <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                        <FaComments className='inline mr-2' size={14} />
                        Message *
                      </label>
                      <textarea
                        id='message'
                        name='message'
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA4492] focus:border-transparent transition-all duration-300 resize-none ${
                          errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder='Tell us how we can help you...'
                      />
                      {errors.message && (
                        <p className='mt-1 text-sm text-red-600'>{errors.message}</p>
                      )}
                      <p className='mt-1 text-sm text-gray-500'>
                        {formData.message.length}/500 characters
                      </p>
                    </div>

                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='w-full bg-[#EA4492] hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center group'
                    >
                      {isSubmitting ? (
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      ) : (
                        <>
                          <FaPaperPlane className='mr-2' size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Image Section */}
                {data?.Image?.url && (
                  <div className='h-64 lg:h-80 relative'>
                    <Image
                      src={data.Image.url}
                      alt='Contact us'
                      fill
                      className='object-cover'
                      priority
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>
                  </div>
                )}
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
