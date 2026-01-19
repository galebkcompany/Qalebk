import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// يجب تهيئة عميل Supabase هذا باستخدام مفتاح دور الخدمة (Service Role Key)
// لأن حذف المستخدم يتطلب صلاحيات إدارية.
// تأكد من إضافة SUPABASE_SERVICE_ROLE_KEY إلى ملف .env الخاص بك.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * نقطة النهاية لحذف حساب المستخدم.
 * المسار المتوقع: /api/delete-account
 * طريقة HTTP: DELETE
 */
export async function DELETE(request: Request) {
  try {
    // الحصول على التوكن من الـ Header بدلاً من الكوكيز
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.split(' ')[1]; // استخراج التوكن بعد كلمة Bearer

    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'No active session found' }, { status: 401 });
    }


    // 2. استخدام رمز الوصول للتحقق من المستخدم والحصول على معرّفه (ID)
    // نستخدم عميل Supabase عادي هنا للتحقق من الجلسة
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      // إذا كان رمز الوصول غير صالح أو منتهي الصلاحية، فسيتم التعامل معه كجلسة غير صالحة
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    const userId = user.id;

    // 3. حذف المستخدم باستخدام عميل المسؤول (Service Role Key)
    // هذا الإجراء يحذف المستخدم من جدول auth.users
    const { error: deleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Supabase Admin Delete Error:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete user on server" },
        { status: 500 },
      );
    }

    // 4. تم الحذف بنجاح. سيقوم الكود في الواجهة الأمامية (AccountPage) بتسجيل الخروج محلياً وإعادة التوجيه.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error during account deletion:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
