"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // إعادة التوجيه إذا لم يكن المستخدم مسجل دخول
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError("");

    try {
      // الحصول على التوكن من جلسة Supabase الحالية
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // إرسال التوكن هنا
        },
      });

      const data = await response.json();
      // ... باقي الكود كما هو

      if (response.ok && data.success) {
        // الخطوة 2: بعد نجاح الحذف، نقوم بمسح الجلسة محلياً فوراً
        await signOut(); // دالة تسجيل الخروج من Context الخاص بك

        // الخطوة 3: التوجيه لصفحة أخرى
        router.push("/login?message=account_deleted");
      } else {
        setDeleteError(data.error || "فشل حذف الحساب");
        setDeleteLoading(false);
      }
    } catch (err) {
      setDeleteError("حدث خطأ غير متوقع");
      setDeleteLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className=" px-6 py-8">
            <h1 className="text-3xl font-medium text-black">حسابي</h1>
            <p className="mt-2 text-gray-600">إدارة معلومات حسابك وإعداداتك</p>
          </div>

          {/* معلومات المستخدم */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  المعلومات الشخصية
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">
                      البريد الإلكتروني
                    </span>
                    <span className="text-gray-900">{user.email}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">
                      تاريخ التسجيل
                    </span>
                    <span className="text-gray-900">
                      {new Date(user.created_at || "").toLocaleDateString(
                        "ar-SA",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 font-medium">
                      حالة التحقق
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.email_confirmed_at
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.email_confirmed_at
                        ? "تم التحقق ✓"
                        : "لم يتم التحقق"}
                    </span>
                  </div>
                </div>
              </div>

              {/* الإجراءات */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  إجراءات الحساب
                </h2>

                <div className="space-y-3">
                  {/* زر تسجيل الخروج */}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    تسجيل الخروج
                  </button>

                  {/* زر حذف الحساب */}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center justify-center px-6 py-3 border border-red-300 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200 font-medium"
                  >
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    حذف الحساب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* نافذة تأكيد الحذف */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                هل أنت متأكد من حذف الحساب؟
              </h3>

              <p className="text-gray-600 text-center mb-6">
                هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بياناتك بشكل
                نهائي.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">
                    {deleteError}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteError("");
                  }}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 flex items-center justify-center"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الحذف...
                    </>
                  ) : (
                    "نعم، احذف حسابي"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
