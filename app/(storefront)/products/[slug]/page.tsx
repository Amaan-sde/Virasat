import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/product/ProductCard';

export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Product Not Found' };
  }

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80';

  return {
    title: `${product.name} - Buy ${product.name} Online at Best Price in India`,
    description: product.seoDescription || product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description.slice(0, 160),
      images: [{ url: primaryImage, width: 1000, height: 1333, alt: product.name }],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription || product.description.slice(0, 160),
      images: [primaryImage]
    }
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  // Related products from the same category
  const { products: relatedProducts } = await getProducts({
    categoryId: product.categoryId,
    limit: 5,
    isPublished: true
  });

  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  // JSON-LD Structured Data Schema for Google & Search Engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'VIRASAT'
    },
    offers: {
      '@type': 'Offer',
      url: `https://virasatheritage.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.4,
      reviewCount: product.reviewCount || 120
    }
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-3">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Flipkart Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-xs text-gray-500 mb-2.5 px-1 overflow-x-auto">
          <Link href="/" className="hover:text-blue-600 shrink-0">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          <Link href="/shop" className="hover:text-blue-600 shrink-0">Clothing & Accessories</Link>
          {product.categoryName && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
              <Link href={`/categories/${product.categoryId}`} className="hover:text-blue-600 shrink-0">
                {product.categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Component in Pure White Flipkart Card */}
        <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-3 sm:p-5 mb-3">
          <ProductDetailClient product={product} />
        </div>

        {/* Related Products Section */}
        {filteredRelated.length > 0 && (
          <div className="bg-white rounded-xs shadow-xs border border-gray-200 p-4 mb-3">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Similar Products You May Like
              </h2>
              <Link
                href="/shop"
                className="bg-[#13293D] text-white text-xs font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider hover:bg-[#0B1522] transition"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {filteredRelated.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
