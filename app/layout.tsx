"use client";

import "./globals.css";
import Header from "./components/Header";
import { Cairo } from "next/font/google";
import { usePathname } from "next/navigation";

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
  const isPreview = pathname.startsWith('/preview')


  const showHeader =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/checkout") &&
      !isPreview

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-cairo text-black">
        {showHeader && <Header />}
        {children}
      </body>
    </html>
  );
}
