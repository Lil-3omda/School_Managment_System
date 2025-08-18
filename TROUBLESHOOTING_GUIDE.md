# دليل استكشاف الأخطاء وإصلاحها
# Troubleshooting Guide

## 🚨 المشاكل الشائعة والحلول
## Common Problems and Solutions

---

## 1️⃣ مشاكل تثبيت البرامج
## Software Installation Issues

### مشكلة: فشل تثبيت .NET SDK
### Problem: .NET SDK Installation Failed

**الأعراض / Symptoms:**
- رسالة خطأ أثناء التثبيت
- الأمر `dotnet --version` لا يعمل

**الحلول / Solutions:**
1. **شغل المثبت كمدير / Run installer as administrator**
2. **أغلق جميع البرامج قبل التثبيت / Close all programs before installation**
3. **حمل النسخة الصحيحة (x64 لمعظم الأجهزة) / Download correct version (x64 for most computers)**
4. **أعد تشغيل الكمبيوتر بعد التثبيت / Restart computer after installation**

### مشكلة: فشل تثبيت Node.js
### Problem: Node.js Installation Failed

**الحلول / Solutions:**
1. **حمل من الموقع الرسمي فقط / Download from official website only**
2. **اختر النسخة LTS / Choose LTS version**
3. **تأكد من تحديد "Add to PATH" / Make sure "Add to PATH" is checked**

---

## 2️⃣ مشاكل قاعدة البيانات
## Database Issues

### مشكلة: خطأ في الاتصال بقاعدة البيانات
### Problem: Database Connection Error

**رسائل الخطأ الشائعة / Common Error Messages:**
```
- "Cannot connect to SQL Server"
- "Login failed for user"
- "Database does not exist"
```

**الحلول / Solutions:**

1. **تحقق من تشغيل SQL Server / Check if SQL Server is running:**
   ```bash
   # افتح Services (اكتب services.msc في Run)
   # ابحث عن "SQL Server" وتأكد أنه يعمل
   ```

2. **تحديث سلسلة الاتصال / Update connection string:**
   ```json
   // في ملف appsettings.json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Data Source=SchoolManagementDB.db"
     }
   }
   ```

3. **إعادة إنشاء قاعدة البيانات / Recreate database:**
   ```bash
   cd Backend\SchoolManagement.API
   dotnet ef database drop --force
   dotnet ef database update
   ```

### مشكلة: بيانات تجريبية مفقودة
### Problem: Missing Demo Data

**الحل / Solution:**
```bash
# احذف قاعدة البيانات وأعد إنشاؤها
cd Backend\SchoolManagement.API
dotnet ef database drop --force
dotnet ef database update
dotnet run
```

---

## 3️⃣ مشاكل الخادم (Backend)
## Server (Backend) Issues

### مشكلة: الخادم لا يبدأ
### Problem: Server Won't Start

**رسائل الخطأ الشائعة / Common Error Messages:**
```
- "Port already in use"
- "Unable to bind to https://localhost:53922"
- "Access denied"
```

**الحلول / Solutions:**

1. **تحقق من المنفذ / Check port:**
   ```bash
   # افتح Command Prompt كمدير وشغل:
   netstat -ano | findstr :53922
   # إذا كان المنفذ مستخدم، أغلق البرنامج المستخدم له
   ```

2. **شغل كمدير / Run as administrator:**
   ```bash
   # اضغط Windows + X
   # اختر "Windows PowerShell (Admin)"
   cd C:\SchoolManagement\Backend\SchoolManagement.API
   dotnet run
   ```

3. **تغيير المنفذ / Change port:**
   ```json
   // في ملف Properties/launchSettings.json
   {
     "applicationUrl": "https://localhost:5001;http://localhost:5000"
   }
   ```

### مشكلة: خطأ في الحزم
### Problem: Package Errors

**الحل / Solution:**
```bash
cd Backend\SchoolManagement.API
dotnet clean
dotnet restore
dotnet build
dotnet run
```

---

## 4️⃣ مشاكل الواجهة الأمامية (Frontend)
## Frontend Issues

### مشكلة: npm install فشل
### Problem: npm install Failed

**الحلول / Solutions:**

1. **امسح الكاش / Clear cache:**
   ```bash
   npm cache clean --force
   ```

2. **احذف node_modules / Delete node_modules:**
   ```bash
   cd Frontend
   rmdir /s node_modules
   del package-lock.json
   npm install
   ```

3. **استخدم npm بدلاً من yarn / Use npm instead of yarn:**
   ```bash
   npm install --legacy-peer-deps
   ```

### مشكلة: Angular CLI لا يعمل
### Problem: Angular CLI Not Working

**الحل / Solution:**
```bash
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest
ng version
```

### مشكلة: صفحة بيضاء في المتصفح
### Problem: White Page in Browser

**الحلول / Solutions:**

1. **تحقق من Console في المتصفح / Check browser console:**
   - اضغط F12
   - اذهب إلى تبويب Console
   - ابحث عن رسائل خطأ حمراء

2. **تحقق من تشغيل الخادم / Check if server is running:**
   ```bash
   # يجب أن ترى رسالة مثل:
   # "Now listening on: https://localhost:53922"
   ```

3. **امسح بيانات المتصفح / Clear browser data:**
   - اضغط Ctrl + Shift + Delete
   - احذف Cookies وCache

---

## 5️⃣ مشاكل الشبكة والاتصال
## Network and Connection Issues

### مشكلة: CORS Error
**رسالة الخطأ / Error Message:**
```
"Access to XMLHttpRequest blocked by CORS policy"
```

**الحل / Solution:**
```csharp
// في ملف Program.cs تأكد من وجود:
app.UseCors("AllowAngularApp");
```

### مشكلة: API لا يستجيب
### Problem: API Not Responding

**الحلول / Solutions:**

1. **تحقق من عنوان API / Check API URL:**
   ```typescript
   // في ملف environment.ts
   export const environment = {
     apiUrl: 'https://localhost:53922/api/v1'
   };
   ```

2. **اختبر API مباشرة / Test API directly:**
   ```
   افتح المتصفح واذهب إلى:
   https://localhost:53922/api/v1/test/ping
   ```

---

## 6️⃣ مشاكل تسجيل الدخول
## Login Issues

### مشكلة: لا يمكن تسجيل الدخول
### Problem: Cannot Login

**الحلول / Solutions:**

1. **تأكد من الحسابات التجريبية / Verify demo accounts:**
   ```
   Admin: admin@school.com / 123456
   Teacher: teacher@school.com / 123456  
   Student: student@school.com / 123456
   ```

2. **إعادة تعيين قاعدة البيانات / Reset database:**
   ```bash
   cd Backend\SchoolManagement.API
   dotnet ef database drop --force
   dotnet ef database update
   ```

3. **تحقق من JWT Settings / Check JWT settings:**
   ```json
   // في appsettings.json
   {
     "Jwt": {
       "Key": "your-super-secret-key-that-is-at-least-32-characters-long",
       "Issuer": "SchoolManagementAPI",
       "Audience": "SchoolManagementClient"
     }
   }
   ```

---

## 7️⃣ مشاكل الأداء
## Performance Issues

### مشكلة: النظام بطيء
### Problem: System is Slow

**الحلول / Solutions:**

1. **أغلق البرامج غير المستخدمة / Close unused programs**
2. **تأكد من وجود ذاكرة كافية (8GB+) / Ensure sufficient RAM (8GB+)**
3. **استخدم متصفح Chrome أو Edge / Use Chrome or Edge browser**
4. **تحقق من مساحة القرص الصلب / Check hard disk space**

---

## 8️⃣ مشاكل المتصفح
## Browser Issues

### مشكلة: التطبيق لا يظهر بشكل صحيح
### Problem: Application Not Displaying Correctly

**الحلول / Solutions:**

1. **امسح بيانات المتصفح / Clear browser data:**
   ```
   Chrome: Ctrl + Shift + Delete
   Edge: Ctrl + Shift + Delete
   ```

2. **تعطيل الإضافات / Disable extensions:**
   - اذهب إلى إعدادات المتصفح
   - عطل جميع الإضافات مؤقتاً

3. **تحديث المتصفح / Update browser:**
   - تأكد من استخدام أحدث إصدار

---

## 🔧 أدوات التشخيص
## Diagnostic Tools

### فحص حالة النظام / System Health Check

```bash
# 1. تحقق من .NET
dotnet --version

# 2. تحقق من Node.js
node --version
npm --version

# 3. تحقق من Angular CLI
ng version

# 4. تحقق من المنافذ
netstat -ano | findstr :53922
netstat -ano | findstr :4200
```

### فحص الاتصال / Connection Test

```bash
# اختبر API
curl https://localhost:53922/api/v1/test/ping

# أو افتح في المتصفح:
# https://localhost:53922/swagger
```

---

## 📋 قائمة تحقق سريعة
## Quick Checklist

عند مواجهة أي مشكلة، تحقق من:
When facing any issue, check:

- [ ] تم تثبيت .NET 8 SDK
- [ ] تم تثبيت Node.js  
- [ ] تم تشغيل الخادم (Backend)
- [ ] تم تشغيل الواجهة (Frontend)
- [ ] المتصفح يدعم JavaScript
- [ ] لا توجد رسائل خطأ في Command Prompt
- [ ] المنافذ 53922 و 4200 متاحة
- [ ] اتصال الإنترنت يعمل

---

## 📞 الحصول على المساعدة
## Getting Help

### معلومات مطلوبة عند طلب المساعدة:
### Required Information When Asking for Help:

1. **نظام التشغيل / Operating System:**
   ```
   Windows 10/11, macOS, Linux
   ```

2. **إصدارات البرامج / Software Versions:**
   ```bash
   dotnet --version
   node --version
   ng --version
   ```

3. **رسالة الخطأ الكاملة / Complete Error Message:**
   ```
   انسخ النص الكامل من Command Prompt
   Copy full text from Command Prompt
   ```

4. **لقطة شاشة / Screenshot:**
   ```
   صورة للخطأ أو المشكلة
   Image of error or problem
   ```

5. **الخطوات المتبعة / Steps Taken:**
   ```
   اذكر ما فعلته قبل ظهور المشكلة
   Mention what you did before the problem appeared
   ```

---

## 🔄 إعادة التثبيت الكاملة
## Complete Reinstallation

إذا فشلت جميع الحلول:
If all solutions fail:

### 1. إزالة كاملة / Complete Removal
```bash
# احذف مجلد المشروع
# Delete project folder

# إلغاء تثبيت البرامج من Control Panel
# Uninstall programs from Control Panel
```

### 2. تثبيت جديد / Fresh Installation
```bash
# اتبع دليل التثبيت من البداية
# Follow installation guide from beginning
```

---

## 📊 مراقبة الأداء
## Performance Monitoring

### فحص استخدام الموارد / Resource Usage Check

```bash
# فتح Task Manager
Ctrl + Shift + Esc

# ابحث عن:
# Look for:
- dotnet.exe (Backend)
- node.exe (Frontend)
- Chrome/Edge (Browser)
```

### تحسين الأداء / Performance Optimization

1. **أغلق البرامج غير المستخدمة / Close unused programs**
2. **زد الذاكرة إذا أمكن / Increase RAM if possible**
3. **استخدم SSD بدلاً من HDD / Use SSD instead of HDD**
4. **نظف ملفات النظام المؤقتة / Clean temporary system files**

---

## 🛡️ الأمان والحماية
## Security and Protection

### تغيير كلمات المرور الافتراضية
### Change Default Passwords

```sql
-- في قاعدة البيانات، شغل:
UPDATE Users SET PasswordHash = '[new-hashed-password]' 
WHERE Email = 'admin@school.com';
```

### تحديث إعدادات JWT
### Update JWT Settings

```json
// في appsettings.json
{
  "Jwt": {
    "Key": "your-new-super-secret-key-minimum-32-characters",
    "Issuer": "YourSchoolName",
    "Audience": "YourSchoolUsers"
  }
}
```

---

## 📱 مشاكل المتصفح المحمول
## Mobile Browser Issues

### مشكلة: التطبيق لا يعمل على الهاتف
### Problem: App Not Working on Phone

**الحلول / Solutions:**

1. **تأكد من الاتصال بنفس الشبكة / Ensure same network connection**
2. **استخدم عنوان IP بدلاً من localhost / Use IP address instead of localhost:**
   ```
   http://192.168.1.100:4200
   ```
3. **فعل Developer Mode في المتصفح / Enable Developer Mode in browser**

---

## 🔍 أدوات التشخيص المتقدمة
## Advanced Diagnostic Tools

### فحص شامل للنظام / Comprehensive System Check

```bash
# إنشاء ملف تشخيص
echo "=== System Diagnostic Report ===" > diagnostic.txt
echo "Date: %date% %time%" >> diagnostic.txt
echo. >> diagnostic.txt

echo "=== .NET Version ===" >> diagnostic.txt
dotnet --version >> diagnostic.txt
echo. >> diagnostic.txt

echo "=== Node.js Version ===" >> diagnostic.txt
node --version >> diagnostic.txt
npm --version >> diagnostic.txt
echo. >> diagnostic.txt

echo "=== Port Status ===" >> diagnostic.txt
netstat -ano | findstr :53922 >> diagnostic.txt
netstat -ano | findstr :4200 >> diagnostic.txt
echo. >> diagnostic.txt

echo "=== Running Processes ===" >> diagnostic.txt
tasklist | findstr dotnet >> diagnostic.txt
tasklist | findstr node >> diagnostic.txt
```

### فحص ملفات المشروع / Project Files Check

```bash
# تحقق من وجود الملفات المهمة
dir Backend\SchoolManagement.API\*.csproj
dir Frontend\package.json
dir Frontend\angular.json
```

---

## 📞 جهات الاتصال للدعم
## Support Contacts

### الدعم الفني / Technical Support
- **البريد الإلكتروني / Email:** support@schoolmanagement.com
- **الهاتف / Phone:** +966-XX-XXX-XXXX
- **ساعات العمل / Working Hours:** 9 صباحاً - 5 مساءً

### الدعم الطارئ / Emergency Support
- **للمشاكل الحرجة فقط / Critical issues only**
- **متاح 24/7 / Available 24/7**

---

## 📚 موارد إضافية
## Additional Resources

### الوثائق الرسمية / Official Documentation
- **.NET:** https://docs.microsoft.com/dotnet
- **Angular:** https://angular.io/docs
- **Bootstrap:** https://getbootstrap.com/docs

### فيديوهات تعليمية / Tutorial Videos
- **قناة YouTube الرسمية / Official YouTube Channel**
- **دروس خطوة بخطوة / Step-by-step tutorials**

### منتدى المجتمع / Community Forum
- **طرح الأسئلة / Ask questions**
- **مشاركة الحلول / Share solutions**
- **التواصل مع المستخدمين الآخرين / Connect with other users**

---

## ✅ نصائح للوقاية من المشاكل
## Prevention Tips

1. **اعمل نسخة احتياطية أسبوعياً / Weekly backup**
2. **حدث البرامج بانتظام / Update software regularly**
3. **راقب مساحة القرص الصلب / Monitor disk space**
4. **استخدم UPS لحماية من انقطاع الكهرباء / Use UPS for power protection**
5. **تدرب على استخدام النظام / Practice using the system**

---

**💡 تذكر: معظم المشاكل لها حلول بسيطة!**
**💡 Remember: Most problems have simple solutions!**