/**
 * Extract all image URLs from HTML content
 */
export function extractImageUrlsFromHTML(html: string): string[] {
  if (!html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const imgElements = doc.querySelectorAll('img');

  const urls: string[] = [];
  imgElements.forEach((img) => {
    const src = img.getAttribute('src');
    if (src && src.startsWith('http')) {
      urls.push(src);
    }
  });

  return urls;
}

/**
 * Find images that were in old content but not in new content
 */
export function findRemovedImageUrls(
  oldHtml: string,
  newHtml: string
): string[] {
  const oldUrls = new Set(extractImageUrlsFromHTML(oldHtml));
  const newUrls = new Set(extractImageUrlsFromHTML(newHtml));

  const removed: string[] = [];
  oldUrls.forEach((url) => {
    if (!newUrls.has(url)) {
      removed.push(url);
    }
  });

  return removed;
}
