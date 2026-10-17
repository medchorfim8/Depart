# فيديو يوم العلم (Remotion)

فيديو عمودي 1080×1920، مدته 77 ثانية، 30 إطاراً في الثانية، مبني على المذكرة المشتركة عدد 25
(فتح باب تسجيل أبناء البريديين الناجحين بمناسبة يوم العلم).
لا يذكر الفيديو السنة، فيصلح للأعوام القادمة؛ راجع التواريخ (01–31 جويلية) والجوائز والرابط كل سنة في src/scenes.jsx.

## التشغيل
    npm install
    npm start          # المعاينة في المتصفح
    npm run render     # التصدير إلى out/youm-el-ilm.mp4

## الملفات
- src/scenes.jsx : المشاهد (S1 ... S10 + SPrize الجوائز) ونصوصها
- src/Main.jsx   : التوقيت (cuts)، الانتقالات (trans)، المؤثرات الصوتية (sfx)، الموسيقى
- src/lib.jsx, src/finish.jsx, src/logo3d.jsx : نفس مكوّنات فيديو مصيف العائلات
- public/qr.png  : رمز الاستجابة السريعة للرابط https://www.postelearning.poste.tn/social/journee_savoir
- public/music.wav : موسيقى خلفية مولّدة بـ `python3 scripts/make_music.py 77`
- public/sfx/    : مؤثرات الانتقال، مولّدة بـ `python3 scripts/make_sfx.py`

## التعليق الصوتي (على الهاتف أو أي جهاز فيه إنترنت)
    apt install -y python3-venv
    python3 -m venv ~/tts && ~/tts/bin/pip install edge-tts mutagen
    ~/tts/bin/python scripts/make_voice.py            # صوت رجالي إماراتي ar-AE-HamdanNeural
النصوص في scripts/voice_lines.json. السكربت يولّد public/voice/01.mp3 ... 11.mp3 ويكتب src/voice.json،
والفيديو يشغّل كل جملة في مشهدها ويخفض الموسيقى أثناء الكلام.
