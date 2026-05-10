import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { api, ApiError } from '@/lib/api-client';

const PRODUCT_TYPE_TO_FIELD = {
  jewelry: 'jewelries',
  clothing: 'merchandises',
  aftercare: 'aftercares'
};

// `populate=*` reliably returns each related item with its documentId.
// Restricting fields via `populate[X][fields][0]=documentId` was unreliable
// in Strapi v5 — populated arrays sometimes came back without documentId,
// which made the heart never highlight even when the item was saved.
const POPULATE = 'populate=*';

async function findOrCreateWishlist(session) {
  const { documentId: userDocumentId, id: userNumericId } = session.user;
  const token = session.jwt;

  const existingResp = await api.get(
    `/api/wishlists?filters[users_permissions_user][documentId][$eq]=${userDocumentId}&${POPULATE}`,
    { token }
  );
  const existing = existingResp?.data?.[0];
  if (existing) return existing;

  // No wishlist for this user yet — create one. users-permissions relations
  // accept the numeric user id; documentId works on most v5 setups too.
  const created = await api.post(
    '/api/wishlists',
    { data: { users_permissions_user: userNumericId } },
    { token }
  );
  // Re-fetch with populate so the caller has the relation arrays available.
  const refetched = await api.get(
    `/api/wishlists/${created?.data?.documentId}?${POPULATE}`,
    { token }
  );
  return refetched?.data;
}

function ids(items) {
  return (items ?? []).map(item => item.documentId);
}

function snapshot(wishlist) {
  return {
    wishlistId: wishlist?.documentId ?? null,
    jewelries: ids(wishlist?.jewelries),
    merchandises: ids(wishlist?.merchandises),
    aftercares: ids(wishlist?.aftercares)
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const wishlist = await findOrCreateWishlist(session);
    return NextResponse.json(snapshot(wishlist));
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json(
      { error: err?.message ?? 'Failed to load wishlist' },
      { status }
    );
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { productType, productId } = body ?? {};
  const field = PRODUCT_TYPE_TO_FIELD[productType];
  if (!field || !productId) {
    return NextResponse.json(
      { error: 'Body must include { productType, productId }. Supported productType values: jewelry, clothing, aftercare.' },
      { status: 400 }
    );
  }

  try {
    const wishlist = await findOrCreateWishlist(session);
    const currentIds = ids(wishlist[field]);
    const isInWishlist = currentIds.includes(productId);

    // Strapi v5: use connect/disconnect for incremental relation updates.
    // The bare-array form `{ field: [...ids] }` isn't reliably applied
    // for relation updates via PUT.
    const body = isInWishlist
      ? { data: { [field]: { disconnect: [productId] } } }
      : { data: { [field]: { connect: [productId] } } };

    await api.put(
      `/api/wishlists/${wishlist.documentId}`,
      body,
      { token: session.jwt }
    );

    return NextResponse.json({
      productId,
      productType,
      inWishlist: !isInWishlist
    });
  } catch (err) {
    console.error('[wishlist] toggle failed:', err);
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json(
      { error: err?.message ?? 'Failed to update wishlist' },
      { status }
    );
  }
}
