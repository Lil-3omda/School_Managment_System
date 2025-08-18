# دليل التثبيت الشامل - نظام إدارة المدرسة
# Complete Installation Guide - School Management System

هذا الدليل مخصص للعملاء الذين ليس لديهم خبرة تقنية ويريدون تشغيل نظام إدارة المدرسة على أجهزتهم.

This guide is for clients who have no technical experience and want to run the School Management System on their computers.

---

## 📋 متطلبات النظام / System Requirements

قبل البدء، تأكد من أن جهازك يحتوي على:
Before starting, make sure your computer has:

- **نظام التشغيل / Operating System**: Windows 10 أو أحدث / Windows 10 or newer
- **الذاكرة / RAM**: 8 جيجابايت على الأقل / At least 8 GB
- **مساحة القرص الصلب / Hard Disk Space**: 10 جيجابايت متاحة / 10 GB available
- **اتصال بالإنترنت / Internet Connection**: مطلوب للتحميل / Required for downloads

---

## 🔧 الخطوة 1: تحميل وتثبيت البرامج المطلوبة
## Step 1: Download and Install Required Software

### أ) تحميل وتثبيت .NET 8 SDK
### A) Download and Install .NET 8 SDK

1. **اذهب إلى الموقع الرسمي / Go to official website:**
   ```
   https://dotnet.microsoft.com/download/dotnet/8.0
   ```

2. **اختر "Download .NET 8.0 SDK" للويندوز / Choose "Download .NET 8.0 SDK" for Windows**

3. **شغل الملف المحمل واتبع التعليمات / Run the downloaded file and follow instructions**
   - اضغط "Next" في جميع الشاشات / Click "Next" on all screens
   - اضغط "Install" / Click "Install"
   - انتظر حتى انتهاء التثبيت / Wait for installation to complete

4. **تأكد من التثبيت / Verify installation:**
   - اضغط `Windows + R`
   - اكتب `cmd` واضغط Enter / Type `cmd` and press Enter
   - اكتب `dotnet --version` واضغط Enter / Type `dotnet --version` and press Enter
   - يجب أن ترى رقم الإصدار مثل "8.0.x" / You should see version number like "8.0.x"

### ب) تحميل وتثبيت Node.js
### B) Download and Install Node.js

1. **اذهب إلى الموقع الرسمي / Go to official website:**
   ```
   https://nodejs.org
   ```

2. **اختر النسخة LTS (الموصى بها) / Choose LTS version (recommended)**

3. **شغل الملف المحمل واتبع التعليمات / Run the downloaded file and follow instructions**
   - اضغط "Next" في جميع الشاشات / Click "Next" on all screens
   - تأكد من تحديد "Add to PATH" / Make sure "Add to PATH" is checked
   - اضغط "Install" / Click "Install"

4. **تأكد من التثبيت / Verify installation:**
   - افتح Command Prompt جديد / Open new Command Prompt
   - اكتب `node --version` / Type `node --version`
   - اكتب `npm --version` / Type `npm --version`
   - يجب أن ترى أرقام الإصدارات / You should see version numbers

### ج) تحميل وتثبيت Git (اختياري)
### C) Download and Install Git (Optional)

1. **اذهب إلى / Go to:**
   ```
   https://git-scm.com/download/win
   ```

2. **حمل وثبت Git / Download and install Git**
   - استخدم الإعدادات الافتراضية / Use default settings

---

## 📁 الخطوة 2: الحصول على ملفات المشروع
## Step 2: Get Project Files

### الطريقة الأولى: تحميل ZIP (الأسهل)
### Method 1: Download ZIP (Easiest)

1. **اذهب إلى صفحة المشروع على GitHub**
2. **اضغط على الزر الأخضر "Code"**
3. **اختر "Download ZIP"**
4. **فك الضغط عن الملف في مجلد مثل `C:\SchoolManagement`**

### الطريقة الثانية: استخدام Git
### Method 2: Using Git

```bash
git clone [repository-url]
cd SchoolManagement
```

---

## 🗄️ الخطوة 3: إعداد قاعدة البيانات
## Step 3: Database Setup

### أ) تحميل SQL Server Express (مجاني)
### A) Download SQL Server Express (Free)

1. **اذهب إلى / Go to:**
   ```
   https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   ```

2. **اختر "Express" واضغط "Download now"**

3. **شغل الملف المحمل:**
   - اختر "Basic" / Choose "Basic"
   - اضغط "Accept" للموافقة على الترخيص / Click "Accept" for license
   - اختر مجلد التثبيت أو اتركه افتراضي / Choose installation folder or leave default
   - اضغط "Install" / Click "Install"

4. **بعد انتهاء التثبيت، احفظ معلومات الاتصال المعروضة**
   **After installation, save the connection information shown**

### ب) تحميل SQL Server Management Studio (SSMS)
### B) Download SQL Server Management Studio (SSMS)

1. **اذهب إلى / Go to:**
   ```
   https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
   ```

2. **حمل وثبت SSMS / Download and install SSMS**

---

## 🚀 الخطوة 4: تشغيل الخادم (Backend)
## Step 4: Run the Server (Backend)

1. **افتح Command Prompt كمدير / Open Command Prompt as Administrator:**
   - اضغط `Windows + X`
   - اختر "Windows PowerShell (Admin)" أو "Command Prompt (Admin)"

2. **انتقل إلى مجلد Backend / Navigate to Backend folder:**
   ```bash
   cd C:\SchoolManagement\Backend\SchoolManagement.API
   ```

3. **استعادة الحزم / Restore packages:**
   ```bash
   dotnet restore
   ```

4. **إنشاء قاعدة البيانات / Create database:**
   ```bash
   dotnet ef database update
   ```

5. **تشغيل الخادم / Run the server:**
   ```bash
   dotnet run
   ```

6. **يجب أن ترى رسالة مثل / You should see a message like:**
   ```
   Now listening on: https://localhost:53922
   Application started. Press Ctrl+C to shut down.
   ```

7. **اتركه يعمل ولا تغلق النافذة / Leave it running and don't close the window**

---

## 🌐 الخطوة 5: تشغيل الواجهة الأمامية (Frontend)
## Step 5: Run the Frontend

1. **افتح Command Prompt جديد / Open new Command Prompt:**
   - اضغط `Windows + R`
   - اكتب `cmd` واضغط Enter

2. **انتقل إلى مجلد Frontend / Navigate to Frontend folder:**
   ```bash
   cd C:\SchoolManagement\Frontend
   ```

3. **تثبيت Angular CLI / Install Angular CLI:**
   ```bash
   npm install -g @angular/cli
   ```

4. **تثبيت الحزم المطلوبة / Install required packages:**
   ```bash
   npm install
   ```

5. **تشغيل التطبيق / Run the application:**
   ```bash
   npm start
   ```

6. **انتظر حتى ترى / Wait until you see:**
   ```
   Local:   http://localhost:4200/
   ```

7. **سيفتح المتصفح تلقائياً أو افتحه يدوياً واذهب إلى:**
   **Browser will open automatically or open manually and go to:**
   ```
   http://localhost:4200
   ```

---

## 🔐 الخطوة 6: تسجيل الدخول
## Step 6: Login

استخدم إحدى الحسابات التجريبية التالية:
Use one of the following demo accounts:

### حساب المدير / Admin Account
- **البريد الإلكتروني / Email:** `admin@school.com`
- **كلمة المرور / Password:** `123456`

### حساب المعلم / Teacher Account
- **البريد الإلكتروني / Email:** `teacher@school.com`
- **كلمة المرور / Password:** `123456`

### حساب الطالب / Student Account
- **البريد الإلكتروني / Email:** `student@school.com`
- **كلمة المرور / Password:** `123456`

---

## 🛠️ استكشاف الأخطاء وإصلاحها
## Troubleshooting

### مشكلة: الخادم لا يعمل / Problem: Server not working

**الحل / Solution:**
1. تأكد من تثبيت .NET 8 SDK بشكل صحيح / Make sure .NET 8 SDK is installed correctly
2. تأكد من أن المنفذ 53922 غير مستخدم / Make sure port 53922 is not in use
3. شغل Command Prompt كمدير / Run Command Prompt as Administrator

### مشكلة: الواجهة الأمامية لا تعمل / Problem: Frontend not working

**الحل / Solution:**
1. تأكد من تثبيت Node.js بشكل صحيح / Make sure Node.js is installed correctly
2. احذف مجلد `node_modules` وشغل `npm install` مرة أخرى / Delete `node_modules` folder and run `npm install` again
3. تأكد من أن المنفذ 4200 غير مستخدم / Make sure port 4200 is not in use

### مشكلة: خطأ في قاعدة البيانات / Problem: Database error

**الحل / Solution:**
1. تأكد من تشغيل SQL Server / Make sure SQL Server is running
2. تحقق من سلسلة الاتصال في `appsettings.json` / Check connection string in `appsettings.json`
3. شغل `dotnet ef database update` مرة أخرى / Run `dotnet ef database update` again

### مشكلة: لا يمكن الوصول للتطبيق / Problem: Cannot access application

**الحل / Solution:**
1. تأكد من تشغيل كل من الخادم والواجهة الأمامية / Make sure both server and frontend are running
2. تحقق من عنوان URL: `http://localhost:4200` / Check URL: `http://localhost:4200`
3. تأكد من إعدادات الجدار الناري / Check firewall settings

---

## 📱 كيفية الاستخدام
## How to Use

### للمدير / For Admin:
1. سجل دخول بحساب المدير / Login with admin account
2. يمكنك إدارة الطلاب والمعلمين والصفوف / You can manage students, teachers, and classes
3. عرض التقارير والإحصائيات / View reports and statistics

### للمعلم / For Teacher:
1. سجل دخول بحساب المعلم / Login with teacher account
2. يمكنك إدخال الدرجات وتسجيل الحضور / You can enter grades and mark attendance
3. عرض الجدول الدراسي والراتب / View schedule and salary

### للطالب / For Student:
1. سجل دخول بحساب الطالب / Login with student account
2. يمكنك عرض الدرجات والجدول الدراسي / You can view grades and schedule
3. متابعة الحضور والامتحانات / Track attendance and exams

---

## 🔄 إيقاف وإعادة تشغيل النظام
## Stop and Restart System

### لإيقاف النظام / To Stop System:
1. **أغلق نافذة المتصفح / Close browser window**
2. **في نافذة Backend Command Prompt:**
   - اضغط `Ctrl + C`
   - اكتب `Y` واضغط Enter
3. **في نافذة Frontend Command Prompt:**
   - اضغط `Ctrl + C`
   - اكتب `Y` واضغط Enter

### لإعادة تشغيل النظام / To Restart System:
1. **كرر الخطوات 4 و 5 من الدليل أعلاه**
2. **Repeat steps 4 and 5 from the guide above**

---

## 📞 الدعم الفني / Technical Support

إذا واجهت أي مشاكل، يرجى التواصل مع فريق الدعم الفني مع إرفاق:
If you encounter any problems, please contact technical support with:

1. **لقطة شاشة للخطأ / Screenshot of the error**
2. **نسخ النص من نافذة Command Prompt / Copy text from Command Prompt window**
3. **وصف تفصيلي للمشكلة / Detailed description of the problem**

---

## 📚 ملاحظات مهمة / Important Notes

### للاستخدام اليومي / For Daily Use:
- **احتفظ بنسخة احتياطية من قاعدة البيانات أسبوعياً**
- **Keep weekly backup of database**
- **لا تغلق نوافذ Command Prompt أثناء الاستخدام**
- **Don't close Command Prompt windows during use**
- **استخدم متصفح Chrome أو Edge للحصول على أفضل أداء**
- **Use Chrome or Edge browser for best performance**

### الأمان / Security:
- **غير كلمات المرور الافتراضية فور التشغيل**
- **Change default passwords immediately after setup**
- **لا تشارك معلومات تسجيل الدخول**
- **Don't share login credentials**

### النسخ الاحتياطي / Backup:
- **انسخ مجلد المشروع بالكامل أسبوعياً**
- **Copy entire project folder weekly**
- **احتفظ بنسخة من قاعدة البيانات**
- **Keep database backup**

---

## 🎯 الخطوات السريعة للتشغيل اليومي
## Quick Steps for Daily Startup

بعد التثبيت الأولي، لتشغيل النظام يومياً:
After initial installation, to run system daily:

1. **افتح Command Prompt الأول / Open first Command Prompt:**
   ```bash
   cd C:\SchoolManagement\Backend\SchoolManagement.API
   dotnet run
   ```

2. **افتح Command Prompt الثاني / Open second Command Prompt:**
   ```bash
   cd C:\SchoolManagement\Frontend
   npm start
   ```

3. **افتح المتصفح واذهب إلى / Open browser and go to:**
   ```
   http://localhost:4200
   ```

4. **سجل دخولك بالحساب المناسب / Login with appropriate account**

---

## 📋 قائمة التحقق النهائية / Final Checklist

قبل الاستخدام، تأكد من:
Before using, make sure:

- [ ] تم تثبيت .NET 8 SDK بنجاح / .NET 8 SDK installed successfully
- [ ] تم تثبيت Node.js بنجاح / Node.js installed successfully  
- [ ] تم تثبيت SQL Server Express / SQL Server Express installed
- [ ] تم تحميل ملفات المشروع / Project files downloaded
- [ ] يعمل الخادم على المنفذ 53922 / Server running on port 53922
- [ ] تعمل الواجهة الأمامية على المنفذ 4200 / Frontend running on port 4200
- [ ] يمكن الوصول للتطبيق عبر المتصفح / Application accessible via browser
- [ ] تم اختبار تسجيل الدخول / Login tested successfully

---

## 🎉 تهانينا!
## Congratulations!

نظام إدارة المدرسة جاهز للاستخدام الآن!
The School Management System is now ready to use!

يمكنك البدء في:
You can start:
- إضافة الطلاب والمعلمين / Adding students and teachers
- إنشاء الصفوف والمواد / Creating classes and subjects  
- تسجيل الحضور والدرجات / Recording attendance and grades
- إنشاء التقارير / Generating reports

**استمتع بالاستخدام! / Enjoy using the system!**