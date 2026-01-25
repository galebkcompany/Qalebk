
import "./globals.css";
import { Cairo } from "next/font/google";
import Script from 'next/script'
import type { Metadata } from 'next'
import { WebsiteJsonLd, OrganizationJsonLd } from './components/JsonLd'
import LayoutClient from "./components/LayoutClient";



export const metadata: Metadata = {
  metadataBase: new URL('https://qalebk.com'),
  title: {
    default: 'قالبك | أقسام جاهزة لرفع تحويل متجرك الإلكتروني',
    template: '%s | قالبك'
  },
description: 'أقسام جاهزة لمتاجر سلة، زد، وشوبيفاي تساعدك على تحسين واجهة المتجر وزيادة التحويل بدون برمجة. انسخ والصق وابدأ خلال دقائق.',
keywords: [
  // نية تخصيص وتحسين
  'أقسام جاهزة سلة',
  'أقسام جاهزة زد',
  'UI Sections متاجر',
  'تخصيص واجهة متجر إلكتروني',

  // نية تجارية
  'منتجات رقمية للمتاجر',
  'أقسام لزيادة التحويل',
  'تحسين واجهة متجر',

  // نية تقنية
  'تعديل متجر سلة',
  'تخصيص ثيم سلة',
  'قوالب جاهزة للمتاجر'
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
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HCJLZTK27J"
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
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        
        {/* 👇 استخدام Client Component */}
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}