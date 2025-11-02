'use client';

import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { signIn } from 'next-auth/react';
import { BsPerson } from 'react-icons/bs';
import Loader from '../../components/Loader';
import { useRouter } from 'next/navigation';
import Verify from '../../components/Verify.jsx';
import AppContext from '../../../../context/AppContext.jsx';

export default function Page() {
  const { setJwt, setUserId } = useContext(AppContext);
  const router = useRouter();
  const [image, setImage] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/sign-up?populate=*`)
      .then(res => res.json())
      .then(json => {
        setImage(json.data.Image.url);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  const signup = async event => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords Do Not Match');
      console.log('Bye');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/new-auth/custom-register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password,
            firstName,
            lastName,
            role_type: 'customer'
          })
        }
      );

      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error('Failed to register user');
      }

      const data = await response.json();

      if (data) {
        // setJwt(data.user.jwt)
        setStatus(true);

        //   console.log(data)

        //     console.log(data.user.id)
        //   const response2 = await fetch(`${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/users/${data.user.id}`,{
        //     method:"PUT",
        //     headers:{
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       firstName,
        //       lastName,
        //       role_type:"customer"

        //     })
        // })

        // console.log(response2)
        // if (!response2.ok) {
        //   const errorData = await response2.json();
        //   setError( "Failed to update user data");
        // }
      }

      //   const updateUserData  = await response2.json();
      // console.log(JSON.stringify(updateUserData))

      //     if(updateUserData){
      //       console.log("Hello")

      //       try {
      //         const result = await signIn("credentials", {
      //           identifier:email,
      //           password,
      //           redirect:false, // Optional: avoid automatic redirect
      //           // callbackUrl: process.env.NEXT_PUBLIC_SHERRYBERRIES_FRONTEND_URL
      //         });
      //         if (result?.error) {
      //           console.error("Sign-in failed:", result.error);
      //         } else {
      //           console.log("User logged in successfully");
      //           router.push("/")
      //         }

      //       } catch (error) {

      //         console.error("Registration error:", error.message);
      //       }

      //     }
      //     }
    } catch (error) {
      setError('Failed to register user');
    }

    // setUsername("");
    // setConfirmPassword("");
    // setPassword("");
    // setEmail("");
    // setFirstName("");
    // setLastName("")
    setError('');
  };

  if (loading) return <Loader />;

  return (
    <>
      {!status ? (
        <div className='min-h-screen py-10 bg-[#fef2f2] flex items-center justify-center'>
          <div className='flex flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-11/12 max-w-4xl h-auto lg:h-3/4'>
            {/* Image Section */}
            <div
              className='lg:w-1/2 w-full h-64 lg:h-auto'
              style={{
                backgroundImage: `url('${image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>

            {/* Login Form Section */}
            <div className='lg:w-1/2 w-full p-8 flex flex-col justify-center'>
              <h1 className='text-2xl font-bold text-gray-800 mb-2'>Sign Up</h1>
              <p className='text-sm text-gray-600 mb-6'>
                Create your new account
              </p>

              <span className='text-red-500 font-bold'>{error}</span>
              <form onSubmit={signup}>
                {/* Email Input */}

                <div className='mb-4'>
                  <label
                    htmlFor='username'
                    className='block text-sm text-gray-600 mb-1'
                  ></label>
                  <div className='relative'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                      <BsPerson className='h-5 w-5 text-gray-400' />
                    </span>
                    <input
                      type='text'
                      id='username'
                      className='w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm'
                      placeholder='Username'
                      value={username}
                      onChange={evt => setUsername(evt.target.value)}
                    />
                  </div>
                </div>

                {/*firstName*/}
                <div className='mb-4'>
                  <label
                    htmlFor='firstName'
                    className='block text-sm text-gray-600 mb-1'
                  ></label>
                  <div className='relative'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                      <BsPerson className='h-5 w-5 text-gray-400' />
                    </span>
                    <input
                      type='text'
                      id='firstName'
                      className='w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm'
                      placeholder='First Name'
                      value={firstName}
                      onChange={evt => setFirstName(evt.target.value)}
                    />
                  </div>
                </div>

                {/*lastName*/}
                <div className='mb-4'>
                  <label
                    htmlFor='lastName'
                    className='block text-sm text-gray-600 mb-1'
                  ></label>
                  <div className='relative'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                      <BsPerson className='h-5 w-5 text-gray-400' />
                    </span>
                    <input
                      type='text'
                      id='lastName'
                      className='w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm'
                      placeholder='Last Name'
                      value={lastName}
                      onChange={evt => setLastName(evt.target.value)}
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <label
                    htmlFor='email'
                    className='block text-sm text-gray-600 mb-1'
                  ></label>
                  <div className='relative'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                      <FiMail className='h-5 w-5 text-gray-400' />
                    </span>
                    <input
                      type='email'
                      id='email'
                      className='w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm'
                      placeholder='Email Address'
                      value={email}
                      onChange={evt => setEmail(evt.target.value)}
                    />
                  </div>
                </div>
                {/* Password Input */}
                <div className='mb-6'>
                  <label
                    htmlFor='password'
                    className='block text-sm text-gray-600 mb-1'
                  ></label>
                  <div className='relative'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                      <FiLock className='h-5 w-5 text-gray-400' />
                    </span>
                    <input
                      type='password'
                      id='password'
                      className='w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm'
                      placeholder='Password'
                      value={password}
                      onChange={evt => setPassword(evt.target.value)}
                    />
                  </div>
                </div>

                <div className='mb-6'>
                  <label
                    htmlFor='confirm-password'
                    className='block text-sm text-gray-600 mb-1'
                  ></label>
                  <div className='relative'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                      <FiLock className='h-5 w-5 text-gray-400' />
                    </span>
                    <input
                      type='password'
                      id='confirm-password'
                      className='w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm'
                      placeholder='Confirm Password'
                      value={confirmPassword}
                      onChange={evt => setConfirmPassword(evt.target.value)}
                    />
                  </div>
                </div>
                {/* Login Button */}
                <button
                  type='submit'
                  className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium'
                >
                  Login
                </button>
                {/* <p className="mt-4 text-sm text-center text-gray-500">
              <a href="#" className="hover:underline">
                Forgot Password?
              </a>
            </p> */}
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Verify email={email} />
      )}
    </>
  );
}
