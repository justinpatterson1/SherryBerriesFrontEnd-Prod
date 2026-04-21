/**
 * Resolves the best available image URL from a Strapi image object.
 * Handles both single images and image arrays (merchandise).
 */
export function getImageUrl(image, size = 'thumbnail') {
  if (!image) return '';

  // Handle image arrays (merchandise products)
  if (Array.isArray(image)) {
    return image[0]?.formats?.[size]?.url || image[0]?.url || '';
  }

  // Handle single image objects
  return image.formats?.[size]?.url || image.url || '';
}
