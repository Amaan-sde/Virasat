import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastContext';
import { CartProvider } from '@/components/cart/CartContext';
import { getStoreSettings } from '@/lib/db';

export const viewport: Viewport = {
  themeColor: '#13293d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      default: `${settings.storeName} | Handcrafted Ethnic Luxury & Pure Silk Weaves`,
      template: `%s | ${settings.storeName}`
    },
    description: 'Explore certified pure Kanjeevaram silks, Banarasi brocades, bridal lehengas, and temple jewellery directly from master artisan clusters.',
    keywords: [
      'Pure Silk Sarees Online',
      'Kanjeevaram Silk',
      'Banarasi Brocade Saree',
      'Bridal Lehengas',
      'Temple Jewellery',
      'Handcrafted Ethnic Fashion',
      'Virasat Heritage'
    ],
    openGraph: {
      title: `${settings.storeName} | Handcrafted Ethnic Luxury`,
      description: 'Shop authentic pure silk sarees, bridal couture, and temple jewellery with insured express delivery and Silk Mark certification.',
      siteName: settings.storeName,
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Virasat Handcrafted Luxury'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${settings.storeName} | Handcrafted Luxury`,
      description: 'Authentic Indian handlooms and heritage jewellery.'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans antialiased selection:bg-[#13293d] selection:text-white">
        <ToastProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
