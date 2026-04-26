'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import NavDropdown from './NavDropdown';

const PRIMARY_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blogs', label: 'Blogs' }
];

function navLinkClass(active) {
  return `px-3 py-2 rounded-md font-medium transition-all duration-300 ${
    active ? 'text-brand bg-pink-50' : 'text-gray-700 hover:text-brand hover:bg-pink-50'
  }`;
}

export default function NavLinks({ pathname }) {
  const { data: session, status } = useSession();

  return (
    <div className='hidden lg:flex items-center space-x-8'>
      {PRIMARY_LINKS.map(({ href, label }) => (
        <Link key={href} href={href} className={navLinkClass(pathname === href)}>
          {label}
        </Link>
      ))}

      <NavDropdown pathname={pathname} />

      <Link href='/contact' className={navLinkClass(pathname === '/contact')}>
        Contact
      </Link>

      {status === 'authenticated' && session.user.role_type === 'customer' && (
        <Link href='/orders' className={navLinkClass(pathname === '/orders')}>
          Orders
        </Link>
      )}
    </div>
  );
}
