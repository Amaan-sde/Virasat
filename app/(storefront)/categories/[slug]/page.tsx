import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { getCategoryBySlug, getProducts } from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return { title: 'Category Not Found' };
  }
  return {
    title: `${category.name} Online - Buy ${category.name} at Best Prices in India`,
    description: category.seoDescription || category.description,
    openGraph: {
      title: category.seoTitle || category.name,
      description: category.seoDescription || category.description,
      images: category.image ? [{ url: category.image }] : undefined
    }
  };
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const { products, total } = await getProducts({
    categoryId: category.id,
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
          <Link href="/categories" className="hover:text-blue-600">Categories</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">{category.name}</span>
        </div>

        {/* Category Header Card */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-4 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing 1 – {products.length} of {total} products
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs text-[#13293D] font-bold hover:underline"
          >
            All Ethnic Categories &rarr;
          </Link>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-md shadow-xs border border-slate-200 py-16 text-center max-w-md mx-auto space-y-3 p-6">
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500">
              New collections for {category.name} are arriving soon!
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
