"use client";

import "./globals.css";
import Header from "./components/Header";
import { Cairo } from "next/font/google";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./contexts/AuthContext";
import Script from 'next/script'


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
        <AuthProvider>
          {showHeader && <Header />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
