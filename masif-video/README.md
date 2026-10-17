# فيديو مصيف العائلات (Remotion)

فيديو عمودي 1080×1920، مدّته دقيقتان، 30 إطاراً في الثانية.

## التشغيل
1. ثبّت Node.js 18 أو أحدث.
2. افتح هذا المجلد في الطرفية (أو في Claude Code) واكتب:
   npm install
3. للمعاينة والتعديل في المتصفح:
   npm start
4. لتصدير الفيديو (يُحفظ في out/masif-al-aailat.mp4):
   npm run render

## الملفات
- src/index.jsx : تسجيل الفيديو (المقاس والمدة)
- src/Main.jsx  : ترتيب المشاهد، توقيت كل قطع (cuts)، الانتقالات، الشعار، شريط التقدّم، الصوت والخطوط
- src/scenes.jsx: المشاهد الـ16 (S1 ... S16) ونصوصها
- src/lib.jsx   : الألوان، حركات الكتابة، البطاقات، الأشكال في الخلفية
- public/       : الشعار logo.png، الصوت audio.m4a، الخط Tajawal

## تعديلات سريعة
- تغيير نص: ابحث عنه في src/scenes.jsx وغيّره.
- تغيير الألوان: الكائن C في أعلى src/lib.jsx.
- تغيير توقيت المشاهد: المصفوفة cuts في src/Main.jsx (بالإطارات، 30 = ثانية واحدة).
- تغيير نوع الانتقال: المصفوفة trans في src/Main.jsx
  (circle, circle2, diag, diag2, blinds, blindsV, diamond, zoom, split, flip, slideUp).
