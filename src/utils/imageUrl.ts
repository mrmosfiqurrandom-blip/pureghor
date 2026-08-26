/**
 * PureGhor Universal Image URL Resolver
 * Ensures reliable image loading across Vercel, GitHub Pages, Local Dev, and SPA Deep Routes.
 * Fully eliminates any third-party irrelevant stock photos (e.g. medicine/pills).
 */

// PureGhor Official Authentic Fallback Image (Biswanath Opening Promo Banner)
export const DEFAULT_FALLBACK_IMAGE = '/images/pureghor/701370545_844991221981629_1527727780744872160_n.jpg';

// Mapping for any legacy Unsplash or irrelevant URLs to genuine PureGhor assets
const URL_MIGRATION_MAP: Record<string, string> = {
  // Ghee
  'photo-1631709497146-a239ef373cf1': '/images/pureghor/731843570_3182118701988973_854022805183807248_n.jpeg',
  // Mustard Oil
  'photo-1474979266404-7eaacbcd87c5': '/images/pureghor/772218375_2009050126395720_4862285561095726924_n.jpeg',
  // Jaggery (Gur)
  'photo-1601050690597-df0568f70950': '/images/pureghor/772513850_1055475870270979_5142302322816849426_n.jpeg',
  // Chia seed
  'photo-1596040033229-a9821ebd058d': '/images/pureghor/757700374_1054100053804163_386722467757915465_n.jpeg',
  // Irrelevant medicine pills
  'photo-1584308666744-24d5c474f2ae': '/images/pureghor/701370545_844991221981629_1527727780744872160_n.jpg',
};

export function resolveImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') {
    return resolveImageUrl(DEFAULT_FALLBACK_IMAGE);
  }

  const trimmed = url.trim();
  if (!trimmed) return resolveImageUrl(DEFAULT_FALLBACK_IMAGE);

  // Check if it matches any legacy unsplash photo ID to replace with PureGhor genuine image
  for (const [key, replacement] of Object.entries(URL_MIGRATION_MAP)) {
    if (trimmed.includes(key)) {
      return resolveImageUrl(replacement);
    }
  }

  // If it is another unsplash or generic stock image, replace with primary PureGhor asset
  if (trimmed.includes('images.unsplash.com') || trimmed.includes('via.placeholder.com')) {
    return resolveImageUrl(DEFAULT_FALLBACK_IMAGE);
  }

  // Absolute web URLs (Facebook CDN, Cloudflare, etc.) or Data URLs
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Clean path (strip leading slash or relative dots)
  let cleanPath = trimmed;
  if (cleanPath.startsWith('./')) {
    cleanPath = cleanPath.slice(2);
  }
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }

  // Determine base path from Vite env or GitHub Pages context
  let base = import.meta.env.BASE_URL || '/';

  if (typeof window !== 'undefined') {
    // If running on github.io sub-path (e.g. username.github.io/repo-name/)
    if (window.location.hostname.endsWith('github.io')) {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0 && !pathSegments[0].includes('.')) {
        base = `/${pathSegments[0]}/`;
      }
    }
  }

  if (base === './') {
    base = '/';
  }
  if (!base.endsWith('/')) {
    base = `${base}/`;
  }

  return `${base}${cleanPath}`;
}

