// pages/api/apply-coupon.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: 'Coupon code is required.' });
  }

  try {
    const strapiRes = await fetch(
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/coupons/validate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      }
    );

    const data = await strapiRes.json();
    if (!strapiRes.ok) {
      return res
        .status(strapiRes.status)
        .json({ error: data.message || 'Failed to validate coupon.' });
    }

    // { valid: true, discountType, discountValue }
    return res.status(200).json({ discount: data });
  } catch (err) {
    console.error('Error calling Strapi /coupons/validate:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
