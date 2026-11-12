import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import CartDrawer from '@/components/cart/CartDrawer';
import { getCategories, getStoreSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories(true);
  const settings = await getStoreSettings();

  // Organization & WebSite JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://virasatheritage.com/#organization',
        name: settings.storeName,
        url: 'https://virasatheritage.com',
        logo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
        description: settings.seoMetaDescription,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '44 Palace Road',
          addressLocality: 'Bengaluru',
          addressRegion: 'Karnataka',
          postalCode: '560001',
          addressCountry: 'IN'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: settings.contactPhone,
          contactType: 'customer support',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi']
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://virasatheritage.com/#website',
        url: 'https://virasatheritage.com',
        name: settings.storeName,
        description: settings.tagline,
        publisher: { '@id': 'https://virasatheritage.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://virasatheritage.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar settings={settings} />
      <Header categories={categories} settings={settings} />
      <CartDrawer />
      <main className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}

