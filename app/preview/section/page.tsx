import { Suspense } from "react";
import PreviewSectionClient from "./PreviewSectionClient";

export const metadata = {
  title: "معاينة القسم",
  description: "معاينة أقسام المنتج",
};

export default function PreviewSectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      }
    >
      <PreviewSectionClient />
    </Suspense>
  );
}