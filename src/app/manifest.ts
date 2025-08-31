import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DevSpace - Dynamic Portfolio Platform',
    short_name: 'DevSpace',
    description: 'Create, manage, and share your developer portfolio with ease. Dynamic APIs for projects, blogs, and links.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['productivity', 'developer', 'portfolio', 'business'],
    lang: 'en',
    orientation: 'portrait-primary',
  }
}
