# فيديو يوم العلم 2026 (Remotion)

فيديو عمودي 1080×1920، مدته 77 ثانية، 30 إطاراً في الثانية، مبني على المذكرة المشتركة عدد 25
(فتح باب تسجيل أبناء البريديين الناجحين بمناسبة يوم العلم 2026).

## التشغيل
    npm install
    npm start          # المعاينة في المتصفح
    npm run render     # التصدير إلى out/youm-el-ilm-2026.mp4

## الملفات
- src/scenes.jsx : المشاهد (S1 ... S10 + SPrize جوائز 2026) ونصوصها
- src/Main.jsx   : التوقيت (cuts)، الانتقالات (trans)، المؤثرات الصوتية (sfx)، الموسيقى
- src/lib.jsx, src/finish.jsx, src/logo3d.jsx : نفس مكوّنات فيديو مصيف العائلات
- public/qr.png  : رمز الاستجابة السريعة للرابط https://www.postelearning.poste.tn/social/journee_savoir
- public/music.wav : موسيقى خلفية مولّدة بـ `python3 scripts/make_music.py 77`
- public/sfx/    : مؤثرات الانتقال، مولّدة بـ `python3 scripts/make_sfx.py`
