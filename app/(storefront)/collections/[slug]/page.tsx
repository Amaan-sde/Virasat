import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getCollectionBySlug, getProducts } from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';

export const revalidate = 0;

interface CollectionPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  };
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) {
    return { title: 'Collection Not Found' };
  }
  return {
    title: `${collection.name} - Special Deals & Offers Online`,
    description: collection.seoDescription || collection.description,
    openGraph: {
      title: collection.seoTitle || collection.name,
      description: collection.seoDescription || collection.description,
      images: collection.bannerImage ? [{ url: collection.bannerImage }] : undefined
    }
  };
}

export default async function CollectionDetailPage({ params, searchParams }: CollectionPageProps) {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) {
    notFound();
  }

  const { products, total } = await getProducts({
    collectionSlug: collection.slug,
    sort: searchParams.sort || 'popular',
    limit: 50,
    isPublished: true
  });

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2.5 px-1">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/shop" className="hover:text-blue-600">Collections</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">{collection.name}</span>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-4 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              {collection.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing 1 – {products.length} of {total} products
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs text-[#13293D] font-bold hover:underline"
          >
            All Products &rarr;
          </Link>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-md shadow-xs border border-slate-200 py-16 text-center max-w-md mx-auto space-y-3 p-6">
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500">
              New arrivals for this collection are coming soon.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#13293D] text-white text-xs font-bold px-6 py-2 rounded-sm uppercase tracking-wider hover:bg-[#0B1522] transition"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {products.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
