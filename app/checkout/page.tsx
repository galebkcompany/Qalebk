import { Suspense } from "react";
import CheckoutPageClient from "./CheckoutPageClient";

export const metadata = {
  title: "إتمام الطلب",
  description: "أكمل عملية الشراء",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      }
    >
      <CheckoutPageClient />
    </Suspense>
  );
}