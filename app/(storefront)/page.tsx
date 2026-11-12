import React from 'react';
import { getCategories, getHomepageSections, getProducts } from '@/lib/db';
import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedCollectionSection from '@/components/home/FeaturedCollectionSection';
import PromoBannerSection from '@/components/home/PromoBannerSection';
import BestSellersSection from '@/components/home/BestSellersSection';
import BrandStorySection from '@/components/home/BrandStorySection';
import TrustFeaturesSection from '@/components/home/TrustFeaturesSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export const revalidate = 0; // Dynamic server rendering with latest admin updates

export default async function HomePage() {
  const sections = await getHomepageSections(true);
  const categories = await getCategories(true);
  const { products: featuredProducts } = await getProducts({ isFeatured: true, limit: 8 });
  const { products: bestSellers } = await getProducts({ sort: 'popular', limit: 8 });

  return (
    <div className="flex flex-col min-h-screen">
      {sections.map(sec => {
        switch (sec.sectionType) {
          case 'HERO_SLIDER':
            return <HeroSlider key={sec.id} content={sec.content} />;
          case 'CATEGORY_GRID':
            return (
              <CategoryGrid
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                categories={categories}
              />
            );
          case 'FEATURED_COLLECTION':
            return (
              <FeaturedCollectionSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                products={featuredProducts}
                viewAllUrl={sec.content?.viewAllUrl}
              />
            );
          case 'PROMO_BANNER':
            return <PromoBannerSection key={sec.id} content={sec.content as any} />;
          case 'BEST_SELLERS':
            return (
              <BestSellersSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                products={bestSellers}
              />
            );
          case 'BRAND_STORY':
            return (
              <BrandStorySection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={sec.content}
              />
            );
          case 'TRUST_FEATURES':
            return (
              <TrustFeaturesSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={sec.content as any}
              />
            );
          case 'NEWSLETTER':
            return (
              <NewsletterSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                content={sec.content}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

