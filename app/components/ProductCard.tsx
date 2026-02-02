import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  slug: string;
  name: string;
  image_url: string;
  price: number;
  platforms: string[];
  is_featured: boolean;
};

// وظيفة مساعدة لتحويل رابط Cloudinary إلى رابط محسن تلقائياً
const getOptimizedCloudinaryUrl = (url: string) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  // إضافة f_auto لتحويل الصيغة لـ WebP و q_auto للضغط الذكي
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_700/");
};

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const discountedPrice = product.price; // هو السعر بعد الخصم
  const originalPrice = product.price * 2; // السعر قبل الخصم
  const optimizedUrl = getOptimizedCloudinaryUrl(product.image_url);

  return (
    <Link href={`/product/${product.slug}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200  overflow-hidden hover:shadow-md transition">
        {/* Image */}
        <div className="relative w-full overflow-hidden bg-gray-100 ">
          {product.is_featured && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 sm:px-3 rounded-full shadow-lg">
              <span>مميز</span>
              <span className="">★</span>
            </div>
          )}

          {product.image_url.endsWith(".mp4") ? (
            <video
              src={product.image_url}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full overflow-hidden bg-gray-100">
              <Image
                src={optimizedUrl}
                alt={product.name}
                width={700}
                height={700}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 2}
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                draggable={false}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-3">
          {/* Description */}
          <p className="text-sm text-gray-700 line-clamp-2">{product.name}</p>

          {/* Price + Icons */}
          <div className="flex items-center justify-between text-black">
            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-xl text-green-600">
                SAR {discountedPrice.toFixed(2)}
              </span>
              <span className="text-gray-400 text-sm line-through">
                SAR {originalPrice.toFixed(2)}
              </span>
            </div>

            {/* Icons */}
            <div className="flex gap-3">
              {product.platforms.includes("custom website") && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image
                    src="/icons/web.svg"
                    alt="موقع"
                    title="موقع"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
              )}
              {product.platforms.includes("Salla") && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image
                    src="/icons/store.svg"
                    alt="متجر"
                    title="متجر"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
