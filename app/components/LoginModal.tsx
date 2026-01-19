"use client";

import { useState } from "react";
import { X, User } from "lucide-react";

import { useAuth } from "@/app/contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(true); // تغيير إلى true لجعل إنشاء الحساب هو الافتراضي
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        if (isSignUp) {
          setError("تم إرسال رابط التأكيد إلى بريدك الإلكتروني");
        } else {
          onClose();
          setEmail("");
          setPassword("");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {/* خلفية شفافة - تم تقليل الشفافية من 50% إلى 30% */}
      <div className="fixed inset-0 bg-gray-200/50 z-50 backdrop-blur-sm" />

      {/* النافذة المنبثقة */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-lg mx-4">
        {/* الرأس */}
        <div className="relative flex items-center p-6 border-b border-gray-200">
          <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-medium">
            {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </h2>

          <button
            onClick={onClose}
            className="mr-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* المحتوى */}
        <div className="p-6">
          {error && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                error.includes("تم إرسال")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {/* <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-medium mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-700"
                required
                autoComplete="email"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-00"
                required
                autoComplete="new-password"
                dir="ltr"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading
                ? "جاري التحميل..."
                : isSignUp
                  ? "إنشاء حساب"
                  : "تسجيل الدخول"}
            </button>
          </form> */}

          <button
            onClick={onClose} 
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
          >
            <User size={20} />
            المتابعة كضيف
          </button>

          {/* خط الفصل */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* تسجيل الدخول بجوجل */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            متابعة باستخدام Google
          </button>

          {/* رابط التبديل بين تسجيل الدخول والتسجيل */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-blue-600 hover:underline text-sm"
            >
              {isSignUp
                ? "لديك حساب بالفعل؟ سجل الدخول"
                : "ليس لديك حساب؟ أنشئ حساباً جديداً"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
