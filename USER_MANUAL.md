# دليل المستخدم - نظام إدارة المدرسة
# User Manual - School Management System

## 📖 مقدمة
## Introduction

نظام إدارة المدرسة هو نظام شامل لإدارة العملية التعليمية يشمل إدارة الطلاب والمعلمين والصفوف والدرجات والحضور والرواتب.

The School Management System is a comprehensive system for managing educational processes including students, teachers, classes, grades, attendance, and salaries.

---

## 🎯 الأدوار والصلاحيات
## Roles and Permissions

### 👨‍💼 المدير / Administrator
**الصلاحيات / Permissions:**
- إدارة جميع المستخدمين (طلاب، معلمين)
- إنشاء وتعديل الصفوف والمواد
- عرض جميع التقارير والإحصائيات
- إدارة الرواتب والمدفوعات
- إعدادات النظام العامة

### 👨‍🏫 المعلم / Teacher  
**الصلاحيات / Permissions:**
- عرض الصفوف المخصصة له
- تسجيل حضور الطلاب
- إدخال وتعديل الدرجات
- إنشاء الامتحانات
- عرض الراتب الشخصي
- تحديث الملف الشخصي

### 👩‍🎓 الطالب / Student
**الصلاحيات / Permissions:**
- عرض الملف الشخصي
- مشاهدة الجدول الدراسي
- عرض الدرجات والنتائج
- متابعة سجل الحضور
- عرض الامتحانات القادمة

---

## 🚪 تسجيل الدخول
## Login Process

### الخطوات / Steps:
1. **افتح المتصفح واذهب إلى / Open browser and go to:**
   ```
   http://localhost:4200
   ```

2. **أدخل بيانات تسجيل الدخول / Enter login credentials:**
   - البريد الإلكتروني / Email
   - كلمة المرور / Password

3. **اضغط "تسجيل الدخول" / Click "Login"**

### الحسابات التجريبية / Demo Accounts:
```
مدير / Admin: admin@school.com / 123456
معلم / Teacher: teacher@school.com / 123456  
طالب / Student: student@school.com / 123456
```

---

## 👨‍💼 دليل المدير
## Administrator Guide

### لوحة التحكم الرئيسية / Main Dashboard

**الإحصائيات المعروضة / Displayed Statistics:**
- إجمالي الطلاب / Total Students
- إجمالي المعلمين / Total Teachers  
- إجمالي الصفوف / Total Classes
- الامتحانات القادمة / Upcoming Exams

### إدارة الطلاب / Student Management

#### إضافة طالب جديد / Add New Student:
1. **اذهب إلى "إدارة الطلاب" / Go to "Student Management"**
2. **اضغط "إضافة طالب جديد" / Click "Add New Student"**
3. **املأ النموذج / Fill the form:**
   - المعلومات الشخصية / Personal Information
   - معلومات ولي الأمر / Guardian Information  
   - معلومات الدفع / Payment Information
4. **اضغط "حفظ" / Click "Save"**

#### تعديل بيانات طالب / Edit Student Data:
1. **ابحث عن الطالب / Search for student**
2. **اضغط أيقونة "تعديل" / Click "Edit" icon**
3. **عدل البيانات المطلوبة / Modify required data**
4. **اضغط "حفظ التغييرات" / Click "Save Changes"**

#### حذف طالب / Delete Student:
1. **اضغط أيقونة "حذف" / Click "Delete" icon**
2. **أكد الحذف / Confirm deletion**

### إدارة المعلمين / Teacher Management

#### إضافة معلم جديد / Add New Teacher:
1. **اذهب إلى "إدارة المعلمين" / Go to "Teacher Management"**
2. **اضغط "إضافة معلم جديد" / Click "Add New Teacher"**
3. **املأ البيانات / Fill data:**
   - المعلومات الشخصية / Personal Information
   - المعلومات المهنية / Professional Information
   - معلومات الراتب / Salary Information
4. **اضغط "حفظ" / Click "Save"**

### إدارة الصفوف / Class Management

#### إنشاء صف جديد / Create New Class:
1. **اذهب إلى "إدارة الصفوف" / Go to "Class Management"**
2. **اضغط "إضافة صف جديد" / Click "Add New Class"**
3. **أدخل تفاصيل الصف / Enter class details:**
   - اسم الصف / Class Name
   - السعة / Capacity
   - القاعة / Room
   - أوقات الدراسة / Study Times
4. **اضغط "حفظ" / Click "Save"**

### إدارة المواد / Subject Management

#### إضافة مادة جديدة / Add New Subject:
1. **اذهب إلى "إدارة المواد" / Go to "Subject Management"**
2. **اضغط "إضافة مادة جديدة" / Click "Add New Subject"**
3. **أدخل معلومات المادة / Enter subject information:**
   - اسم المادة / Subject Name
   - كود المادة / Subject Code
   - عدد الساعات / Credit Hours
   - الوصف / Description
4. **اضغط "حفظ" / Click "Save"**

### تقارير الحضور / Attendance Reports

#### إنشاء تقرير حضور / Generate Attendance Report:
1. **اذهب إلى "تقارير الحضور" / Go to "Attendance Reports"**
2. **اختر المعايير / Select criteria:**
   - الصف / Class
   - التاريخ من / Date From
   - التاريخ إلى / Date To
3. **اضغط "إنشاء التقرير" / Click "Generate Report"**
4. **اضغط "تصدير" لحفظ التقرير / Click "Export" to save report**

---

## 👨‍🏫 دليل المعلم
## Teacher Guide

### لوحة التحكم / Dashboard

**المعلومات المعروضة / Displayed Information:**
- صفوفي / My Classes
- إجمالي الطلاب / Total Students
- الامتحانات الشهرية / Monthly Exams
- متوسط الحضور / Average Attendance

### تسجيل الحضور / Mark Attendance

#### تسجيل حضور يومي / Daily Attendance:
1. **اذهب إلى "الحضور والغياب" / Go to "Attendance"**
2. **اضغط "تسجيل حضور جديد" / Click "Mark New Attendance"**
3. **اختر / Select:**
   - التاريخ / Date
   - الصف / Class
   - الطالب / Student
   - حالة الحضور / Attendance Status
4. **أضف ملاحظات إذا لزم الأمر / Add remarks if needed**
5. **اضغط "حفظ" / Click "Save"**

### إدخال الدرجات / Enter Grades

#### إضافة درجة جديدة / Add New Grade:
1. **اذهب إلى "إدخال الدرجات" / Go to "Enter Grades"**
2. **اضغط "إضافة درجة جديدة" / Click "Add New Grade"**
3. **اختر / Select:**
   - الطالب / Student
   - الامتحان / Exam
   - الدرجة المحصلة / Obtained Marks
   - التقدير / Grade
4. **حدد حالة النجاح / Mark pass status**
5. **اضغط "حفظ" / Click "Save"**

### إنشاء امتحان / Create Exam

#### إنشاء امتحان جديد / Create New Exam:
1. **اذهب إلى "الامتحانات" / Go to "Exams"**
2. **اضغط "إنشاء امتحان جديد" / Click "Create New Exam"**
3. **أدخل تفاصيل الامتحان / Enter exam details:**
   - اسم الامتحان / Exam Name
   - المادة / Subject
   - الصف / Class
   - التاريخ والوقت / Date and Time
   - المدة / Duration
   - الدرجة الكلية / Total Marks
4. **اضغط "حفظ" / Click "Save"**

---

## 👩‍🎓 دليل الطالب
## Student Guide

### الملف الشخصي / Personal Profile

#### تحديث المعلومات الشخصية / Update Personal Information:
1. **اذهب إلى "الملف الشخصي" / Go to "Profile"**
2. **اضغط "تعديل" / Click "Edit"**
3. **عدل المعلومات المطلوبة / Modify required information**
4. **اضغط "حفظ التغييرات" / Click "Save Changes"**

### عرض الدرجات / View Grades

#### مشاهدة النتائج / View Results:
1. **اذهب إلى "الدرجات والنتائج" / Go to "Grades and Results"**
2. **استخدم المرشحات / Use filters:**
   - الفصل الدراسي / Semester
   - المادة / Subject
3. **عرض التفاصيل / View details:**
   - الدرجة المحصلة / Obtained Grade
   - النسبة المئوية / Percentage
   - التقدير / Grade Value
   - حالة النجاح / Pass Status

### الجدول الدراسي / Class Schedule

#### عرض الجدول الأسبوعي / View Weekly Schedule:
1. **اذهب إلى "الجدول الدراسي" / Go to "Class Schedule"**
2. **عرض الجدول حسب اليوم / View schedule by day**
3. **معلومات كل حصة / Information for each period:**
   - الوقت / Time
   - المادة / Subject
   - المعلم / Teacher
   - القاعة / Room

### سجل الحضور / Attendance Record

#### مراجعة الحضور / Review Attendance:
1. **اذهب إلى "سجل الحضور" / Go to "Attendance Record"**
2. **استخدم المرشحات / Use filters:**
   - الشهر / Month
   - السنة / Year
   - المادة / Subject
3. **عرض الإحصائيات / View statistics:**
   - نسبة الحضور / Attendance Rate
   - أيام الحضور / Present Days
   - أيام الغياب / Absent Days

---

## 🔧 الإعدادات والتخصيص
## Settings and Customization

### تغيير كلمة المرور / Change Password

1. **اذهب إلى الملف الشخصي / Go to Profile**
2. **اضغط "تغيير كلمة المرور" / Click "Change Password"**
3. **أدخل / Enter:**
   - كلمة المرور الحالية / Current Password
   - كلمة المرور الجديدة / New Password
   - تأكيد كلمة المرور / Confirm Password
4. **اضغط "حفظ" / Click "Save"**

### إعدادات الإشعارات / Notification Settings

1. **اذهب إلى الإعدادات / Go to Settings**
2. **اختر أنواع الإشعارات المطلوبة / Choose required notification types:**
   - إشعارات الامتحانات / Exam Notifications
   - إشعارات الدرجات / Grade Notifications
   - إشعارات الحضور / Attendance Notifications
3. **اضغط "حفظ الإعدادات" / Click "Save Settings"**

---

## 📊 التقارير والإحصائيات
## Reports and Statistics

### تقارير الطلاب / Student Reports

#### تقرير أداء طالب / Student Performance Report:
1. **اختر الطالب / Select Student**
2. **حدد الفترة الزمنية / Select Time Period**
3. **اختر نوع التقرير / Choose Report Type:**
   - تقرير الدرجات / Grades Report
   - تقرير الحضور / Attendance Report
   - تقرير شامل / Comprehensive Report
4. **اضغط "إنشاء التقرير" / Click "Generate Report"**
5. **اضغط "تصدير" لحفظ PDF أو Excel / Click "Export" to save as PDF or Excel**

### تقارير الصفوف / Class Reports

#### تقرير أداء صف / Class Performance Report:
1. **اختر الصف / Select Class**
2. **اختر المادة / Select Subject**
3. **حدد الفترة / Select Period**
4. **اضغط "إنشاء التقرير" / Click "Generate Report"**

---

## 🔍 البحث والتصفية
## Search and Filtering

### البحث المتقدم / Advanced Search

#### البحث في الطلاب / Search Students:
- **بالاسم الأول أو الأخير / By first or last name**
- **برقم الطالب / By student number**
- **بالبريد الإلكتروني / By email**
- **بالصف / By class**

#### البحث في المعلمين / Search Teachers:
- **بالاسم / By name**
- **بالتخصص / By specialization**
- **برقم الموظف / By employee number**

#### البحث في الدرجات / Search Grades:
- **باسم الطالب / By student name**
- **بالمادة / By subject**
- **بنوع الامتحان / By exam type**
- **بالتاريخ / By date**

### استخدام المرشحات / Using Filters

1. **اختر المرشح المطلوب / Select desired filter**
2. **أدخل القيمة أو اختر من القائمة / Enter value or select from list**
3. **اضغط "تطبيق" أو سيتم التطبيق تلقائياً / Click "Apply" or it applies automatically**
4. **لإزالة المرشح اختر "الكل" / To remove filter select "All"**

---

## 📱 الاستخدام على الأجهزة المحمولة
## Mobile Device Usage

### متطلبات المتصفح / Browser Requirements:
- **Chrome 80+ أو Safari 13+ أو Edge 80+**
- **JavaScript مفعل / JavaScript enabled**
- **Cookies مفعلة / Cookies enabled**

### نصائح للاستخدام المحمول / Mobile Usage Tips:
1. **استخدم الوضع الأفقي للجداول / Use landscape mode for tables**
2. **اضغط مرتين للتكبير / Double-tap to zoom**
3. **استخدم القوائم المنسدلة بدلاً من الكتابة / Use dropdowns instead of typing**

---

## 💾 النسخ الاحتياطي والاستعادة
## Backup and Restore

### إنشاء نسخة احتياطية / Create Backup

#### نسخة احتياطية يدوية / Manual Backup:
1. **اذهب إلى إعدادات النظام / Go to System Settings**
2. **اضغط "إنشاء نسخة احتياطية" / Click "Create Backup"**
3. **اختر مكان الحفظ / Choose save location**
4. **انتظر انتهاء العملية / Wait for completion**

#### نسخة احتياطية تلقائية / Automatic Backup:
1. **فعل النسخ التلقائي / Enable automatic backup**
2. **حدد التوقيت (يومي/أسبوعي) / Set timing (daily/weekly)**
3. **اختر مكان الحفظ / Choose save location**

### استعادة النسخة الاحتياطية / Restore Backup

1. **اذهب إلى إعدادات النظام / Go to System Settings**
2. **اضغط "استعادة نسخة احتياطية" / Click "Restore Backup"**
3. **اختر ملف النسخة الاحتياطية / Select backup file**
4. **أكد الاستعادة / Confirm restore**
5. **انتظر انتهاء العملية / Wait for completion**

---

## 🔐 الأمان وأفضل الممارسات
## Security and Best Practices

### كلمات المرور / Passwords

#### متطلبات كلمة المرور القوية / Strong Password Requirements:
- **8 أحرف على الأقل / At least 8 characters**
- **تحتوي على أحرف كبيرة وصغيرة / Contains upper and lowercase letters**
- **تحتوي على أرقام / Contains numbers**
- **تحتوي على رموز خاصة / Contains special characters**

#### نصائح الأمان / Security Tips:
1. **غير كلمة المرور كل 3 أشهر / Change password every 3 months**
2. **لا تشارك كلمة المرور مع أحد / Don't share password with anyone**
3. **استخدم كلمة مرور مختلفة لكل حساب / Use different password for each account**
4. **سجل خروج عند الانتهاء / Logout when finished**

### حماية البيانات / Data Protection

1. **اعمل نسخة احتياطية منتظمة / Regular backup**
2. **لا تحفظ كلمات المرور في المتصفح / Don't save passwords in browser**
3. **استخدم شبكة آمنة / Use secure network**
4. **حدث النظام بانتظام / Update system regularly**

---

## 📈 تحليل البيانات والتقارير
## Data Analysis and Reports

### أنواع التقارير المتاحة / Available Report Types

#### 1. تقارير الطلاب / Student Reports:
- **تقرير الدرجات الفردي / Individual Grade Report**
- **تقرير الحضور الفردي / Individual Attendance Report**
- **تقرير الأداء الشامل / Comprehensive Performance Report**

#### 2. تقارير الصفوف / Class Reports:
- **تقرير أداء الصف / Class Performance Report**
- **تقرير حضور الصف / Class Attendance Report**
- **مقارنة الصفوف / Class Comparison Report**

#### 3. تقارير المعلمين / Teacher Reports:
- **تقرير أداء المعلم / Teacher Performance Report**
- **تقرير الرواتب / Salary Report**
- **تقرير الأنشطة / Activities Report**

### تصدير التقارير / Export Reports

#### تنسيقات التصدير المتاحة / Available Export Formats:
- **PDF** - للطباعة والعرض / For printing and viewing
- **Excel** - للتحليل والتعديل / For analysis and editing
- **CSV** - للاستيراد في برامج أخرى / For import to other programs

#### خطوات التصدير / Export Steps:
1. **أنشئ التقرير المطلوب / Generate required report**
2. **اضغط "تصدير" / Click "Export"**
3. **اختر التنسيق المطلوب / Choose desired format**
4. **اختر مكان الحفظ / Choose save location**
5. **اضغط "حفظ" / Click "Save"**

---

## 🎨 تخصيص الواجهة
## Interface Customization

### تغيير اللغة / Change Language
1. **اذهب إلى الإعدادات / Go to Settings**
2. **اختر "اللغة" / Select "Language"**
3. **اختر العربية أو الإنجليزية / Choose Arabic or English**
4. **اضغط "حفظ" / Click "Save"**

### تخصيص لوحة التحكم / Customize Dashboard
1. **اضغط "تخصيص" في لوحة التحكم / Click "Customize" on dashboard**
2. **اختر الويدجت المطلوبة / Select desired widgets**
3. **رتب الويدجت بالسحب والإفلات / Arrange widgets by drag and drop**
4. **اضغط "حفظ التخصيص" / Click "Save Customization"**

---

## 📞 الدعم والمساعدة
## Support and Help

### الحصول على المساعدة / Getting Help

#### داخل النظام / Within System:
- **أيقونة "؟" في أعلى الصفحة / "?" icon at top of page**
- **دليل المساعدة المدمج / Built-in help guide**
- **نصائح الأدوات / Tool tips**

#### خارج النظام / Outside System:
- **دليل المستخدم (هذا الملف) / User manual (this file)**
- **دليل استكشاف الأخطاء / Troubleshooting guide**
- **فيديوهات تعليمية / Tutorial videos**

### التواصل مع الدعم الفني / Contact Technical Support

**قبل التواصل، جهز المعلومات التالية:**
**Before contacting, prepare the following information:**

1. **نوع المستخدم (مدير/معلم/طالب) / User type (admin/teacher/student)**
2. **وصف المشكلة بالتفصيل / Detailed problem description**
3. **الخطوات المتبعة قبل المشكلة / Steps taken before problem**
4. **لقطة شاشة للخطأ / Screenshot of error**
5. **متصفح مستخدم / Browser used**

---

## 🎓 التدريب والتطوير
## Training and Development

### برنامج التدريب للمستخدمين الجدد / Training Program for New Users

#### المستوى الأساسي (ساعتان) / Basic Level (2 hours):
- **مقدمة عن النظام / System introduction**
- **تسجيل الدخول والخروج / Login and logout**
- **التنقل في الواجهة / Interface navigation**
- **العمليات الأساسية / Basic operations**

#### المستوى المتوسط (4 ساعات) / Intermediate Level (4 hours):
- **إدارة البيانات / Data management**
- **إنشاء التقارير / Report generation**
- **استخدام المرشحات / Using filters**
- **تصدير البيانات / Data export**

#### المستوى المتقدم (6 ساعات) / Advanced Level (6 hours):
- **إعدادات النظام / System settings**
- **النسخ الاحتياطي / Backup procedures**
- **استكشاف الأخطاء / Troubleshooting**
- **التخصيص المتقدم / Advanced customization**

---

## 📋 قوائم المراجعة
## Checklists

### قائمة مراجعة يومية / Daily Checklist

**للمعلمين / For Teachers:**
- [ ] تسجيل حضور الطلاب / Mark student attendance
- [ ] مراجعة الجدول اليومي / Review daily schedule  
- [ ] إدخال الدرجات الجديدة / Enter new grades
- [ ] الرد على الرسائل / Reply to messages

**للإداريين / For Administrators:**
- [ ] مراجعة الإحصائيات اليومية / Review daily statistics
- [ ] متابعة التقارير الجديدة / Follow up on new reports
- [ ] مراجعة طلبات المستخدمين / Review user requests
- [ ] التحقق من النسخ الاحتياطية / Check backups

### قائمة مراجعة أسبوعية / Weekly Checklist

- [ ] إنشاء تقارير أسبوعية / Generate weekly reports
- [ ] مراجعة أداء النظام / Review system performance
- [ ] تحديث البيانات / Update data
- [ ] عمل نسخة احتياطية / Create backup
- [ ] مراجعة الأمان / Security review

### قائمة مراجعة شهرية / Monthly Checklist

- [ ] تحليل الإحصائيات الشهرية / Analyze monthly statistics
- [ ] مراجعة الرواتب / Review salaries
- [ ] تحديث كلمات المرور / Update passwords
- [ ] تنظيف البيانات القديمة / Clean old data
- [ ] تقييم أداء النظام / Evaluate system performance

---

## 🎯 نصائح لتحسين الإنتاجية
## Productivity Tips

### اختصارات لوحة المفاتيح / Keyboard Shortcuts
```
Ctrl + S = حفظ / Save
Ctrl + F = بحث / Search  
Ctrl + P = طباعة / Print
Ctrl + Z = تراجع / Undo
Ctrl + Y = إعادة / Redo
F5 = تحديث الصفحة / Refresh page
```

### نصائح للاستخدام السريع / Quick Usage Tips

1. **استخدم البحث السريع / Use quick search**
2. **احفظ المرشحات المستخدمة كثيراً / Save frequently used filters**
3. **استخدم القوالب للتقارير / Use templates for reports**
4. **فعل الإشعارات المهمة / Enable important notifications**
5. **نظم البيانات بانتظام / Organize data regularly**

---

## 🏆 أفضل الممارسات
## Best Practices

### لإدارة البيانات / For Data Management:
1. **أدخل البيانات فور توفرها / Enter data as soon as available**
2. **راجع البيانات قبل الحفظ / Review data before saving**
3. **استخدم أسماء واضحة ومفهومة / Use clear and understandable names**
4. **احتفظ بسجلات ورقية احتياطية / Keep backup paper records**

### لإدارة المستخدمين / For User Management:
1. **أنشئ حسابات منفصلة لكل مستخدم / Create separate accounts for each user**
2. **حدد الصلاحيات بدقة / Set permissions precisely**
3. **راجع الصلاحيات دورياً / Review permissions regularly**
4. **عطل الحسابات غير المستخدمة / Disable unused accounts**

### لإدارة النظام / For System Management:
1. **راقب أداء النظام يومياً / Monitor system performance daily**
2. **حدث النظام عند توفر تحديثات / Update system when updates available**
3. **اختبر النسخ الاحتياطية دورياً / Test backups regularly**
4. **درب المستخدمين الجدد / Train new users**

---

**🎉 نتمنى لك تجربة ممتعة ومفيدة مع نظام إدارة المدرسة!**
**🎉 We wish you an enjoyable and useful experience with the School Management System!**