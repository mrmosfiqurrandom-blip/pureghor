/**
 * Universal Image URL resolver for local dev, GitHub Pages, Netlify, Vercel & custom subpaths.
 * Solves GitHub Pages sub-path 404 image breakage.
 */
export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  // If it's already an absolute web URL or base64 data URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Get base URL configured in Vite (e.g., './' or '/pureghor/')
  const baseUrl = import.meta.env.BASE_URL || './';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = url.startsWith('/') ? url.slice(1) : url;

  return `${normalizedBase}${normalizedPath}`;
}

/**
 * Fallback image placeholder URL generator
 */
export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';
