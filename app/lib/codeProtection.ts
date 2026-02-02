// app/lib/codeProtection.ts

/**
 * نظام حماية متعدد الطبقات للكود
 */

// 1️⃣ تشفير Base64 متعدد الطبقات
export function encryptCode(code: string): string {
  // طبقة 1: Base64
  let encrypted = btoa(unescape(encodeURIComponent(code)));
  
  // طبقة 2: عكس النص
  encrypted = encrypted.split('').reverse().join('');
  
  // طبقة 3: Base64 مرة أخرى
  encrypted = btoa(encrypted);
  
  return encrypted;
}

// 2️⃣ فك التشفير
export function decryptCode(encrypted: string): string {
  try {
    // عكس طبقة 3
    let decrypted = atob(encrypted);
    
    // عكس طبقة 2
    decrypted = decrypted.split('').reverse().join('');
    
    // عكس طبقة 1
    decrypted = decodeURIComponent(escape(atob(decrypted)));
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed');
    return '';
  }
}

// 3️⃣ Obfuscation للأسماء (تبديل أسماء الـ Classes)
export function obfuscateClassNames(code: string): { code: string; map: Record<string, string> } {
  const classMap: Record<string, string> = {};
  
  // قائمة الـ Classes المستهدفة
  const classesToObfuscate = [
    'hero-section',
    'container',
    'hero-right',
    'hero-left',
    'hero-text',
    'hero-link',
    'hero-left-top',
    'hero-left-bottom'
  ];
  
  let obfuscatedCode = code;
  
  classesToObfuscate.forEach((className, index) => {
    // توليد اسم عشوائي
    const obfuscatedName = `_${Math.random().toString(36).substring(2, 8)}`;
    classMap[className] = obfuscatedName;
    
    // استبدال كل الظهورات
    const regex = new RegExp(className, 'g');
    obfuscatedCode = obfuscatedCode.replace(regex, obfuscatedName);
  });
  
  return { code: obfuscatedCode, map: classMap };
}

// 4️⃣ تصغير الكود (Minification)
export function minifyCode(code: string): string {
  return code
    // إزالة التعليقات
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')
    // إزالة المسافات الزائدة
    .replace(/\s+/g, ' ')
    // إزالة المسافات حول الأقواس
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .trim();
}

// 5️⃣ إضافة Watermark خفي
export function addWatermark(code: string, userId: string): string {
  const timestamp = Date.now();
  const watermark = `<!--${btoa(`uid:${userId}|ts:${timestamp}`)}-->`;
  
  // إضافة watermark مخفي في مكان عشوائي
  const position = Math.floor(code.length / 2);
  return code.slice(0, position) + watermark + code.slice(position);
}

// 6️⃣ تقسيم الكود لأجزاء (Code Splitting)
export function splitCode(code: string, parts: number = 3): string[] {
  const chunkSize = Math.ceil(code.length / parts);
  const chunks: string[] = [];
  
  for (let i = 0; i < parts; i++) {
    chunks.push(code.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  
  return chunks;
}

// 7️⃣ النظام الكامل
export function protectCode(code: string, userId: string = 'anonymous'): {
  encrypted: string;
  chunks: string[];
  map: Record<string, string>;
} {
  // 1. Obfuscation
  const { code: obfuscatedCode, map } = obfuscateClassNames(code);
  
  // 2. Minification
  const minified = minifyCode(obfuscatedCode);
  
  // 3. Watermark
  const watermarked = addWatermark(minified, userId);
  
  // 4. Encryption
  const encrypted = encryptCode(watermarked);
  
  // 5. Splitting
  const chunks = splitCode(encrypted, 3);
  
  return { encrypted, chunks, map };
}

// 8️⃣ استرجاع الكود الأصلي
export function unprotectCode(chunks: string[]): string {
  // 1. دمج الأجزاء
  const encrypted = chunks.join('');
  
  // 2. فك التشفير
  const decrypted = decryptCode(encrypted);
  
  return decrypted;
}