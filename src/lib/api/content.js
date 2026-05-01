import { api } from '../api-client';

export function getHomepage({ signal } = {}) {
  const path =
    '/api/homepage?populate[0]=Popular_Categories.Image' +
    '&populate[1]=Hero.image' +
    '&populate[2]=featured.jewelries.image' +
    '&populate[3]=Advert.image' +
    '&populate[4]=Greeting.Video' +
    '&populate[5]=Reviews.reviews.Image' +
    '&populate[6]=Blogs.blogs.image';
  return api.get(path, { signal });
}

export function getAboutPage({ signal } = {}) {
  const path =
    '/api/about' +
    '?populate[blocks][on][shared.media][populate]=*' +
    '&populate[blocks][on][shared.quote][populate]=*' +
    '&populate[blocks][on][shared.rich-text][populate]=*';
  return api.get(path, { signal });
}

export function getJewelryProductHero({ signal } = {}) {
  return api.get('/api/jewelry-product?populate[0]=Hero.image', { signal });
}

export function getWaistbeadProductHero({ signal } = {}) {
  return api.get('/api/waistbead-product?populate[0]=Hero', { signal });
}

export function getClothingProductHero({ signal } = {}) {
  return api.get('/api/clothing-product?populate[0]=Hero', { signal });
}

export function getAftercareProductHero({ signal } = {}) {
  return api.get('/api/aftercare-product?populate[0]=Hero', { signal });
}
