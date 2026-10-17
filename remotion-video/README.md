# فيديو مصيف العائلة

فيديو Remotion بدقة 1920×1080 (30 إطاراً/ثانية): مقدمة على غروب الشمس، ثم بطاقات ذكريات
على شكل صور بولارويد بحركة Ken Burns وانتقالات متنوعة، ثم خاتمة.

## إضافة صوركم

1. ضعوا الصور في `public/photos/` (مثلاً `beach1.jpg`).
2. عدّلوا `memories` في `src/summer/schema.ts` (أو من لوحة الخصائص في Remotion Studio):
   ```ts
   { caption: "أول لقاء مع البحر", photo: "beach1.jpg", scene: "beach" }
   ```
   إذا تُرك `photo` فارغاً يظهر مشهد مرسوم (`beach`، `sand`، `pool`، `sunset`، `night`).
   ويتغير طول الفيديو تلقائياً حسب عدد الذكريات.
3. للموسيقى: ضعوا الملف في `public/` واكتبوا اسمه في `music` (مثلاً `"music.mp3"`).

## الأوامر

```bash
npm i
npm run dev                                         # المعاينة في Remotion Studio
npx remotion render FamilySummer out/family-summer.mp4
```
