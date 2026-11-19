/*
 * The photos the site ships with. Used in two places:
 *  - the website, as a fallback while Supabase is loading or not configured
 *  - server/scripts/upload-local-images.js, which copies these files into Supabase Storage
 * `file` is relative to the /public folder.
 */
export const DEFAULT_IMAGES = [
  { key: 'couple', section: 'blessing', file: 'images/couple.webp', title: 'Jeshfique & Tamanna', subtitle: '', sort_order: 1 },
  { key: 'gallery-1', section: 'gallery', file: 'photos/1.jpg', title: 'Where it began', subtitle: 'Jeshfique & Tamanna', sort_order: 1 },
  { key: 'gallery-2', section: 'gallery', file: 'photos/2.jpg', title: 'A golden journey', subtitle: 'Chapter two', sort_order: 2 },
  { key: 'gallery-3', section: 'gallery', file: 'photos/3.jpg', title: 'Laughter & warmth', subtitle: 'Chapter three', sort_order: 3 },
  { key: 'gallery-4', section: 'gallery', file: 'photos/4.jpg', title: 'Road to forever', subtitle: 'Chapter four', sort_order: 4 },
  { key: 'gallery-5', section: 'gallery', file: 'photos/5.jpg', title: 'Blessings & joy', subtitle: 'Chapter five', sort_order: 5 },
  { key: 'gallery-6', section: 'gallery', file: 'photos/6.jpg', title: 'Heart to heart', subtitle: 'Chapter six', sort_order: 6 },
  { key: 'gallery-7', section: 'gallery', file: 'photos/7.jpg', title: 'Special moments', subtitle: 'Chapter seven', sort_order: 7 },
  { key: 'gallery-8', section: 'gallery', file: 'photos/8.jpg', title: 'Together, always', subtitle: 'Chapter eight', sort_order: 8 }
];
