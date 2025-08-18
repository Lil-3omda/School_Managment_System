# دليل البدء السريع - نظام إدارة المدرسة
# Quick Start Guide - School Management System

## 🚀 تشغيل سريع في 5 دقائق
## Quick Setup in 5 Minutes

### المتطلبات المسبقة / Prerequisites
- Windows 10 أو أحدث / Windows 10 or newer
- اتصال بالإنترنت / Internet connection

---

## 📥 الخطوة 1: تحميل البرامج (10 دقائق)
## Step 1: Download Software (10 minutes)

### أ) .NET 8 SDK
```
1. اذهب إلى: https://dotnet.microsoft.com/download/dotnet/8.0
2. اضغط "Download .NET 8.0 SDK" 
3. شغل الملف واضغط "Next" → "Install"
4. انتظر انتهاء التثبيت
```

### ب) Node.js
```
1. اذهب إلى: https://nodejs.org
2. اضغط "Download LTS"
3. شغل الملف واضغط "Next" → "Install" 
4. تأكد من تحديد "Add to PATH"
```

---

## 📁 الخطوة 2: تحميل المشروع (2 دقيقة)
## Step 2: Download Project (2 minutes)

1. **حمل ملف ZIP من GitHub**
2. **فك الضغط في `C:\SchoolManagement`**

---

## ⚡ الخطوة 3: تشغيل النظام (3 دقائق)
## Step 3: Run System (3 minutes)

### أ) تشغيل الخادم / Run Server
```bash
# افتح Command Prompt واكتب:
cd C:\SchoolManagement\Backend\SchoolManagement.API
dotnet restore
dotnet run
```

### ب) تشغيل الواجهة / Run Frontend  
```bash
# افتح Command Prompt جديد واكتب:
cd C:\SchoolManagement\Frontend
npm install
npm start
```

---

## 🌐 الخطوة 4: الوصول للنظام
## Step 4: Access System

1. **افتح المتصفح واذهب إلى:**
   ```
   http://localhost:4200
   ```

2. **سجل دخول بأحد الحسابات:**

   **مدير / Admin:**
   - البريد: `admin@school.com`
   - كلمة المرور: `123456`

   **معلم / Teacher:**
   - البريد: `teacher@school.com`  
   - كلمة المرور: `123456`

   **طالب / Student:**
   - البريد: `student@school.com`
   - كلمة المرور: `123456`

---

## ✅ التحقق من التشغيل
## Verify Installation

### علامات النجاح / Success Signs:
- [ ] صفحة تسجيل الدخول تظهر بشكل صحيح
- [ ] يمكن تسجيل الدخول بالحسابات التجريبية  
- [ ] لوحة التحكم تظهر البيانات
- [ ] يمكن التنقل بين الصفحات

### في حالة المشاكل / If Problems:
1. **تأكد من تشغيل كلا البرنامجين**
2. **تحقق من رسائل الخطأ في Command Prompt**
3. **أعد تشغيل الكمبيوتر وحاول مرة أخرى**

---

## 🔄 التشغيل اليومي
## Daily Startup

بعد التثبيت الأولي، للتشغيل اليومي:
After initial setup, for daily use:

```bash
# نافذة 1 - الخادم / Window 1 - Server
cd C:\SchoolManagement\Backend\SchoolManagement.API
dotnet run

# نافذة 2 - الواجهة / Window 2 - Frontend  
cd C:\SchoolManagement\Frontend
npm start
```

**ثم افتح المتصفح: `http://localhost:4200`**
**Then open browser: `http://localhost:4200`**

---

## 📞 المساعدة السريعة
## Quick Help

### أرقام المنافذ / Port Numbers:
- **الخادم / Server:** `https://localhost:53922`
- **الواجهة / Frontend:** `http://localhost:4200`

### أوامر مفيدة / Useful Commands:
```bash
# تحقق من إصدار .NET
dotnet --version

# تحقق من إصدار Node.js  
node --version

# إيقاف البرنامج
Ctrl + C
```

### ملفات مهمة / Important Files:
- **إعدادات الخادم:** `Backend\SchoolManagement.API\appsettings.json`
- **إعدادات الواجهة:** `Frontend\src\environments\environment.ts`

---

## 🎯 نصائح للاستخدام الأمثل
## Tips for Optimal Use

1. **استخدم متصفح Chrome أو Edge**
2. **لا تغلق نوافذ Command Prompt أثناء الاستخدام**
3. **احفظ عملك بانتظام**
4. **اعمل نسخة احتياطية أسبوعياً**
5. **غير كلمات المرور الافتراضية**

---

**🎉 مبروك! النظام جاهز للاستخدام**
**🎉 Congratulations! System is ready to use**