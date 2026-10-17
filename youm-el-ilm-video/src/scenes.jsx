import React from 'react';
import {AbsoluteFill, useCurrentFrame, staticFile, Img, random} from 'remotion';
import {C, FONT, lin, ease, inout, useSp, Words, Title, Card, In, ShapeField, DotGrid, Check} from './lib';
import {Logo3D} from './logo3d';

const T = (s, st = {}) => ({fontFamily: FONT, color: C.w, ...st, ...s});

/* background per scene */
export const Base = ({kinds, seed, tone = 'deep', children, glow = [80, 20]}) => {
  const f = useCurrentFrame();
  const bgs = {
    deep: `radial-gradient(120% 70% at ${glow[0]}% ${glow[1]}%, #1B3CA8 0%, #0B1E5B 45%, #050C2A 100%)`,
    mid: `radial-gradient(110% 60% at 20% 30%, #2347C7 0%, #0D2270 50%, #060F33 100%)`,
    dusk: `linear-gradient(180deg, #08143F 0%, #13308F 58%, #1F44C2 74%, #0A1A55 75%, #071338 100%)`,
    alert: `repeating-linear-gradient(135deg, #FFC72C 0 70px, #FFB800 70px 140px)`,
  };
  const beam = (f * 3) % 2600 - 700;
  return (
    <AbsoluteFill style={{background: bgs[tone], overflow: 'hidden'}}>
      {tone !== 'alert' && <div style={{position: 'absolute', top: -400, left: beam, width: 260, height: 3000, transform: 'rotate(28deg)',
        background: 'linear-gradient(90deg, transparent, rgba(110,140,255,.16), transparent)'}} />}
      {tone !== 'alert' && <div style={{position: 'absolute', top: -400, left: beam - 900, width: 120, height: 3000, transform: 'rotate(28deg)',
        background: 'linear-gradient(90deg, transparent, rgba(255,199,44,.10), transparent)'}} />}
      <ShapeField kinds={kinds} seed={seed} opacity={tone === 'alert' ? 0.4 : 0.6} />
      {children}
    </AbsoluteFill>
  );
};

/* sea + sun horizon */
const Horizon = ({y = 1480, sun = 1, sunX = 540}) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', left: sunX - 190, top: y - 190 * sun, width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, #FFE08A 0%, #FFC72C 60%, rgba(255,199,44,0) 72%)'}} />
      <div style={{position: 'absolute', left: sunX - 500, top: y - 420, width: 1000, height: 700, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,199,44,.22), transparent)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: y, bottom: 0, background: 'linear-gradient(180deg, #1A3BAA, #081650)'}}>
        <svg width={1080} height={500} style={{position: 'absolute', top: 0}}>
          {[...Array(9)].map((_, i) => (
            <path key={i} d={`M-100 ${30 + i * 48} ${[...Array(14)].map((__, k) => `q 50 ${k % 2 ? 10 : -10} 100 0`).join(' ')}`}
              transform={`translate(${((f * (1 + i * 0.25)) % 200) - 200},0)`} fill="none" stroke="rgba(160,185,255,.22)" strokeWidth="2" />
          ))}
          {[...Array(7)].map((_, i) => (
            <rect key={'r' + i} x={sunX - 110 + Math.sin(f / 9 + i) * 18} y={22 + i * 34} width={220 - i * 22} height={6} rx={3} fill="rgba(255,220,130,.55)" />
          ))}
        </svg>
      </div>
    </>
  );
};

const Gauge = ({p, size = 250}) => {
  const r = size / 2 - 16, L = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={18} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.y} strokeWidth={18} strokeLinecap="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
};

/* graduation cap */
const Cap = ({size = 420, tassel = 0}) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160" style={{overflow: 'visible'}}>
    <path d="M48 78 L48 118 C48 134 152 134 152 118 L152 78 Z" fill="#0B1E5B" stroke={C.y} strokeWidth="3" />
    <path d="M100 30 L196 70 L100 110 L4 70 Z" fill="#132A7A" stroke={C.y} strokeWidth="4" strokeLinejoin="round" />
    <path d="M100 30 L196 70 L100 110 Z" fill="rgba(255,255,255,.06)" />
    <circle cx="100" cy="70" r="7" fill={C.y} />
    <g transform={`rotate(${tassel} 100 70)`}>
      <path d="M100 70 L160 92 L160 128" fill="none" stroke={C.y} strokeWidth="4" strokeLinecap="round" />
      <path d="M152 126 L168 126 L164 150 L156 150 Z" fill={C.y} />
    </g>
  </svg>
);

/* confetti burst */
const Confetti = ({start = 0, n = 70, cx = 540, cy = 900}) => {
  const f = useCurrentFrame();
  const t = (f - start) / 30;
  if (t < 0) return null;
  const cols = [C.y, C.y2, '#FFFFFF', C.blue, '#FF6F91'];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {[...Array(n)].map((_, i) => {
        const r = (k) => random(`cf-${i}-${k}`);
        const a = -Math.PI / 2 + (r('a') - 0.5) * 2.6;
        const v = 900 + r('v') * 900;
        const x = cx + Math.cos(a) * v * t + Math.sin(t * 6 + i) * 20;
        const y = cy + Math.sin(a) * v * t + 900 * t * t;
        const rot = t * 600 * (r('s') - 0.5);
        const o = Math.max(0, 1 - t / 2.6);
        const w = 14 + r('w') * 14;
        return <rect key={i} x={x} y={y} width={w} height={w * 0.5} rx={3} fill={cols[i % cols.length]} opacity={o}
          transform={`rotate(${rot} ${x} ${y}) scale(1 ${Math.cos(t * 9 + i)})`} />;
      })}
    </svg>
  );
};

/* ============ S1 INTRO ============ */
export const S1 = () => {
  const f = useCurrentFrame();
  const drop = useSp(30, {damping: 11, stiffness: 90});
  const tassel = Math.sin(f / 9) * 14 * Math.exp(-Math.max(0, f - 40) / 60);
  return (
    <Base kinds={['diamond', 'ring']} seed={11} tone="dusk">
      <Horizon y={1480} sun={lin(f, 0, 60, 0.2, 1)} />
      <div style={{position: 'absolute', top: 210, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Words text="يوم العلم" delay={6} variant="drop" size={170} style={{justifyContent: 'center'}} />
        <Words text="2026" delay={16} variant="zoom" size={150} color={C.y} style={{justifyContent: 'center'}} />
        <div style={{height: 10, width: 220 * lin(f, 30, 50), background: `linear-gradient(90deg, ${C.y}, ${C.y2})`, borderRadius: 10, margin: '14px 0 22px'}} />
        <Words text="تكريم أبناء البريديين الناجحين" delay={34} variant="mask" size={62} weight={700} color={C.mute} stagger={3} style={{justifyContent: 'center'}} />
      </div>
      <div style={{position: 'absolute', left: 540 - 230, top: 820 + (1 - drop) * -700 + Math.sin(f / 18) * 10,
        transform: `rotate(${(1 - drop) * -40 + Math.sin(f / 30) * 3}deg)`, filter: 'drop-shadow(0 30px 40px rgba(0,0,20,.5))'}}>
        <Cap size={460} tassel={tassel} />
      </div>
      {[0, 1, 2].map((i) => {
        const p = lin(f, 52 + i * 8, 100 + i * 8);
        return <div key={i} style={{position: 'absolute', left: 540 - 380 * p, top: 1010 - 380 * p, width: 760 * p, height: 760 * p,
          borderRadius: '50%', border: `3px solid ${C.y}`, opacity: (1 - p) * 0.7}} />;
      })}
    </Base>
  );
};

/* ============ S2 ابنك نجح؟ ============ */
export const S2 = () => {
  const f = useCurrentFrame();
  return (
    <Base kinds={['ring', 'arc']} seed={22} tone="mid">
      <Confetti start={30} cx={540} cy={1000} />
      <div style={{position: 'absolute', top: 470, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
        <Words text="ابنك أو ابنتك" delay={2} variant="slide" size={124} style={{justifyContent: 'center'}} />
        <Words text="نجح هذا العام؟" delay={14} variant="pop" size={140} color={C.y} style={{justifyContent: 'center'}} />
      </div>
      <In delay={48} from="up" style={{position: 'absolute', top: 960, left: 70, right: 70}}>
        <Card glow style={{padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 26}}>
          {[['في أحد الامتحانات الوطنية', 56], ['أو تحصّل على شهادة ختم الدروس', 80]].map(([t, d]) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 26}}>
              <Check p={lin(f, d, d + 14)} size={64} />
              <span style={T({fontSize: 46, fontWeight: 900, whiteSpace: 'nowrap'})}>{t}</span>
            </div>
          ))}
        </Card>
      </In>
      <In delay={110} from="scale" style={{position: 'absolute', top: 1400, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <span style={T({fontSize: 96, fontWeight: 900, color: C.y, textShadow: `0 0 40px rgba(255,199,44,.5)`})}>مبروك النجاح!</span>
      </In>
    </Base>
  );
};

/* ============ S3 البريد يكرّمهم ============ */
const Medal = ({size = 300, swing = 0}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 120 168" style={{overflow: 'visible'}}>
    <g transform={`rotate(${swing} 60 0)`}>
      <path d="M38 0 L56 70 L46 74 L22 0 Z" fill={C.blue} /><path d="M82 0 L64 70 L74 74 L98 0 Z" fill={C.royal} />
      <circle cx="60" cy="112" r="46" fill={C.y} stroke={C.y2} strokeWidth="6" />
      <circle cx="60" cy="112" r="32" fill="none" stroke="rgba(10,20,60,.35)" strokeWidth="3" />
      <path d="M60 90 L66 104 L81 105 L69 114 L73 129 L60 120 L47 129 L51 114 L39 105 L54 104 Z" fill={C.navy} />
    </g>
  </svg>
);
export const S3 = () => {
  const f = useCurrentFrame();
  const swing = Math.sin(f / 14) * 10 * Math.exp(-f / 120) + Math.sin(f / 30) * 2;
  const shine = lin(f, 40, 90, -0.6, 1.6);
  return (
    <Base kinds={['hex', 'plus']} seed={33} tone="deep" glow={[50, 40]}>
      <Title l1="البريد التونسي" l2="يكرّم أبناءه" delay={0} variant="rise" size={116} sub="بمناسبة الاحتفال بيوم العلم 2026" />
      <In delay={20} from="down" dist={300} style={{position: 'absolute', left: 540 - 150, top: 690}}>
        <div style={{position: 'relative'}}>
          <Medal size={300} swing={swing} />
          <div style={{position: 'absolute', left: 40, top: 230, width: 220, height: 220, borderRadius: '50%', overflow: 'hidden', pointerEvents: 'none'}}>
            <div style={{position: 'absolute', top: -60, left: `${shine * 100}%`, width: 50, height: 340, transform: 'rotate(25deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)'}} />
          </div>
        </div>
      </In>
      <In delay={70} from="up" style={{position: 'absolute', top: 1280, left: 70, right: 70}}>
        <Card style={{padding: '36px 44px', display: 'flex', alignItems: 'center', gap: 26}}>
          <svg width={86} height={86} viewBox="0 0 24 24" style={{flexShrink: 0}}><rect x="2" y="4" width="20" height="14" rx="2" fill="none" stroke={C.y} strokeWidth="1.6" />
            <path d="M8 21 H16 M12 18 V21" stroke={C.y} strokeWidth="1.6" strokeLinecap="round" /><path d="M7 11 L10.5 14 L17 8" fill="none" stroke={C.y} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div>
            <div style={T({fontSize: 56, fontWeight: 900})}>سجّلهم <span style={{color: C.y}}>عن بعد</span></div>
            <div style={T({fontSize: 40, fontWeight: 700, color: C.mute})}>دعوة لكافة الأعوان المعنيين</div>
          </div>
        </Card>
      </In>
    </Base>
  );
};

/* ============ S4 كيفية التسجيل ============ */
const URL_SHORT = 'postelearning.poste.tn/social/journee_savoir';
export const S4 = () => {
  const f = useCurrentFrame();
  const typed = URL_SHORT.slice(0, Math.floor(lin(f, 34, 74, 0, URL_SHORT.length, (k) => k)));
  const qr = useSp(110, {damping: 13, stiffness: 120});
  const scan = lin(f, 130, 175, 0, 1, inout);
  return (
    <Base kinds={['cube', 'hex']} seed={44} tone="mid">
      <Title l1="كيفية" l2="التسجيل" delay={0} variant="slide" sub="وجوبًا عبر المنظومة الإعلامية" />
      <In delay={18} from="flip" style={{position: 'absolute', top: 650, left: 60, right: 60}}>
        <Card style={{overflow: 'hidden'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '20px 26px', background: 'rgba(0,0,0,.25)', direction: 'ltr'}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 16, height: 16, borderRadius: 8, background: c, flexShrink: 0}} />)}
            <span style={{marginLeft: 12, flex: 1, padding: '8px 16px', borderRadius: 12, background: 'rgba(255,255,255,.08)', fontFamily: 'monospace', fontSize: 27, color: C.w, whiteSpace: 'nowrap', overflow: 'hidden'}}>
              {typed}{f < 80 && Math.floor(f / 8) % 2 ? '|' : ''}
            </span>
          </div>
          <div style={{padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: lin(f, 76, 90)}}>
            <div>
              <div style={T({fontSize: 50, fontWeight: 900})}>يوم العلم 2026</div>
              <div style={T({fontSize: 36, fontWeight: 700, color: C.mute})}>تسجيل أبناء البريديين الناجحين</div>
            </div>
            <div style={{padding: '18px 36px', borderRadius: 20, background: C.y}}><span style={T({fontSize: 42, fontWeight: 900, color: C.navy})}>تسجيل</span></div>
          </div>
        </Card>
      </In>
      <div style={{position: 'absolute', top: 1050, left: 120, right: 120, display: 'flex', alignItems: 'center', gap: 24, opacity: lin(f, 96, 108)}}>
        <div style={{flex: 1, height: 2, background: C.line}} /><span style={T({fontSize: 44, fontWeight: 700, color: C.mute})}>أو</span><div style={{flex: 1, height: 2, background: C.line}} />
      </div>
      <div style={{position: 'absolute', top: 1150, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44,
        transform: `scale(${qr})`, opacity: lin(f, 110, 118)}}>
        <div style={{position: 'relative', padding: 18, borderRadius: 28, background: '#fff', boxShadow: '0 0 60px rgba(255,199,44,.35)'}}>
          <Img src={staticFile('qr.png')} style={{width: 300, height: 300, display: 'block'}} />
          <div style={{position: 'absolute', left: 10, right: 10, top: 18 + 300 * scan, height: 6, borderRadius: 3, background: C.y, boxShadow: `0 0 20px ${C.y}`, opacity: scan < 1 ? 1 : 0}} />
        </div>
        <div>
          <div style={T({fontSize: 56, fontWeight: 900})}>امسح</div>
          <div style={T({fontSize: 56, fontWeight: 900, color: C.y})}>رمز الاستجابة</div>
          <div style={T({fontSize: 56, fontWeight: 900, color: C.y})}>السريعة</div>
        </div>
      </div>
    </Base>
  );
};

/* ============ S5 آجال التسجيل ============ */
const DateTile = ({day, month, label, hot}) => (
  <div style={{width: 380, borderRadius: 34, overflow: 'hidden', background: hot ? C.y : C.card, border: `2px solid ${hot ? C.y : C.line}`, boxShadow: '0 30px 70px rgba(0,0,20,.45)'}}>
    <div style={{padding: '14px 0', textAlign: 'center', background: hot ? C.navy : C.royal}}><span style={T({fontSize: 38, fontWeight: 700, color: hot ? C.y : C.w})}>{label}</span></div>
    <div style={{padding: '18px 0 26px', textAlign: 'center'}}>
      <div style={T({fontSize: 150, fontWeight: 900, lineHeight: 1.1, color: hot ? C.navy : C.y})}>{day}</div>
      <div style={T({fontSize: 52, fontWeight: 900, color: hot ? C.navy : C.w})}>{month}</div>
    </div>
  </div>
);
export const S5 = () => {
  const f = useCurrentFrame();
  const fill = lin(f, 60, 150, 0, 1, inout);
  return (
    <Base kinds={['ring', 'tri']} seed={55} tone="deep" glow={[50, 50]}>
      <Title l1="آجال" l2="التسجيل" delay={0} variant="mask" />
      <div style={{position: 'absolute', top: 640, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <In delay={16} from="right"><DateTile day="01" month="جويلية 2026" label="من يوم" /></In>
        <svg width={120} height={60} style={{opacity: lin(f, 40, 50), transform: 'scaleX(-1)'}}>
          <line x1={10} y1={30} x2={10 + 90 * lin(f, 40, 56)} y2={30} stroke={C.y} strokeWidth={8} strokeLinecap="round" />
          <path d="M84 12 L106 30 L84 48" fill="none" stroke={C.y} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={lin(f, 54, 58)} />
        </svg>
        <In delay={40} from="left"><DateTile day="31" month="جويلية 2026" label="إلى غاية" hot /></In>
      </div>
      <In delay={56} from="up" style={{position: 'absolute', top: 1160, left: 70, right: 70}}>
        <Card style={{padding: '36px 40px'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, direction: 'rtl', justifyContent: 'center'}}>
            {[...Array(31)].map((_, i) => {
              const on = i / 31 < fill;
              return <div key={i} style={{width: 92, height: 54, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: on ? (i === 30 ? C.y : 'rgba(255,199,44,.22)') : 'rgba(255,255,255,.06)', border: `2px solid ${on ? C.y : 'transparent'}`}}>
                <span style={T({fontSize: 30, fontWeight: 700, color: i === 30 && on ? C.navy : C.w})}>{i + 1}</span>
              </div>;
            })}
          </div>
          <div style={T({fontSize: 44, fontWeight: 700, color: C.mute, textAlign: 'center', marginTop: 22})}>التسجيل مفتوح طيلة شهر جويلية</div>
        </Card>
      </In>
    </Base>
  );
};

/* ============ S6 الوثائق ============ */
export const S6 = () => {
  const f = useCurrentFrame();
  const docs = [['نسخة من بطاقة تعريف العون'], ['نسخة من بطاقة تعريف الابن(ة) الناجح(ة)', 'أو مضمون ولادة إذا كان دون سنّ الرشد'],
    ['شهادة التخرّج أو شهادة النجاح'], ['بطاقة الأعداد']];
  const D = docs.map((_, i) => 50 + i * 40);
  const done = docs.filter((_, i) => f > D[i] + 10).length;
  const pct = lin(f, 40, D[3] + 14, 0, 1, inout);
  return (
    <Base kinds={['arc', 'hex']} seed={66} tone="mid">
      <Title l1="الوثائق" l2="المطلوبة" delay={0} variant="pop" sub="تُحمَّل عند التسجيل" />
      <In delay={16} from="scale" style={{position: 'absolute', top: 680, left: 60, right: 60}}>
        <Card style={{padding: '40px 46px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 36, paddingBottom: 26, borderBottom: `2px solid ${C.line}`, marginBottom: 10}}>
            <div style={{position: 'relative', width: 190, height: 190}}>
              <Gauge p={pct} size={190} />
              <div style={T({position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, fontWeight: 900, direction: 'ltr'})}>{Math.round(pct * 100)}%</div>
            </div>
            <div>
              <div style={T({fontSize: 50, fontWeight: 900})}>ملفّ التسجيل</div>
              <div style={T({fontSize: 42, fontWeight: 700, color: C.mute})}>{done} / 4 وثائق</div>
            </div>
          </div>
          {docs.map(([a, b], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '24px 0', borderBottom: i < 3 ? `1px solid ${C.line}` : 'none',
              opacity: lin(f, D[i] - 20, D[i] - 6), transform: `translateX(${(1 - lin(f, D[i] - 20, D[i])) * -60}px)`}}>
              <svg width={56} height={66} viewBox="0 0 40 48" style={{flexShrink: 0}}><path d="M4 2 H26 L36 12 V46 H4 Z" fill={f > D[i] + 10 ? C.y : C.blue} /><path d="M26 2 V12 H36" fill="rgba(0,0,0,.2)" /></svg>
              <div style={{flex: 1}}>
                <div style={T({fontSize: 48, fontWeight: 700})}>{a}</div>
                {b && <div style={T({fontSize: 36, fontWeight: 700, color: C.y})}>{b}</div>}
              </div>
              <Check p={lin(f, D[i], D[i] + 12)} size={58} />
            </div>
          ))}
        </Card>
      </In>
    </Base>
  );
};

/* ============ S7 البكالوريا ============ */
const Bouquet = ({size = 300, sway = 0}) => {
  const flower = (x, y, r, c, rot) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {[...Array(6)].map((_, i) => <ellipse key={i} cx={0} cy={-r * 0.62} rx={r * 0.42} ry={r * 0.62} fill={c} transform={`rotate(${i * 60})`} />)}
      <circle r={r * 0.36} fill={C.y} />
    </g>
  );
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={{overflow: 'visible'}}>
      <g transform={`rotate(${sway} 100 230)`}>
        {[[70, 40], [100, 30], [130, 44], [85, 60], [115, 62]].map(([x, y], i) => <path key={i} d={`M${x} ${y + 20} Q 100 140 100 200`} stroke="#3FAE6A" strokeWidth="5" fill="none" />)}
        {flower(70, 50, 28, '#FF6F91', 10)}{flower(130, 54, 26, '#FFFFFF', -8)}{flower(100, 30, 32, '#FF8FA8', 0)}
        {flower(85, 78, 22, '#FFFFFF', 20)}{flower(117, 80, 22, '#FF6F91', -15)}
        <path d="M60 130 L140 130 L118 228 L82 228 Z" fill={C.royal} stroke={C.y} strokeWidth="4" strokeLinejoin="round" />
        <path d="M78 150 Q100 165 122 150" stroke={C.y} strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};
export const S7 = () => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 22) * 4;
  return (
    <Base kinds={['diamond', 'plus']} seed={77} tone="deep" glow={[25, 25]}>
      <Title l1="الناجحون في" l2="البكالوريا" delay={0} variant="zoom" sub="الدورة الرئيسية" />
      <In delay={14} from="scale" style={{position: 'absolute', left: 70, top: 290}}>
        <Bouquet size={220} sway={sway} />
      </In>
      <In delay={30} from="up" style={{position: 'absolute', top: 640, left: 60, right: 60}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '24px 34px', borderRadius: 28, background: 'rgba(255,199,44,.12)', borderRight: `10px solid ${C.y}`}}>
          <span style={T({fontSize: 30, fontWeight: 900, color: C.navy, background: C.y, padding: '6px 18px', borderRadius: 12, whiteSpace: 'nowrap'})}>بصفة استثنائية</span>
          <span style={T({fontSize: 42, fontWeight: 700, lineHeight: 1.4})}>تهنئة مبكرة بإهدائهم <b style={{color: C.y}}>باقات زهور البريد</b></span>
        </div>
      </In>
      {[
        ['المرحلة الأولى', 'تسجيل الابن(ة) وتحميل بطاقة بيان الأعداد المستخرجة من موقع', 'edunet.tn', 'خلال 4 أيام من تاريخ فتح المنظومة', 70, 860],
        ['المرحلة الثانية', 'استكمال التسجيل بتحميل الوثائق المطلوبة', null, null, 130, 1290],
      ].map(([h, body, site, due, d, top], i) => (
        <In key={h} delay={d} from={i ? 'left' : 'right'} dist={160} style={{position: 'absolute', top, left: 60, right: 60}}>
          <Card glow={i === 0} style={{padding: '34px 40px', display: 'flex', gap: 30}}>
            <div style={{width: 96, height: 96, borderRadius: 48, background: C.y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <span style={T({fontSize: 56, fontWeight: 900, color: C.navy})}>{i + 1}</span>
            </div>
            <div style={{flex: 1}}>
              <div style={T({fontSize: 52, fontWeight: 900, color: C.y})}>{h}</div>
              <div style={T({fontSize: 42, fontWeight: 700, lineHeight: 1.45})}>
                {body} {site && <span style={{direction: 'ltr', unicodeBidi: 'isolate', color: C.y, fontWeight: 900}}>{site}</span>}
              </div>
              {due && <div style={{marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 24px', borderRadius: 16, background: 'rgba(229,55,47,.18)', border: `2px solid ${C.red}`}}>
                <svg width={36} height={36} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#FF8A80" strokeWidth="2.4" /><path d="M12 7 V12 L15.5 14" fill="none" stroke="#FF8A80" strokeWidth="2.4" strokeLinecap="round" /></svg>
                <span style={T({fontSize: 36, fontWeight: 900, color: '#FFD2CE'})}>{due}</span>
              </div>}
            </div>
          </Card>
        </In>
      ))}
    </Base>
  );
};

/* ============ S8 هام ============ */
export const S8 = () => {
  const f = useCurrentFrame();
  const shake = f > 34 && f < 54 ? Math.sin(f * 2.2) * 14 * (1 - (f - 34) / 20) : 0;
  return (
    <Base kinds={['tri', 'plus']} seed={88} tone="alert">
      <div style={{position: 'absolute', top: 220, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `rotate(${shake * 0.3}deg) translateX(${shake}px)`}}>
        <In delay={0} from="scale">
          <svg width={240} height={220} viewBox="0 0 60 55"><path d="M30 3 L57 52 H3 Z" fill={C.navy} stroke={C.navy} strokeWidth="3" strokeLinejoin="round" />
            <rect x="27.5" y="18" width="5" height="19" rx="2.5" fill={C.y} /><circle cx="30" cy="44" r="3.2" fill={C.y} /></svg>
        </In>
      </div>
      <In delay={12} from="down" style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <span style={T({fontSize: 60, fontWeight: 900, color: '#fff', background: C.red, padding: '6px 44px', borderRadius: 18})}>هام!</span>
      </In>
      <div style={{position: 'absolute', top: 640, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Words text="التسجيل وجوبًا" delay={22} variant="slide" size={124} color={C.navy} style={{justifyContent: 'center'}} />
        <Words text="عن بعد" delay={34} variant="slide" size={124} color={C.navy} style={{justifyContent: 'center'}} />
        <Words text="واحترم الإجراءات والآجال" delay={48} variant="mask" size={70} color={C.navy} style={{justifyContent: 'center', marginTop: 16}} />
      </div>
      <In delay={90} from="up" style={{position: 'absolute', top: 1260, left: 70, right: 70}}>
        <div style={{background: C.navy, borderRadius: 36, padding: '40px 46px', boxShadow: '0 30px 60px rgba(0,0,0,.35)', display: 'flex', gap: 26, alignItems: 'center'}}>
          <svg width={74} height={74} viewBox="0 0 24 24" style={{flexShrink: 0}}><path d="M3 11 L17 5 V19 L3 13 Z" fill={C.y} /><rect x="17" y="8" width="4" height="8" rx="1.5" fill={C.y} /><path d="M6 13.5 L8 19 H11 L9.5 14.5" fill={C.y} /></svg>
          <span style={T({fontSize: 46, fontWeight: 700, lineHeight: 1.5})}>المسؤولون مدعوّون إلى إعلام منظوريهم بفحوى هذه المذكّرة</span>
        </div>
      </In>
    </Base>
  );
};

/* ============ S9 باختصار ============ */
export const S9 = () => {
  const f = useCurrentFrame();
  const items = ['ادخل إلى المنظومة', 'سجّل ابنك أو ابنتك', 'حمّل الوثائق المطلوبة', 'قبل 31 جويلية 2026'];
  const D = items.map((_, i) => 24 + i * 30);
  return (
    <Base kinds={['diamond', 'cube']} seed={99} tone="mid">
      <Title l1="باختصار:" delay={0} variant="drop" align="center" />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={`M540 560 L540 ${560 + 960 * lin(f, 20, 140, 0, 1, inout)}`} stroke={C.y} strokeWidth={5} strokeDasharray="6 14" strokeLinecap="round" opacity={0.6} />
      </svg>
      {items.map((t, i) => {
        const last = i === 3;
        const s = useSp(D[i], {damping: 11, stiffness: 150});
        return (
          <div key={i} style={{position: 'absolute', top: 580 + i * 250, left: 100, right: 100, transform: `scale(${s}) translateY(${(1 - s) * 40}px)`, opacity: lin(f, D[i], D[i] + 8)}}>
            <div style={{height: 190, borderRadius: 999, background: last ? C.y : C.card, border: `2px solid ${last ? C.y : C.line}`, display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px',
              boxShadow: last ? `0 0 ${40 + Math.sin(f / 6) * 20}px rgba(255,199,44,.6)` : '0 20px 50px rgba(0,0,20,.4)'}}>
              <div style={{width: 116, height: 116, borderRadius: 58, background: last ? C.navy : C.y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <span style={T({fontSize: 64, fontWeight: 900, color: last ? C.y : C.navy})}>{i + 1}</span>
              </div>
              <span style={T({fontSize: 60, fontWeight: 900, color: last ? C.navy : C.w})}>{t}</span>
            </div>
          </div>
        );
      })}
    </Base>
  );
};

/* ============ S10 OUTRO ============ */
export const S10 = () => {
  const f = useCurrentFrame();
  const s = useSp(16, {damping: 12, stiffness: 70});
  const spin = useSp(16, {damping: 18, stiffness: 40});
  return (
    <Base kinds={['diamond', 'ring']} seed={111} tone="dusk">
      <Horizon y={1680} sun={lin(f, 0, 80, 0.3, 1)} />
      <Confetti start={10} n={50} cx={540} cy={600} />
      <div style={{position: 'absolute', top: 130, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Words text="مبروك لأبنائنا" delay={4} variant="drop" size={116} style={{justifyContent: 'center'}} />
        <Words text="الناجحين" delay={12} variant="drop" size={116} color={C.y} style={{justifyContent: 'center'}} />
      </div>
      <div style={{position: 'absolute', left: 540 - 150, top: 470 + Math.sin(f / 20) * 10, width: 300, height: 300, perspective: 1600,
        transform: `scale(${s}) translateY(${(1 - s) * 300}px)`}}>
        <Logo3D size={300} depth={36} ry={(1 - spin) * -540 + Math.sin(f / 40) * 28} rx={-8 + Math.sin(f / 33) * 5} />
      </div>
      <In delay={50} from="up" style={{position: 'absolute', top: 880, left: 60, right: 60}}>
        <Card glow style={{padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={{padding: 12, borderRadius: 20, background: '#fff', flexShrink: 0}}><Img src={staticFile('qr.png')} style={{width: 220, height: 220, display: 'block'}} /></div>
          <div style={{minWidth: 0}}>
            <div style={T({fontSize: 50, fontWeight: 900})}>سجّل الآن</div>
            <div style={T({fontSize: 38, fontWeight: 700, color: C.mute, marginBottom: 12})}>من 01 إلى 31 جويلية 2026</div>
            <div style={{direction: 'ltr', fontFamily: 'monospace', fontSize: 28, color: C.y, lineHeight: 1.4, textAlign: 'right'}}>postelearning.poste.tn<br />/social/journee_savoir</div>
          </div>
        </Card>
      </In>
      <In delay={80} from="up" style={{position: 'absolute', top: 1260, left: 40, right: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '30px 20px', borderRadius: 36, background: 'rgba(5,12,42,.82)', border: '2px solid rgba(130,160,255,.25)'}}>
        <span style={T({fontSize: 42, fontWeight: 700, color: C.mute})}>للاستفسار: <b style={{color: C.w, fontWeight: 900}}>المكلّف بالملف</b></span>
        <div style={{display: 'flex', gap: 30}}>
          {['93 667 475', '95 542 040'].map((n, i) => (
            <In key={n} delay={92 + i * 10} from="scale">
              <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '20px 34px', borderRadius: 24, background: C.card, border: `2px solid ${C.y}`}}>
                <svg width={42} height={42} viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.6 3.6a1 1 0 01-.25 1z" fill={C.y} /></svg>
                <span style={{fontFamily: FONT, fontSize: 56, fontWeight: 900, color: C.w, direction: 'ltr'}}>{n}</span>
              </div>
            </In>
          ))}
        </div>
      </In>
    </Base>
  );
};
