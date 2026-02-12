import "./globals.css";
import { Cairo } from "next/font/google";
import Script from "next/script";
import type { Metadata } from "next";
import { WebsiteJsonLd, OrganizationJsonLd } from "./components/JsonLd";
import LayoutClient from "./components/LayoutClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://qalebk.com"),
  title: {
    default: "قالبك – حول واجهة متجرك إلى واجهة احترافية في أقل من 5 دقائق",
    template: "%s | قالبك",
  },

  description:
    "أقسام جاهزة لمتاجر سلة، زد، وشوبيفاي تساعدك على تحسين واجهة المتجر وزيادة التحويل بدون برمجة. انسخ والصق وابدأ خلال دقائق.",
  keywords: [
    // نية تخصيص وتحسين
    "أقسام جاهزة سلة",
    "أقسام جاهزة زد",
    "UI Sections متاجر",
    "تخصيص واجهة متجر إلكتروني",

    // نية تجارية
    "منتجات رقمية للمتاجر",
    "أقسام لزيادة التحويل",
    "تحسين واجهة متجر",

    // نية تقنية
    "تعديل متجر سلة",
    "تخصيص ثيم سلة",
    "قوالب جاهزة للمتاجر",
  ],
  authors: [{ name: "منصة قالبك" }],
  creator: "قالبك",
  publisher: "قالبك",

  // ✅ إضافة جميع الأيقونات
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }, // SVG شفاف للمتصفحات الحديثة
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://qalebk.com",
    title: "قالبك - سوق الأقسام البرمجية لمتاجر سلة وزد",
    description:
      "أقسام برمجية جاهزة (HTML/CSS/JS) لرفع احترافية متجرك على سلة وزد خلال دقائق.",
    siteName: "قالبك",
    images: [
      {
        url: "/og-image.png", // تأكد من وجود صورة توضح واجهة متجرك
        width: 1200,
        height: 630,
        alt: "قالبك - احترافية متجرك تبدأ من هنا",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "قالبك | أفضل الحلول البرمجية لمتاجرك الإلكترونية",
    description:
      "انسخ الكود، الصقه، وانطلق! أقسام احترافية لمنصة سلة وزد بأسعار منافسة.",
    images: ["/twitter-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://qalebk.com",
    languages: {
      "ar-SA": "https://qalebk.com",
    },
  },
};

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "700"],
  variable: "--font-cairo",
});

const FB_PIXEL_ID = "1381132766590542";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6MG4W9ENFJ"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6MG4W9ENFJ');
          `}
        </Script>
        {/* 👇 Facebook Pixel Script */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <link rel="icon" href="/favicon.ico" />
        
      </head>
      <body className="font-cairo text-black">
        <WebsiteJsonLd />
        <OrganizationJsonLd />

        {/* 👇 استخدام Client Component */}
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
