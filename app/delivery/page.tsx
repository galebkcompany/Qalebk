import { Suspense } from "react";
import DeliveryPageClient from "./DeliveryPageClient";

export const metadata = {
  title: "استلام المنتج",
  description: "تحميل منتجك الرقمي",
};

export default function DeliveryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      }
    >
      <DeliveryPageClient />
    </Suspense>
  );
}