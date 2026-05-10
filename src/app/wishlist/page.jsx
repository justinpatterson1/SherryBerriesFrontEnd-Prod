import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { FaHeart } from 'react-icons/fa';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { getUserWishlist } from '@/lib/api/wishlist';
import WishlistGrid from './WishlistGrid';

export const dynamic = 'force-dynamic';

function flattenWishlist(wishlist) {
  if (!wishlist) return [];
  const items = [];
  for (const j of wishlist.jewelries ?? []) {
    items.push({ ...j, category: 'jewelry' });
  }
  for (const m of wishlist.merchandises ?? []) {
    items.push({ ...m, category: 'clothing' });
  }
  for (const a of wishlist.aftercares ?? []) {
    items.push({ ...a, category: 'aftercare' });
  }
  return items;
}

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  let items = [];
  let fetchError = false;

  if (session?.user?.documentId) {
    try {
      const json = await getUserWishlist({
        userDocumentId: session.user.documentId,
        token: session.jwt
      });
      const wishlist = json?.data?.[0];
      items = flattenWishlist(wishlist);
    } catch (err) {
      fetchError = true;
    }
  }

  const subtitle = !session
    ? 'Sign in to save and view your wishlist'
    : fetchError
      ? 'We could not load your wishlist right now'
      : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved for later`;

  return (
    <main className='bg-white min-h-screen'>
      <section className='bg-gradient-to-br from-rose-50 to-pink-50 py-16 px-4'>
        <div className='container mx-auto max-w-3xl text-center'>
          <span className='inline-block text-sm font-semibold tracking-widest uppercase text-brand mb-3'>
            My Favorites
          </span>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Your Wishlist
          </h1>
          <div className='w-20 h-1 bg-gradient-to-r from-brand to-pink-500 rounded-full mx-auto mb-4'></div>
          <p className='text-gray-600'>{subtitle}</p>
        </div>
      </section>

      <section className='container mx-auto px-4 py-12'>
        {!session ? (
          <CenteredState
            heading='Sign in to view your wishlist'
            body='Save your favorite pieces and find them here whenever you come back.'
            ctaHref='/sign-in'
            ctaLabel='Sign In'
          />
        ) : (
          <WishlistGrid initialItems={items} />
        )}
      </section>
    </main>
  );
}

function CenteredState({ heading, body, ctaHref, ctaLabel }) {
  return (
    <div className='text-center py-20'>
      <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 text-brand mb-6'>
        <FaHeart className='w-8 h-8' />
      </div>
      <h2 className='text-2xl font-bold text-gray-900 mb-2'>{heading}</h2>
      <p className='text-gray-600 mb-6'>{body}</p>
      <Link
        href={ctaHref}
        className='inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-full font-semibold transition-colors'
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
