
import "./globals.css";
import Header from "./components/Header";
import { Cairo } from "next/font/google";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./contexts/AuthContext";
import Script from 'next/script'
import type { Metadata } from 'next'
import { WebsiteJsonLd, OrganizationJsonLd } from './components/JsonLd'



export const metadata: Metadata = {
  metadataBase: new URL('https://qalebk.com'),
  title: {
    default: 'قالبك | أقسام برمجية احترافية لمتجرك و موقعك الإلكتروني',
    template: '%s | قالبك'
  },
  description: 'حوّل متجرك الإلكتروني إلى تحفة تقنية مع منصة قالبك. نوفر لك أقسام برمجية جاهزة (HTML/CSS) مخصصة لمنصة سلة وزد وشوبيفاي وغيرها، سهلة التركيب وتزيد من مبيعاتك بدون خبرة برمجية.',
  keywords: [
    'تعديل متجر سلة', 
    'أكواد CSS سلة',
    'سوق منتجات رقمية',  
    'تصميم متاجر زد', 
    'أقسام جاهزة', 
    'تخصيص ثيم سلة', 
    'منتجات رقمية للمتاجر', 
    'تطوير متاجر إلكترونية', 
    'قوالب سلة وزد',
    'قوالب جاهزة للمتاجر',
    'UI Sections سلة'
  ],
  authors: [{ name: 'منصة قالبك' }],
  creator: 'قالبك',
  publisher: 'قالبك',
  
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://qalebk.com',
    title: 'قالبك - سوق الأقسام البرمجية لمتاجر سلة وزد',
    description: 'أقسام برمجية جاهزة (HTML/CSS/JS) لرفع احترافية متجرك على سلة وزد خلال دقائق.',
    siteName: 'منصة قالبك',
    images: [
      {
        url: '/og-image.png', // تأكد من وجود صورة توضح واجهة متجرك
        width: 1200,
        height: 630,
        alt: 'قالبك - احترافية متجرك تبدأ من هنا'
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'قالبك | أفضل الحلول البرمجية لمتاجرك الإلكترونية',
    description: 'انسخ الكود، الصقه، وانطلق! أقسام احترافية لمنصة سلة وزد بأسعار منافسة.',
    images: ['/twitter-image.png'],
  },
  
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://qalebk.com',
    languages: {
      'ar-SA': 'https://qalebk.com',
    },
  },
}


const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "700"],
  variable: "--font-cairo",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPreview = pathname.startsWith("/preview");

  const showHeader =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/checkout") &&
    !isPreview;

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-HCJLZTK27J`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HCJLZTK27J');
          `}
        </Script>
      </head>
      <body className="font-cairo text-black">
         {/* 👇 أضف هنا */}
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <AuthProvider>
          {showHeader && <Header />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
