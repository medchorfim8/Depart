import React from 'react';
import {AbsoluteFill, useCurrentFrame, staticFile, Img, random, interpolate} from 'remotion';
import {C, FONT, lin, inout, useSp, Words, Title, Card, In, ShapeField, Check} from './lib';
import {Logo3D} from './logo3d';
import {Stage3D, Coin, Confetti3D, CapToss, useEntry} from './three';
import {GlowBG, LightRing, Reveal, GlowBox, GlowEmblem, Certificate} from './glow';

const T = (s, st = {}) => ({fontFamily: FONT, color: C.ink, ...st, ...s});
const CELEBRATE = ['star', 'cap', 'book', 'spark', 'star'];

/* bright celebration backgrounds: soft sky or warm sunlight, slow rays and floating symbols */
export const Base = ({seed, tone = 'sky', rays = true, center = [540, 900], children}) => {
  const f = useCurrentFrame();
  const bgs = {
    sky: 'radial-gradient(120% 75% at 50% 30%, #FFFFFF 0%, #EEF3FF 42%, #C9D9FF 100%)',
    sun: 'radial-gradient(115% 70% at 50% 32%, #FFFFFF 0%, #FFF7DE 42%, #FFDE94 100%)',
    alert: 'repeating-linear-gradient(135deg, #FFC72C 0 70px, #FFB800 70px 140px)',
  };
  return (
    <AbsoluteFill style={{background: bgs[tone], overflow: 'hidden'}}>
      {rays && tone !== 'alert' && (
        <div style={{position: 'absolute', left: center[0] - 1500, top: center[1] - 1500, width: 3000, height: 3000, transform: `rotate(${f * 0.12}deg)`,
          background: `repeating-conic-gradient(from 0deg, ${tone === 'sun' ? 'rgba(255,190,60,.16)' : 'rgba(110,140,255,.12)'} 0deg 6deg, rgba(255,255,255,0) 6deg 15deg)`,
          WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,.5) 35%, transparent 62%)', maskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,.5) 35%, transparent 62%)'}} />
      )}
      <ShapeField kinds={CELEBRATE} seed={seed} n={12} opacity={tone === 'alert' ? 0.35 : 0.45} />
      {children}
    </AbsoluteFill>
  );
};

/* fireworks: bursts of sparks with gravity */
const Fireworks = ({bursts}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible'}}>
      {bursts.map(({at, x, y, color, r = 230}, b) => {
        const t = (f - at) / 30;
        if (t < 0 || t > 1.6) return null;
        const p = 1 - Math.pow(1 - Math.min(1, t / 0.7), 3);
        const o = Math.max(0, 1 - Math.max(0, t - 0.6) / 1);
        return (
          <g key={b} opacity={o}>
            {t < 0.25 && <circle cx={x} cy={y} r={60 * (1 - t / 0.25)} fill={color} opacity={0.5} />}
            {[...Array(26)].map((_, i) => {
              const a = (i / 26) * Math.PI * 2 + b;
              const rr = r * p * (0.75 + random(`fw${b}-${i}`) * 0.35);
              const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr + 120 * t * t;
              return <g key={i}>
                <line x1={x + Math.cos(a) * rr * 0.72} y1={y + Math.sin(a) * rr * 0.72 + 120 * t * t} x2={px} y2={py} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
                <circle cx={px} cy={py} r={5} fill={color} />
              </g>;
            })}
          </g>
        );
      })}
    </svg>
  );
};

export const Laurel = ({size = 640, p = 1, color = C.y}) => {
  const leaves = 11;
  const branch = (dir) => [...Array(leaves)].map((_, i) => {
    const t = i / (leaves - 1);
    if (t > p) return null;
    const a = Math.PI * (0.62 + t * 0.78);
    const r = size * 0.42;
    const x = size / 2 + dir * Math.cos(a) * r, y = size / 2 + Math.sin(a) * r;
    const rot = (dir > 0 ? 180 - (a * 180) / Math.PI : (a * 180) / Math.PI) + dir * 35;
    return <ellipse key={`${dir}-${i}`} cx={x} cy={y} rx={size * 0.055} ry={size * 0.022} fill={color} transform={`rotate(${rot} ${x} ${y})`} opacity={0.95} />;
  });
  return (
    <svg width={size} height={size} style={{overflow: 'visible'}}>
      <path d={`M${size / 2} ${size * 0.92} A${size * 0.42} ${size * 0.42} 0 0 1 ${size * 0.13} ${size * 0.3}`} fill="none" stroke={color} strokeWidth={4} strokeDasharray={size * 1.4} strokeDashoffset={size * 1.4 * (1 - p)} />
      <path d={`M${size / 2} ${size * 0.92} A${size * 0.42} ${size * 0.42} 0 0 0 ${size * 0.87} ${size * 0.3}`} fill="none" stroke={color} strokeWidth={4} strokeDasharray={size * 1.4} strokeDashoffset={size * 1.4 * (1 - p)} />
      {branch(1)}{branch(-1)}
    </svg>
  );
};

const Gauge = ({p, size = 250}) => {
  const r = size / 2 - 16, L = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(31,68,194,.1)" strokeWidth={18} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.y} strokeWidth={18} strokeLinecap="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - p)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
};

/* ============ S1 INTRO: glowing light ring, emblem, typed prompt ============ */
export const S1 = () => {
  const f = useCurrentFrame();
  const ring = lin(f, 0, 40, 0, 1, inout);
  const em = useEntry(8, {damping: 12, stiffness: 80});
  return (
    <GlowBG>
      <LightRing cx={540} cy={560} size={640} p={ring} />
      <div style={{position: 'absolute', left: 540 - 140, top: 560 - 140}}><GlowEmblem size={280} p={em} /></div>
      <div style={{position: 'absolute', top: 930, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Reveal start={22} dur={26}>
          <div style={{fontFamily: FONT, fontSize: 170, fontWeight: 900, color: '#fff', lineHeight: 1.15, textShadow: '0 0 40px rgba(255,199,44,.55)'}}>يوم العِلم</div>
        </Reveal>
        <div style={{height: 8, width: 260 * lin(f, 40, 60), background: `linear-gradient(90deg, rgba(255,199,44,0), ${C.y}, rgba(255,199,44,0))`, borderRadius: 8, margin: '6px 0 40px', boxShadow: '0 0 20px #FFC72C'}} />
      </div>
      <div style={{position: 'absolute', top: 1260, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <GlowBox text="تكريم أبناء البريديين الناجحين" start={52} cps={1.6} width={920} />
      </div>
    </GlowBG>
  );
};

/* ============ S2 ابنك نجح؟ ============ */
export const S2 = () => {
  const f = useCurrentFrame();
  return (
    <Base seed={22} tone="sky" center={[540, 700]}>
      <Stage3D>
        <CapToss start={28} n={6} />
        <Confetti3D start={34} n={60} burst />
      </Stage3D>
      <div style={{position: 'absolute', top: 430, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
        <Words text="ابنك أو ابنتك" delay={2} variant="slide" size={124} style={{justifyContent: 'center'}} />
        <Words text="نجح هذا العام؟" delay={14} variant="pop" size={140} color={C.royal} style={{justifyContent: 'center'}} />
      </div>
      <In delay={48} from="up" style={{position: 'absolute', top: 950, left: 70, right: 70}}>
        <Card glow style={{padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 26}}>
          {[['في أحد الامتحانات الوطنية', 56], ['أو تحصّل على شهادة ختم الدروس', 80]].map(([t, d]) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 26}}>
              <Check p={lin(f, d, d + 14)} size={64} />
              <span style={T({fontSize: 46, fontWeight: 900, whiteSpace: 'nowrap'})}>{t}</span>
            </div>
          ))}
        </Card>
      </In>
      <In delay={100} from="scale" style={{position: 'absolute', top: 1400, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <span style={T({fontSize: 104, fontWeight: 900, color: C.gold, textShadow: '0 6px 0 rgba(255,199,44,.35), 0 18px 40px rgba(201,138,0,.35)'})}>مبروك النجاح!</span>
      </In>
    </Base>
  );
};

/* ============ S3 البريد يكرّمهم: the certificate ============ */
export const S3 = () => {
  return (
    <Base seed={33} tone="sun" center={[540, 1000]}>
      <Title l1="البريد التونسي" l2="يكرّم أبناءه" delay={0} variant="rise" size={116} sub="بمناسبة الاحتفال بيوم العِلم" />
      <Stage3D><Confetti3D start={30} n={50} /></Stage3D>
      <div style={{position: 'absolute', top: 700, left: 80}}><Certificate start={10} width={920} /></div>
      <In delay={70} from="up" style={{position: 'absolute', top: 1430, left: 70, right: 70}}>
        <Card style={{padding: '36px 44px', display: 'flex', alignItems: 'center', gap: 26}}>
          <svg width={86} height={86} viewBox="0 0 24 24" style={{flexShrink: 0}}><rect x="2" y="4" width="20" height="14" rx="2" fill="none" stroke={C.royal} strokeWidth="1.6" />
            <path d="M8 21 H16 M12 18 V21" stroke={C.royal} strokeWidth="1.6" strokeLinecap="round" /><path d="M7 11 L10.5 14 L17 8" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div>
            <div style={T({fontSize: 56, fontWeight: 900})}>سجّلهم <span style={{color: C.royal}}>عن بعد</span></div>
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
  const tap = lin(f, 92, 100) * (1 - lin(f, 100, 112));
  return (
    <Base seed={44} tone="sky" center={[540, 1300]}>
      <Title l1="كيفية" l2="التسجيل" delay={0} variant="slide" sub="وجوبًا عبر المنظومة الإعلامية" />
      <In delay={18} from="flip" style={{position: 'absolute', top: 650, left: 60, right: 60}}>
        <Card style={{overflow: 'hidden'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '20px 26px', background: 'rgba(31,68,194,.07)', direction: 'ltr'}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 16, height: 16, borderRadius: 8, background: c, flexShrink: 0}} />)}
            <span style={{marginLeft: 12, flex: 1, padding: '8px 16px', borderRadius: 12, background: '#fff', border: `2px solid ${C.line}`, fontFamily: 'monospace', fontSize: 27, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden'}}>
              {typed}{f < 80 && Math.floor(f / 8) % 2 ? '|' : ''}
            </span>
          </div>
          <div style={{padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: lin(f, 76, 90)}}>
            <div>
              <div style={T({fontSize: 50, fontWeight: 900})}>يوم العلم</div>
              <div style={T({fontSize: 36, fontWeight: 700, color: C.mute})}>تسجيل أبناء البريديين الناجحين</div>
            </div>
            <div style={{padding: '18px 36px', borderRadius: 20, background: `linear-gradient(135deg, ${C.y}, ${C.y2})`, transform: `scale(${1 - tap * 0.08})`, boxShadow: `0 ${12 - tap * 8}px 24px rgba(201,138,0,.35)`}}>
              <span style={T({fontSize: 42, fontWeight: 900, color: C.navy})}>تسجيل</span>
            </div>
          </div>
        </Card>
      </In>
      <div style={{position: 'absolute', top: 1050, left: 120, right: 120, display: 'flex', alignItems: 'center', gap: 24, opacity: lin(f, 96, 108)}}>
        <div style={{flex: 1, height: 2, background: C.line}} /><span style={T({fontSize: 44, fontWeight: 700, color: C.mute})}>أو</span><div style={{flex: 1, height: 2, background: C.line}} />
      </div>
      <div style={{position: 'absolute', top: 1150, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44,
        transform: `scale(${qr})`, opacity: lin(f, 110, 118)}}>
        <div style={{position: 'relative', padding: 18, borderRadius: 28, background: '#fff', boxShadow: '0 0 0 6px rgba(255,199,44,.4), 0 24px 60px rgba(31,68,194,.2)'}}>
          <Img src={staticFile('qr.png')} style={{width: 300, height: 300, display: 'block'}} />
          <div style={{position: 'absolute', left: 10, right: 10, top: 18 + 300 * scan, height: 6, borderRadius: 3, background: C.y, boxShadow: `0 0 20px ${C.y}`, opacity: scan < 1 ? 1 : 0}} />
        </div>
        <div>
          <div style={T({fontSize: 56, fontWeight: 900})}>امسح</div>
          <div style={T({fontSize: 56, fontWeight: 900, color: C.royal})}>رمز الاستجابة</div>
          <div style={T({fontSize: 56, fontWeight: 900, color: C.royal})}>السريعة</div>
        </div>
      </div>
    </Base>
  );
};

/* ============ S5 آجال التسجيل ============ */
/* a day number that flips like a desk calendar each time it changes */
const FlipDay = ({value, color}) => {
  const f = useCurrentFrame();
  const phase = (f % 3) / 3;
  return (
    <div style={{perspective: 600}}>
      <div style={T({fontSize: 150, fontWeight: 900, lineHeight: 1.1, color, transform: `rotateX(${value > 1 && value < 31 ? (1 - phase) * 50 : 0}deg)`, transformOrigin: 'center 55%'})}>
        {String(value).padStart(2, '0')}
      </div>
    </div>
  );
};
const DateTile = ({day, month, label, hot}) => (
  <div style={{width: 380, borderRadius: 34, overflow: 'hidden', background: hot ? `linear-gradient(160deg, ${C.y}, ${C.y2})` : '#fff', border: `2px solid ${hot ? C.y : C.line}`,
    boxShadow: hot ? '0 26px 60px rgba(201,138,0,.35)' : '0 24px 60px rgba(31,68,194,.16)'}}>
    <div style={{padding: '14px 0', textAlign: 'center', background: hot ? C.navy : C.royal}}><span style={T({fontSize: 38, fontWeight: 700, color: hot ? C.y : C.w})}>{label}</span></div>
    <div style={{padding: '18px 0 26px', textAlign: 'center'}}>
      {day}
      <div style={T({fontSize: 52, fontWeight: 900, color: C.navy})}>{month}</div>
    </div>
  </div>
);
export const S5 = () => {
  const f = useCurrentFrame();
  const fill = lin(f, 60, 150, 0, 1, inout);
  const count = Math.max(1, Math.min(31, Math.ceil(fill * 31)));
  return (
    <Base seed={55} tone="sun" center={[540, 900]}>
      <Title l1="آجال" l2="التسجيل" delay={0} variant="mask" />
      <div style={{position: 'absolute', top: 640, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <In delay={16} from="right"><DateTile day={<FlipDay value={1} color={C.royal} />} month="جويلية" label="من يوم" /></In>
        <svg width={120} height={60} style={{opacity: lin(f, 40, 50), transform: 'scaleX(-1)'}}>
          <line x1={10} y1={30} x2={10 + 90 * lin(f, 40, 56)} y2={30} stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
          <path d="M84 12 L106 30 L84 48" fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={lin(f, 54, 58)} />
        </svg>
        <In delay={40} from="left"><DateTile day={<FlipDay value={f < 60 ? 31 : count} color={C.navy} />} month="جويلية" label="إلى غاية" hot /></In>
      </div>
      <In delay={56} from="up" style={{position: 'absolute', top: 1160, left: 70, right: 70}}>
        <Card style={{padding: '36px 40px'}}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, direction: 'rtl', justifyContent: 'center'}}>
            {[...Array(31)].map((_, i) => {
              const on = i / 31 < fill;
              const pop = on ? Math.max(0, 1 - Math.abs(i / 31 - fill) * 12) : 0;
              return <div key={i} style={{width: 92, height: 54, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: on ? (i === 30 ? C.y : 'rgba(255,199,44,.28)') : 'rgba(31,68,194,.06)', border: `2px solid ${on ? C.y : 'transparent'}`, transform: `scale(${1 + pop * 0.15})`}}>
                <span style={T({fontSize: 30, fontWeight: 700})}>{i + 1}</span>
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
    <Base seed={66} tone="sky" center={[540, 1100]}>
      <Title l1="الوثائق" l2="المطلوبة" delay={0} variant="pop" sub="تُحمَّل عند التسجيل" />
      <In delay={16} from="scale" style={{position: 'absolute', top: 680, left: 60, right: 60}}>
        <Card style={{padding: '40px 46px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 36, paddingBottom: 26, borderBottom: `2px solid ${C.line}`, marginBottom: 10}}>
            <div style={{position: 'relative', width: 190, height: 190}}>
              <Gauge p={pct} size={190} />
              <div style={T({position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, fontWeight: 900, color: C.royal, direction: 'ltr'})}>{Math.round(pct * 100)}%</div>
            </div>
            <div>
              <div style={T({fontSize: 50, fontWeight: 900})}>ملفّ التسجيل</div>
              <div style={T({fontSize: 42, fontWeight: 700, color: C.mute})}>{done} / 4 وثائق</div>
            </div>
          </div>
          {docs.map(([a, b], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '24px 0', borderBottom: i < 3 ? `1px solid ${C.line}` : 'none',
              opacity: lin(f, D[i] - 20, D[i] - 6), transform: `translateX(${(1 - lin(f, D[i] - 20, D[i])) * -60}px)`}}>
              <svg width={56} height={66} viewBox="0 0 40 48" style={{flexShrink: 0}}><path d="M4 2 H26 L36 12 V46 H4 Z" fill={f > D[i] + 10 ? C.y : C.blue} /><path d="M26 2 V12 H36" fill="rgba(0,0,0,.15)" /></svg>
              <div style={{flex: 1}}>
                <div style={T({fontSize: 48, fontWeight: 700})}>{a}</div>
                {b && <div style={T({fontSize: 36, fontWeight: 700, color: C.gold})}>{b}</div>}
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
        {flower(70, 50, 28, '#FF6F91', 10)}{flower(130, 54, 26, '#FFB3C6', -8)}{flower(100, 30, 32, '#FF8FA8', 0)}
        {flower(85, 78, 22, '#FFD1DC', 20)}{flower(117, 80, 22, '#FF6F91', -15)}
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
    <Base seed={77} tone="sun" center={[200, 400]}>
      <Title l1="الناجحون في" l2="البكالوريا" delay={0} variant="zoom" sub="الدورة الرئيسية" />
      <In delay={14} from="scale" style={{position: 'absolute', left: 70, top: 290}}>
        <Bouquet size={220} sway={sway} />
      </In>
      <In delay={30} from="up" style={{position: 'absolute', top: 640, left: 60, right: 60}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '24px 34px', borderRadius: 28, background: 'rgba(255,255,255,.85)', borderRight: `10px solid ${C.y}`, boxShadow: '0 18px 40px rgba(201,138,0,.18)'}}>
          <span style={T({fontSize: 30, fontWeight: 900, color: C.navy, background: C.y, padding: '6px 18px', borderRadius: 12, whiteSpace: 'nowrap'})}>بصفة استثنائية</span>
          <span style={T({fontSize: 42, fontWeight: 700, lineHeight: 1.4})}>تهنئة مبكرة بإهدائهم <b style={{color: C.royal}}>باقات زهور البريد</b></span>
        </div>
      </In>
      {[
        ['المرحلة الأولى', 'تسجيل الابن(ة) وتحميل بطاقة بيان الأعداد المستخرجة من موقع', 'edunet.tn', 'خلال 4 أيام من تاريخ فتح المنظومة', 70, 860],
        ['المرحلة الثانية', 'استكمال التسجيل بتحميل الوثائق المطلوبة', null, null, 130, 1290],
      ].map(([h, body, site, due, d, top], i) => (
        <In key={h} delay={d} from={i ? 'left' : 'right'} dist={160} style={{position: 'absolute', top, left: 60, right: 60}}>
          <Card glow={i === 0} style={{padding: '34px 40px', display: 'flex', gap: 30}}>
            <div style={{width: 96, height: 96, borderRadius: 48, background: `linear-gradient(135deg, ${C.y}, ${C.y2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 10px 24px rgba(201,138,0,.35)'}}>
              <span style={T({fontSize: 56, fontWeight: 900, color: C.navy})}>{i + 1}</span>
            </div>
            <div style={{flex: 1}}>
              <div style={T({fontSize: 52, fontWeight: 900, color: C.royal})}>{h}</div>
              <div style={T({fontSize: 42, fontWeight: 700, lineHeight: 1.45})}>
                {body} {site && <span style={{direction: 'ltr', unicodeBidi: 'isolate', color: C.gold, fontWeight: 900}}>{site}</span>}
              </div>
              {due && <div style={{marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '12px 24px', borderRadius: 16, background: 'rgba(229,55,47,.10)', border: `2px solid ${C.red}`,
                transform: `scale(${1 + Math.max(0, Math.sin((f - 110) / 5)) * 0.03 * (f > 110 ? 1 : 0)})`}}>
                <svg width={36} height={36} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke={C.red} strokeWidth="2.4" /><path d="M12 7 V12 L15.5 14" fill="none" stroke={C.red} strokeWidth="2.4" strokeLinecap="round" /></svg>
                <span style={T({fontSize: 36, fontWeight: 900, color: C.red})}>{due}</span>
              </div>}
            </div>
          </Card>
        </In>
      ))}
    </Base>
  );
};

/* ============ S7b الجوائز ============ */
const PRIZES = [
  ['مناظرة الدخول للمدارس الإعدادية النموذجية', '', 200],
  ['مناظرة الدخول للمعاهد الثانوية النموذجية', '', 200],
  ['البكالوريا + مؤهل التقني المهني BTP', 'باك', 250],
  ['ختم الدروس الجامعية + مؤهل تقني سامي BTS', 'باك + 3', 300],
  ['الماجستير + الشهادة الوطنية لمهندس', 'باك + 5', 350],
  ['المناظرة الوطنية للإقامة في الطب', 'باك + 5', 350],
  ['طب الأسنان — طبيب بيطري — الصيدلة', 'باك + 6', 400],
  ['الدكتوراه في البحث العلمي', 'باك + 8', 450],
  ['الدكتوراه الوطنية في طب العائلة', 'باك + 8', 450],
  ['الدكتوراه الوطنية في طب الاختصاص', 'باك + 10 وما فوق', 500],
];
export const SPrize = () => {
  const f = useCurrentFrame();
  const s = useEntry(6);
  return (
    <Base seed={121} tone="sky" center={[200, 330]}>
      <Stage3D>
        {[[-0.85, 2.15, 0.5], [-0.3, 2.4, 0.38], [-0.55, 1.65, 0.34], [-1.15, 1.6, 0.28]].map(([x, y, sc], i) => (
          <Coin key={i} scale={sc * s} position={[x, y + Math.sin(f / 18 + i) * 0.08, 0]} rotation={[0.25, f * 0.07 + i * 1.3, 0.1]} />
        ))}
      </Stage3D>
      <Title l1="جوائز" l2="يوم العِلم" delay={0} variant="drop" size={110} top={150} sub="جائزة موحّدة لكل شهادة" />
      <div style={{position: 'absolute', top: 640, left: 40, right: 40, display: 'flex', flexDirection: 'column', gap: 14}}>
        {PRIZES.map(([name, years, amount], i) => {
          const d = 18 + i * 9;
          const top = i === PRIZES.length - 1;
          const p = lin(f, d, d + 26, 0, 1, inout);
          const val = Math.round(lin(f, d, d + 26, 0, amount, inout) / 10) * 10;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', borderRadius: 20, height: 86,
              background: top ? `linear-gradient(90deg, ${C.y}, #FFE08A)` : 'rgba(255,255,255,.9)', border: `2px solid ${top ? C.y2 : C.line}`,
              opacity: lin(f, d - 6, d + 4), transform: `translateX(${(1 - lin(f, d - 6, d + 10)) * 120}px) scale(${top ? 1 + Math.max(0, Math.sin((f - 140) / 8)) * 0.02 * (f > 140 ? 1 : 0) : 1})`,
              boxShadow: top ? '0 16px 40px rgba(201,138,0,.4)' : '0 10px 24px rgba(31,68,194,.10)'}}>
              <div style={T({width: 590, flexShrink: 0, fontSize: 28, fontWeight: 900, whiteSpace: 'nowrap'})}>{name}</div>
              <div style={{flex: 1, position: 'relative', height: 34, display: 'flex', alignItems: 'center'}}>
                <div style={{position: 'absolute', left: 0, right: 0, height: 16, borderRadius: 8, background: top ? 'rgba(11,30,91,.12)' : 'rgba(31,68,194,.08)', overflow: 'hidden'}}>
                  <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(amount / 500) * 100 * p}%`, borderRadius: 8,
                    background: top ? `linear-gradient(270deg, ${C.navy}, ${C.royal})` : `linear-gradient(270deg, ${C.royal}, ${C.blue})`}} />
                </div>
                {years && <span style={T({position: 'absolute', top: -26, right: 0, fontSize: 21, fontWeight: 700, color: top ? C.navy : C.mute, whiteSpace: 'nowrap'})}>{years}</span>}
              </div>
              <div style={T({width: 112, flexShrink: 0, textAlign: 'left', fontSize: 40, fontWeight: 900, color: top ? C.navy : C.royal})}>{val} د</div>
            </div>
          );
        })}
      </div>
    </Base>
  );
};

/* ============ S8 هام ============ */
export const S8 = () => {
  const f = useCurrentFrame();
  const shake = f > 34 && f < 54 ? Math.sin(f * 2.2) * 14 * (1 - (f - 34) / 20) : 0;
  return (
    <Base seed={88} tone="alert">
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
        <div style={{background: C.navy, borderRadius: 36, padding: '40px 46px', boxShadow: '0 30px 60px rgba(0,0,0,.25)', display: 'flex', gap: 26, alignItems: 'center'}}>
          <svg width={74} height={74} viewBox="0 0 24 24" style={{flexShrink: 0}}><path d="M3 11 L17 5 V19 L3 13 Z" fill={C.y} /><rect x="17" y="8" width="4" height="8" rx="1.5" fill={C.y} /><path d="M6 13.5 L8 19 H11 L9.5 14.5" fill={C.y} /></svg>
          <span style={T({fontSize: 46, fontWeight: 700, lineHeight: 1.5, color: '#fff'})}>المسؤولون مدعوّون إلى إعلام منظوريهم بفحوى هذه المذكّرة</span>
        </div>
      </In>
    </Base>
  );
};

/* ============ S9 باختصار ============ */
export const S9 = () => {
  const f = useCurrentFrame();
  const items = ['ادخل إلى المنظومة', 'سجّل ابنك أو ابنتك', 'حمّل الوثائق المطلوبة', 'قبل 31 جويلية'];
  const D = items.map((_, i) => 24 + i * 30);
  return (
    <Base seed={99} tone="sky" center={[540, 1100]}>
      <Title l1="باختصار:" delay={0} variant="drop" align="center" />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={`M540 560 L540 ${560 + 960 * lin(f, 20, 140, 0, 1, inout)}`} stroke={C.gold} strokeWidth={5} strokeDasharray="6 14" strokeLinecap="round" opacity={0.6} />
      </svg>
      {items.map((t, i) => {
        const last = i === 3;
        const s = useSp(D[i], {damping: 11, stiffness: 150});
        return (
          <div key={i} style={{position: 'absolute', top: 580 + i * 250, left: 100, right: 100, transform: `scale(${s}) translateY(${(1 - s) * 40}px)`, opacity: lin(f, D[i], D[i] + 8)}}>
            <div style={{height: 190, borderRadius: 999, background: last ? `linear-gradient(135deg, ${C.y}, ${C.y2})` : 'rgba(255,255,255,.92)', border: `2px solid ${last ? C.y2 : C.line}`, display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px',
              boxShadow: last ? `0 0 ${40 + Math.sin(f / 6) * 20}px rgba(255,199,44,.7)` : '0 20px 50px rgba(31,68,194,.14)'}}>
              <div style={{width: 116, height: 116, borderRadius: 58, background: last ? C.navy : `linear-gradient(135deg, ${C.y}, ${C.y2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <span style={T({fontSize: 64, fontWeight: 900, color: last ? C.y : C.navy})}>{i + 1}</span>
              </div>
              <span style={T({fontSize: 60, fontWeight: 900})}>{t}</span>
            </div>
          </div>
        );
      })}
    </Base>
  );
};

/* ============ S10 OUTRO on the glowing stage ============ */
export const S10 = () => {
  const f = useCurrentFrame();
  const s = useSp(16, {damping: 12, stiffness: 70});
  const spin = useSp(16, {damping: 18, stiffness: 40});
  return (
    <GlowBG intensity={0.9}>
      <Fireworks bursts={[
        {at: 8, x: 200, y: 330, color: C.y}, {at: 22, x: 880, y: 300, color: '#9DB2FF'}, {at: 40, x: 540, y: 200, color: '#FFE08A'},
        {at: 70, x: 170, y: 720, color: C.y2}, {at: 92, x: 910, y: 700, color: '#6E8BFF'}, {at: 130, x: 540, y: 240, color: C.y},
      ]} />
      <LightRing cx={540} cy={620} size={520} p={s} />
      <div style={{position: 'absolute', top: 120, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Reveal start={4} dur={22}><div style={{fontFamily: FONT, fontSize: 112, fontWeight: 900, color: '#fff', textShadow: '0 0 30px rgba(255,199,44,.5)'}}>مبروك لأبنائنا</div></Reveal>
        <Reveal start={14} dur={22}><div style={{fontFamily: FONT, fontSize: 120, fontWeight: 900, color: C.y, textShadow: '0 0 40px rgba(255,199,44,.7)'}}>الناجحين</div></Reveal>
      </div>
      <div style={{position: 'absolute', left: 540 - 150, top: 470 + Math.sin(f / 20) * 10, width: 300, height: 300, perspective: 1600,
        transform: `scale(${s}) translateY(${(1 - s) * 300}px)`}}>
        <Logo3D size={300} depth={36} ry={(1 - spin) * -540 + Math.sin(f / 40) * 28} rx={-8 + Math.sin(f / 33) * 5} />
      </div>
      <In delay={50} from="up" style={{position: 'absolute', top: 920, left: 60, right: 60}}>
        <div style={{position: 'relative'}}>
          <div style={{position: 'absolute', inset: -3, borderRadius: 40, background: `conic-gradient(from ${f * 3}deg, #FFC72C, #1F44C2, #FFB000, #4F6FE8, #FFC72C)`, filter: 'blur(10px)', opacity: 0.8}} />
          <div style={{position: 'relative', borderRadius: 38, background: 'linear-gradient(180deg, #0D1B52, #071338)', border: '2px solid rgba(255,199,44,.6)', padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={{padding: 12, borderRadius: 20, background: '#fff', flexShrink: 0}}><Img src={staticFile('qr.png')} style={{width: 220, height: 220, display: 'block'}} /></div>
            <div style={{minWidth: 0}}>
              <div style={T({fontSize: 50, fontWeight: 900, color: '#fff'})}>سجّل الآن</div>
              <div style={T({fontSize: 38, fontWeight: 700, color: '#C9D6FF', marginBottom: 12})}>من 01 إلى 31 جويلية</div>
              <div style={{direction: 'ltr', fontFamily: 'monospace', fontSize: 28, color: C.y, lineHeight: 1.4, textAlign: 'right'}}>postelearning.poste.tn<br />/social/journee_savoir</div>
            </div>
          </div>
        </div>
      </In>
      <In delay={80} from="up" style={{position: 'absolute', top: 1300, left: 40, right: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '30px 20px', borderRadius: 36, background: 'rgba(255,255,255,.06)', border: '2px solid rgba(157,178,255,.35)'}}>
        <span style={T({fontSize: 42, fontWeight: 700, color: '#C9D6FF'})}>للاستفسار، الاتصال بالسيد <b style={{color: '#fff', fontWeight: 900}}>فوزي جاري</b></span>
        <div style={{display: 'flex', gap: 30}}>
          {['93 667 475', '95 542 040'].map((n, i) => (
            <In key={n} delay={92 + i * 10} from="scale">
              <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '20px 34px', borderRadius: 24, background: 'rgba(255,199,44,.08)', border: `2px solid ${C.y}`, boxShadow: '0 0 24px rgba(255,199,44,.3)'}}>
                <svg width={42} height={42} viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.6 3.6a1 1 0 01-.25 1z" fill={C.y} /></svg>
                <span style={{fontFamily: FONT, fontSize: 56, fontWeight: 900, color: '#fff', direction: 'ltr'}}>{n}</span>
              </div>
            </In>
          ))}
        </div>
      </In>
    </GlowBG>
  );
};
