import { MetadataRoute } from 'next';
import { getCategories, getCollections, getProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://virasatheritage.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/policies/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4
    },
    {
      url: `${baseUrl}/policies/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4
    }
  ];

  // Dynamic products
  const { products } = await getProducts({ limit: 1000, isPublished: true });
  const productRoutes: MetadataRoute.Sitemap = products.map(p => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // Dynamic categories
  const categories = await getCategories(true);
  const categoryRoutes: MetadataRoute.Sitemap = categories.map(c => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: new Date(c.updatedAt || c.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7
  }));

  // Dynamic collections
  const collections = await getCollections(true);
  const collectionRoutes: MetadataRoute.Sitemap = collections.map(col => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: new Date(col.updatedAt || col.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7
  }));

  return [...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...productRoutes];
}

