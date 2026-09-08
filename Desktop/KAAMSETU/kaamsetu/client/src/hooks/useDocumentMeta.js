import { useEffect } from 'react';

/**
 * Sets document title and meta tags dynamically.
 * Cleans up on unmount by restoring defaults.
 */
export default function useDocumentMeta({ title, description, ogImage, ogUrl }) {
  useEffect(() => {
    const prev = {
      title: document.title,
      description: getMeta('description'),
      ogTitle: getMeta('og:title'),
      ogDescription: getMeta('og:description'),
      ogImage: getMeta('og:image'),
      ogUrl: getMeta('og:url'),
    };

    if (title) {
      document.title = title;
      setMeta('og:title', title);
      setMeta('twitter:title', title);
    }
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description);
      setMeta('twitter:description', description);
    }
    if (ogImage) {
      setMeta('og:image', ogImage);
      setMeta('twitter:image', ogImage);
    }
    if (ogUrl) {
      setMeta('og:url', ogUrl);
    }
    setMeta('og:type', 'website');
    setMeta('twitter:card', 'summary_large_image');

    return () => {
      document.title = prev.title;
      setMeta('description', prev.description);
      setMeta('og:title', prev.ogTitle);
      setMeta('og:description', prev.ogDescription);
      setMeta('og:image', prev.ogImage);
      setMeta('og:url', prev.ogUrl);
    };
  }, [title, description, ogImage, ogUrl]);
}

function getMeta(name) {
  const el =
    document.querySelector(`meta[name="${name}"]`) ||
    document.querySelector(`meta[property="${name}"]`);
  return el ? el.getAttribute('content') : '';
}

function setMeta(name, content) {
  if (!content) return;
  // Try property first (OG), then name
  let el =
    document.querySelector(`meta[property="${name}"]`) ||
    document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      el.setAttribute(name.startsWith('twitter:') ? 'name' : 'property', name);
    } else {
      el.setAttribute('name', name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
