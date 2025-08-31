import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/admin/',
          '/private/',
          '/*.json$',
          '/login',
          '/signup',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/admin/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://devspacee.me/sitemap.xml',
    host: 'https://devspacee.me',
  }
}
