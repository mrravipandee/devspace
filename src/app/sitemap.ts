import { MetadataRoute } from 'next'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://devspacee.me'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic user portfolio pages
  let userPages: MetadataRoute.Sitemap = []
  
  try {
    await dbConnect()
    const users = await User.find({ profileCompleted: true }).select('username updatedAt').lean()
    
    userPages = users.map((user) => ({
      url: `${baseUrl}/${user.username}`,
      lastModified: new Date(user.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error generating sitemap for users:', error)
  }

  return [...staticPages, ...userPages]
}
