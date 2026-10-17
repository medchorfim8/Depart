import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img, random} from 'remotion';
import {Logo3D} from './logo3d';
import {C, FONT, lin, ease, inout, useSp, Words, Title, Card, In, ShapeField, DotGrid, Logo, Person, Check, clamp} from './lib';

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
        background: 'radial-gradient(circle, #FFE08A 0%, #FFC72C 60%, rgba(255,199,44,0) 72%)', filter: 'blur(1px)'}} />
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

/* ============ S1 INTRO ============ */
export const S1 = () => {
  const f = useCurrentFrame();
  const N = 4, tile = 520, piece = tile / N;
  const settle = useSp(48, {damping: 12, stiffness: 90});
  const shine = lin(f, 70, 110, -1, 1.6);
  const floatY = Math.sin(f / 18) * 10;
  return (
    <Base kinds={['cube', 'diamond']} seed={11} tone="dusk">
      <Horizon y={1500} sun={lin(f, 0, 60, 0.2, 1)} />
      <Title l1="للانتفاع بالدعم" l2="لمصيف العائلات" delay={8} variant="drop" size={118} top={230} />
      <div style={{position: 'absolute', left: 280, top: 820 + floatY, width: tile, height: tile, perspective: 1600}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${Math.sin(f / 30) * 10 * settle}deg) rotateX(${Math.cos(f / 36) * 6 * settle}deg)`}}>
          {[...Array(N * N)].map((_, i) => {
            const c = i % N, r = Math.floor(i / N);
            const rr = (k) => random(`p${i}${k}`);
            const s = useSp(4 + rr('d') * 26, {damping: 13, stiffness: 80, mass: 0.9});
            const dx = (rr('x') - 0.5) * 1400, dy = (rr('y') - 0.5) * 1800, rot = (rr('r') - 0.5) * 720;
            return (
              <div key={i} style={{position: 'absolute', left: c * piece, top: r * piece, width: piece + 0.6, height: piece + 0.6,
                backgroundImage: `url(${staticFile('logo.png')})`, backgroundSize: `${tile}px ${tile}px`, backgroundPosition: `-${c * piece}px -${r * piece}px`,
                transform: `translate3d(${dx * (1 - s)}px, ${dy * (1 - s)}px, ${(1 - s) * 600}px) rotate(${rot * (1 - s)}deg) scale(${0.3 + 0.7 * s})`,
                opacity: lin(f, 0, 10)}} />
            );
          })}
          {/* once assembled, a single image hides the seams between the tiles */}
          <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('logo.png')})`, backgroundSize: 'cover', opacity: lin(f, 58, 72)}} />
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 4, opacity: settle}}>
            <div style={{position: 'absolute', top: -200, left: `${shine * 100}%`, width: 140, height: 1000, transform: 'rotate(25deg)',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent)'}} />
          </div>
          <div style={{position: 'absolute', inset: -14, border: `6px solid ${C.y}`, borderRadius: 18, opacity: settle,
            transform: `scale(${0.9 + settle * 0.1})`, boxShadow: `0 0 70px rgba(255,199,44,.45)`}} />
        </div>
      </div>
      {[0, 1, 2].map((i) => {
        const p = lin(f, 58 + i * 8, 110 + i * 8, 0, 1, Easing_out);
        return <div key={i} style={{position: 'absolute', left: 540 - 380 * p, top: 1080 - 380 * p, width: 760 * p, height: 760 * p,
          borderRadius: '50%', border: `3px solid ${C.y}`, opacity: (1 - p) * 0.7}} />;
      })}
    </Base>
  );
};
const Easing_out = ease;

/* ============ S2 لا تقلق ============ */
export const S2 = () => {
  const f = useCurrentFrame();
  const lines = [['لا', 'تقلق', 0, 'slide'], ['لا', 'تحتار', 34, 'pop'], ['ولا', 'تشغل بالك', 70, 'zoom']];
  return (
    <Base kinds={['ring', 'arc']} seed={22} tone="mid">
      <DotGrid x={80} y={1500} cols={10} rows={6} delay={10} />
      <div style={{position: 'absolute', top: 680, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 46}}>
        {lines.map(([a, b, d, v], i) => (
          <div key={i} style={{display: 'flex', gap: 30, alignItems: 'center'}}>
            <Words text={a} delay={d} variant={v} size={150} />
            <Words text={b} delay={d + 5} variant={v} size={150} color={C.y} />
          </div>
        ))}
      </div>
      {lines.map(([, , d], i) => {
        const p = lin(f, d + 4, d + 30);
        return <div key={i} style={{position: 'absolute', left: 540 - 500 * p, top: 760 + i * 230 - 120 * p, width: 1000 * p, height: 240 * p,
          borderRadius: 999, border: `2px solid rgba(255,199,44,${0.5 * (1 - p)})`}} />;
      })}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={540} cy={980} r={460} fill="none" stroke={C.y} strokeWidth={4} opacity={0.35}
          strokeDasharray={2 * Math.PI * 460} strokeDashoffset={2 * Math.PI * 460 * (1 - lin(f, 0, 120, 0, 1, inout))}
          transform={`rotate(${-90 + f * 0.3} 540 980)`} />
      </svg>
    </Base>
  );
};

/* ============ S3 الحل ============ */
const Bulb = ({on}) => (
  <svg width={70} height={70} viewBox="0 0 60 60">
    <circle cx="30" cy="26" r="17" fill={on ? C.y : 'none'} stroke={C.y} strokeWidth="3" />
    <rect x="22" y="44" width="16" height="6" rx="2" fill={C.y} /><rect x="24" y="52" width="12" height="4" rx="2" fill={C.y} />
    {on && [...Array(8)].map((_, i) => <line key={i} x1={30 + Math.cos(i * 0.785) * 22} y1={26 + Math.sin(i * 0.785) * 22}
      x2={30 + Math.cos(i * 0.785) * 28} y2={26 + Math.sin(i * 0.785) * 28} stroke={C.y} strokeWidth="2.5" strokeLinecap="round" />)}
  </svg>
);
export const S3 = () => {
  const f = useCurrentFrame();
  const on = f > 40 && !(f > 44 && f < 50);
  return (
    <Base kinds={['hex', 'plus']} seed={33} tone="deep" glow={[50, 40]}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={540} cy={1010} rx={330 + i * 110} ry={120 + i * 40} fill="none" stroke={i === 1 ? C.y : C.blue}
            strokeWidth={2.5} opacity={0.35 * lin(f, 50 + i * 8, 80 + i * 8)} strokeDasharray="10 16"
            transform={`rotate(${-12 + Math.sin(f / 40 + i) * 4} 540 1010)`} strokeDashoffset={-f * (2 + i)} />
        ))}
      </svg>
      <In delay={0} from="scale" style={{position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 40px', borderRadius: 999, background: 'rgba(255,199,44,.12)', border: `2px solid ${C.y}`}}>
          <Bulb on={on} /><span style={T({fontSize: 64, fontWeight: 900, color: C.y})}>الحلّ؟</span>
        </div>
      </In>
      <div style={{position: 'absolute', top: 730, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        <Words text="بإمكانك التسجيل في" delay={46} variant="mask" size={72} weight={700} style={{justifyContent: 'center'}} />
        <Words text="منظومة الدعم" delay={62} variant="zoom" size={120} style={{justifyContent: 'center'}} />
        <Words text="لمصيف العائلات" delay={80} variant="rise" size={112} color={C.y} style={{justifyContent: 'center', flexWrap: 'nowrap'}} />
      </div>
      <In delay={112} from="up" style={{position: 'absolute', top: 1400, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Card style={{padding: '26px 48px', display: 'flex', alignItems: 'center', gap: 20}}>
          <span style={{width: 16, height: 16, borderRadius: 8, background: C.y, boxShadow: `0 0 20px ${C.y}`}} />
          <span style={T({fontSize: 46, fontWeight: 700, color: C.mute})}>بالتعاون مع تعاونية البريد والاتصالات</span>
        </Card>
      </In>
    </Base>
  );
};

/* ============ S4 دعم لإقامتك ============ */
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
export const S4 = () => {
  const f = useCurrentFrame();
  const pct = lin(f, 30, 90, 0, 0.30, inout);
  const dn = Math.round(lin(f, 70, 140, 0, 350, inout));
  const arrow = lin(f, 165, 200);
  return (
    <Base kinds={['diamond', 'ring']} seed={44} tone="mid">
      <Title l1="دعم" l2="لإقامتك" delay={0} variant="slide" />
      <div style={{position: 'absolute', top: 660, left: 70, right: 70, display: 'flex', gap: 34}}>
        <In delay={24} from="flip" style={{flex: 1}}>
          <Card glow style={{height: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative'}}>
            <div style={{position: 'relative', width: 250, height: 250}}>
              <Gauge p={pct} />
              <div style={T({position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 84, fontWeight: 900, color: C.y, direction: 'ltr'})}>{Math.round(pct * 100)}%</div>
            </div>
            <div style={T({fontSize: 46, fontWeight: 700, color: C.mute})}>من كلفة الإقامة</div>
          </Card>
        </In>
        <In delay={60} from="flip" style={{flex: 1}}>
          <Card glow style={{height: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24}}>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 6, height: 150}}>
              {[0.35, 0.55, 0.75, 1].map((h, i) => (
                <div key={i} style={{width: 40, height: 150 * h * lin(f, 70 + i * 8, 110 + i * 8), borderRadius: 10, background: i === 3 ? C.y : 'rgba(110,139,255,.55)'}} />
              ))}
            </div>
            <div style={T({fontSize: 100, fontWeight: 900, color: C.y})}>{dn} د</div>
            <div style={T({fontSize: 46, fontWeight: 700, color: C.mute})}>سقف الدعم</div>
          </Card>
        </In>
      </div>
      <In delay={150} from="up" style={{position: 'absolute', top: 1340, left: 70, right: 70}}>
        <Card style={{padding: '44px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
            <span style={T({fontSize: 76, fontWeight: 900})}>01 جوان</span>
            <svg width={130} height={40} style={{transform: 'scaleX(-1)'}}><line x1={6} y1={20} x2={6 + 110 * arrow} y2={20} stroke={C.y} strokeWidth={6} strokeLinecap="round" />
              {arrow > 0.95 && <path d="M100 6 L120 20 L100 34" fill="none" stroke={C.y} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}</svg>
            <span style={T({fontSize: 76, fontWeight: 900})}>30 سبتمبر</span>
          </div>
          <div style={T({fontSize: 44, fontWeight: 700, color: C.mute})}>فترة مصيف العائلات البريدية</div>
        </Card>
      </In>
    </Base>
  );
};

/* ============ S5 من يشارك ============ */
export const S5 = () => {
  const f = useCurrentFrame();
  const people = [['العون البريدي', C.y, 230, -230], ['القرين', C.blue, -230, -230], ['الأبناء', C.blue, 230, 230], ['الأم والأب', C.y, -230, 230]];
  const cx = 540, cy = 1170;
  return (
    <Base kinds={['tri', 'plus']} seed={55} tone="deep" glow={[50, 55]}>
      <Title l1="من" l2="يشارك؟" delay={0} variant="pop" />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {people.map(([, , dx, dy], i) => {
          const p = lin(f, 20 + i * 6, 46 + i * 6);
          return <line key={i} x1={cx} y1={cy} x2={cx + dx * p * 1.05} y2={cy + dy * p * 1.05} stroke={C.y} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" opacity={0.7} strokeDashoffset={-f} />;
        })}
        <circle cx={cx} cy={cy} r={60 * lin(f, 10, 30)} fill={C.y} />
        <circle cx={cx} cy={cy} r={60 + (f % 40) * 2} fill="none" stroke={C.y} strokeWidth={3} opacity={1 - (f % 40) / 40} />
      </svg>
      <div style={{position: 'absolute', left: cx - 60, top: cy - 60, width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: lin(f, 20, 34)}}>
        <svg width={64} height={64} viewBox="0 0 60 60"><path d="M30 52 C10 38 6 26 12 18 C18 10 28 14 30 20 C32 14 42 10 48 18 C54 26 50 38 30 52Z" fill={C.navy} /></svg>
      </div>
      {people.map(([name, col, dx, dy], i) => (
        <div key={i} style={{position: 'absolute', left: cx + dx - 190, top: cy + dy - 170}}>
          <In delay={30 + i * 10} from="scale">
            <Card style={{width: 380, height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22,
              transform: `translateY(${Math.sin(f / 20 + i) * 8}px)`}}>
              <Person color={col} size={140} />
              <div style={T({fontSize: 52, fontWeight: 900})}>{name}</div>
            </Card>
          </In>
        </div>
      ))}
    </Base>
  );
};

/* ============ S6 احجز إقامتك ============ */
const Num = ({n, p = 1, size = 76}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: C.y, display: 'flex', alignItems: 'center', justifyContent: 'center',
    transform: `scale(${p})`, boxShadow: `0 0 30px rgba(255,199,44,.5)`, flexShrink: 0}}>
    <span style={T({fontSize: size * 0.55, fontWeight: 900, color: C.navy})}>{n}</span>
  </div>
);
export const S6 = () => {
  const f = useCurrentFrame();
  const steps = [
    ['اطّلع على العروض', 'وكالات الأسفار والإقامات السياحية', 'postelearning.poste.tn/social/vacances'],
    ['احجز لدى المزوّد', 'عن بعد، أو بالهاتف، أو بمقرّه مباشرة'],
    ['ادفع كلفة الإقامة', 'نقدًا مقابل وصل خلاص أصلي، أو بالتحويل، أو بالتقسيط عبر الإحالة على المرتّب (الملحق عدد 2)'],
  ];
  const D = [26, 80, 130];
  return (
    <Base kinds={['cube', 'hex']} seed={66} tone="mid">
      <DotGrid x={60} y={150} cols={7} rows={5} />
      <Title l1="احجز" l2="إقامتك" delay={0} variant="rise" />
      <Card style={{position: 'absolute', top: 580, left: 60, right: 60, padding: '50px 54px', opacity: lin(f, 14, 28), transform: `translateY(${(1 - lin(f, 14, 34)) * 80}px)`}}>
        <div style={{position: 'absolute', right: 92, top: 120, width: 6, height: 620 * lin(f, 30, 150, 0, 1, inout), background: `linear-gradient(${C.y}, rgba(255,199,44,.1))`, borderRadius: 3}} />
        {steps.map(([h, s, url], i) => {
          const sp = useSp(D[i], {damping: 11, stiffness: 160});
          return (
            <div key={i} style={{display: 'flex', gap: 34, alignItems: 'flex-start', marginBottom: i < 2 ? 44 : 0}}>
              <Num n={i + 1} p={sp} />
              <In delay={D[i] + 4} from="left" dist={70} style={{flex: 1}}>
                <div style={T({fontSize: 62, fontWeight: 900})}>{h}</div>
                <div style={T({fontSize: 38, fontWeight: 400, color: C.mute, lineHeight: 1.45, marginTop: 4})}>{s}</div>
                {url && <div style={{marginTop: 14, display: 'inline-block', padding: '8px 20px', borderRadius: 14, background: 'rgba(110,139,255,.15)', direction: 'ltr'}}>
                  <span style={{fontFamily: 'monospace', fontSize: 32, color: C.blue}}>{url}</span></div>}
              </In>
            </div>
          );
        })}
      </Card>
      <In delay={180} from="up" style={{position: 'absolute', top: 1530, left: 60, right: 60}}>
        <div style={{padding: '28px 40px', borderRadius: 26, background: 'rgba(255,199,44,.12)', borderRight: `10px solid ${C.y}`, display: 'flex', alignItems: 'center', gap: 22}}>
          <svg width={50} height={50} viewBox="0 0 50 50"><path d="M25 4 L47 44 H3 Z" fill={C.y} /><rect x="23" y="17" width="4" height="15" rx="2" fill={C.navy} /><circle cx="25" cy="37" r="2.6" fill={C.navy} /></svg>
          <span style={T({fontSize: 46, fontWeight: 700})}>تثبّت من شروط إلغاء الحجز قبل الدفع</span>
        </div>
      </In>
    </Base>
  );
};

/* ============ S7 سجّل مطلبك ============ */
export const S7 = () => {
  const f = useCurrentFrame();
  const id = '0123456', cin = '•••••543';
  const t1 = Math.floor(lin(f, 50, 80, 0, id.length, k => k));
  const t2 = Math.floor(lin(f, 88, 112, 0, cin.length, k => k));
  const click = f > 128;
  const cur = [interpolate(f, [112, 128], [820, 540], clamp), interpolate(f, [112, 128], [1450, 1205], clamp)];
  const ripple = lin(f, 128, 150);
  return (
    <Base kinds={['diamond', 'plus']} seed={77} tone="deep" glow={[30, 30]}>
      <Title l1="سجّل" l2="مطلبك" delay={0} variant="zoom" sub="بالرقم الآلي وبطاقة التعريف" />
      <In delay={22} from="flip" style={{position: 'absolute', top: 760, left: 70, right: 70}}>
        <Card style={{overflow: 'hidden'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '22px 30px', background: 'rgba(0,0,0,.25)', direction: 'ltr'}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />)}
            <span style={{marginLeft: 18, fontFamily: 'monospace', fontSize: 30, color: C.mute}}>postelearning.poste.tn/social/subvention</span>
          </div>
          <div style={{padding: '40px 40px 46px', display: 'flex', flexDirection: 'column', gap: 28}}>
            {[['الرقم الآلي', id.slice(0, t1), f > 46 && f < 84], ['رقم بطاقة التعريف', cin.slice(0, t2), f >= 84 && f < 116]].map(([lab, val, act], i) => (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 30px', borderRadius: 22,
                background: 'rgba(255,255,255,.06)', border: `2px solid ${act ? C.y : 'rgba(255,255,255,.1)'}`}}>
                <span style={T({fontSize: 42, fontWeight: 700, color: C.mute})}>{lab}</span>
                <span style={{fontFamily: FONT, fontSize: 46, fontWeight: 700, color: C.w, direction: 'ltr', letterSpacing: 2}}>{val}{act && (Math.floor(f / 8) % 2 ? '|' : ' ')}</span>
              </div>
            ))}
            <div style={{position: 'relative', marginTop: 8, padding: '30px', borderRadius: 24, background: click ? C.y2 : C.y, textAlign: 'center',
              transform: `scale(${click ? 1 - 0.04 * (1 - ripple) : 1})`, overflow: 'hidden'}}>
              <span style={T({fontSize: 50, fontWeight: 900, color: C.navy})}>طلب الموافقة المبدئية</span>
              <div style={{position: 'absolute', left: '50%', top: '50%', width: 900 * ripple, height: 900 * ripple, marginLeft: -450 * ripple, marginTop: -450 * ripple,
                borderRadius: '50%', background: 'rgba(255,255,255,.35)', opacity: 1 - ripple}} />
            </div>
          </div>
        </Card>
      </In>
      {f > 100 && <svg width={60} height={70} viewBox="0 0 24 28" style={{position: 'absolute', left: cur[0], top: cur[1], opacity: lin(f, 100, 110)}}>
        <path d="M2 2 L2 22 L8 17 L12 26 L16 24 L12 15 L20 15 Z" fill="#fff" stroke={C.navy} strokeWidth="1.5" /></svg>}
      {f > 140 && <In delay={140} from="scale" style={{position: 'absolute', top: 1590, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 36px', borderRadius: 999, background: 'rgba(40,200,64,.15)', border: '2px solid #28C840'}}>
          <Check p={lin(f, 146, 162)} color="#28C840" size={50} /><span style={T({fontSize: 44, fontWeight: 700})}>تمّ إرسال المطلب</span>
        </div>
      </In>}
    </Base>
  );
};

/* ============ S8 مواعيد ============ */
export const S8 = () => {
  const f = useCurrentFrame();
  const items = [
    ['22 – 30 ماي', 'التسجيل للحصول على الموافقة المبدئية', 'يُغلق يوم 30 ماي على منتصف الليل'],
    ['من 5 جوان', 'الاطّلاع على المطلب وطباعة وثيقة الموافقة المبدئية'],
    ['من 15 جوان', 'تسجيل معطيات الحجز بعد انتهاء الإقامة'],
    ['10 أكتوبر', 'آخر أجل لإرسال الملف كاملًا'],
  ];
  const D = [24, 64, 104, 144];
  return (
    <Base kinds={['ring', 'tri']} seed={88} tone="mid">
      <Title l1="مواعيد" l2="لا تفوّتها" delay={0} variant="mask" />
      <div style={{position: 'absolute', right: 96, top: 600, width: 6, height: 1120 * lin(f, 20, 170, 0, 1, inout), background: `linear-gradient(${C.blue}, ${C.y})`, borderRadius: 3}} />
      {items.map(([d, a, b], i) => {
        const last = i === 3;
        const s = useSp(D[i], {damping: 10, stiffness: 170});
        return (
          <div key={i} style={{position: 'absolute', top: 600 + i * 280, right: 70, left: 60, display: 'flex', alignItems: 'center', gap: 34}}>
            <div style={{width: 58, height: 58, borderRadius: 29, border: `6px solid ${last ? C.y : C.blue}`, background: C.navy, transform: `scale(${s})`, flexShrink: 0,
              boxShadow: last ? `0 0 ${20 + Math.sin(f / 5) * 12}px ${C.y}` : 'none'}} />
            <In delay={D[i] + 3} from="left" dist={120} style={{flex: 1}}>
              <div style={{padding: '30px 40px', borderRadius: 32, background: last ? C.y : C.card, border: `2px solid ${last ? C.y : C.line}`,
                transform: last ? `scale(${1 + Math.max(0, Math.sin((f - 150) / 6)) * 0.02 * (f > 150 ? 1 : 0)})` : ''}}>
                <div style={T({fontSize: 64, fontWeight: 900, color: last ? C.navy : C.y})}>{d}</div>
                <div style={T({fontSize: 42, fontWeight: 700, color: last ? C.navy : C.w, lineHeight: 1.45})}>{a}</div>
                {b && <div style={T({fontSize: 34, fontWeight: 400, color: C.mute})}>{b}</div>}
              </div>
            </In>
          </div>
        );
      })}
    </Base>
  );
};

/* ============ S9 الأولوية ============ */
export const S9 = () => {
  const f = useCurrentFrame();
  const items = ['الأسبقية في التسجيل على المنظومة', 'عدم الانتفاع بالدعم خلال السنوات الثلاث الأخيرة', 'ملف يحتوي على كلّ الوثائق المطلوبة'];
  const D = [30, 80, 140];
  return (
    <Base kinds={['hex', 'diamond']} seed={99} tone="deep" glow={[70, 50]}>
      <DotGrid x={70} y={1640} cols={9} rows={3} delay={20} />
      <Title l1="الأولوية" l2="حسب:" delay={0} variant="drop" />
      <svg width={300} height={300} style={{position: 'absolute', left: 60, top: 160}}>
        {[0, 1, 2].map((i) => <rect key={i} x={150 - 40 - i * 30} y={150 - 40 - i * 30} width={80 + i * 60} height={80 + i * 60} rx={18} fill="none"
          stroke={i === 0 ? C.y : C.blue} strokeWidth={3} opacity={0.5} transform={`rotate(${45 + f * (i + 1) * 0.4} 150 150)`} />)}
      </svg>
      {items.map((t, i) => {
        const s = useSp(D[i], {damping: 12, stiffness: 110});
        return (
          <div key={i} style={{position: 'absolute', top: 640 + i * 320, left: 60, right: 60, transform: `translateX(${(1 - s) * (i % 2 ? -700 : 700)}px) rotate(${(1 - s) * (i % 2 ? -6 : 6)}deg)`, opacity: lin(f, D[i], D[i] + 10)}}>
            <Card style={{height: 270, display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px'}}>
              <span style={{fontFamily: FONT, fontSize: 150, fontWeight: 900, color: 'transparent', WebkitTextStroke: `4px ${C.y}`, lineHeight: 1, width: 90, textAlign: 'center'}}>{i + 1}</span>
              <span style={T({fontSize: 54, fontWeight: 900, lineHeight: 1.4, flex: 1})}>{t}</span>
            </Card>
          </div>
        );
      })}
    </Base>
  );
};

/* ============ S10 التصريح على الشرف ============ */
export const S10 = () => {
  const f = useCurrentFrame();
  const bar = (d, w) => <div style={{height: 18, borderRadius: 9, width: w, background: 'rgba(110,139,255,.25)', overflow: 'hidden'}}>
    <div style={{height: '100%', width: `${lin(f, d, d + 16) * 100}%`, background: C.blue}} /></div>;
  const field = (lab, d, val) => (
    <div style={{flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 26px', borderRadius: 20, background: 'rgba(255,255,255,.06)'}}>
      <span style={T({fontSize: 33, fontWeight: 700, color: C.mute, whiteSpace: 'nowrap'})}>{lab}</span>
      {val ? <span style={T({fontSize: 32, whiteSpace: 'nowrap', fontWeight: 900, color: C.y, opacity: lin(f, d, d + 10)})}>{val}</span> : <Check p={lin(f, d, d + 12)} size={42} />}
    </div>
  );
  const rows = ['القرين', 'ابن / ابنة', 'الأم / الأب'];
  const sign = lin(f, 150, 190, 0, 1, inout);
  return (
    <Base kinds={['plus', 'cube']} seed={110} tone="mid">
      <Title l1="املأ التصريح" l2="على الشرف" delay={0} variant="slide" size={112} />
      <In delay={16} from="up" style={{position: 'absolute', top: 600, left: 60, right: 60}}>
        <Card style={{padding: '44px 40px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30}}>
            <span style={T({fontSize: 58, fontWeight: 900})}>تصريح على الشرف</span>
            <span style={T({fontSize: 34, fontWeight: 700, color: C.y, padding: '8px 22px', borderRadius: 14, background: 'rgba(255,199,44,.14)'})}>الملحق عدد 3</span>
          </div>
          <div style={{display: 'flex', gap: 20, marginBottom: 28}}>{field('الاسم واللقب', 40)}{field('بطاقة التعريف', 52)}</div>
          <div style={{display: 'flex', padding: '0 10px 14px', borderBottom: `2px solid ${C.line}`}}>
            {['الاسم واللقب', 'تاريخ الولادة', 'صلة القرابة'].map((h) => <span key={h} style={T({flex: 1, fontSize: 36, fontWeight: 700, color: C.mute})}>{h}</span>)}
          </div>
          {rows.map((r, i) => (
            <div key={r} style={{display: 'flex', alignItems: 'center', padding: '22px 10px', borderBottom: `1px solid ${C.line}`, opacity: lin(f, 64 + i * 14, 74 + i * 14)}}>
              <div style={{flex: 1}}>{bar(70 + i * 14, 230)}</div><div style={{flex: 1}}>{bar(76 + i * 14, 150)}</div>
              <span style={T({flex: 1, fontSize: 40, fontWeight: 700})}>{r}</span>
            </div>
          ))}
          <div style={{display: 'flex', gap: 20, margin: '28px 0'}}>{field('فترة الإقامة', 120, 'من ... إلى ...')}{field('النزل / الإقامة', 132)}</div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 30px', borderRadius: 20, background: 'rgba(0,0,0,.2)', borderRight: `8px solid ${C.y}`}}>
            <span style={T({fontSize: 35, fontWeight: 700})}>ممضى ومعرّف بالإمضاء لدى السلط المعنية</span>
            <svg width={160} height={60} viewBox="0 0 160 60"><path d="M8 42 C 30 5, 40 60, 60 30 S 90 10, 100 38 S 130 50, 152 18" fill="none" stroke={C.y} strokeWidth="4"
              strokeLinecap="round" strokeDasharray="260" strokeDashoffset={260 * (1 - sign)} /></svg>
          </div>
        </Card>
      </In>
    </Base>
  );
};

/* ============ S11 الوثائق ============ */
export const S11 = () => {
  const f = useCurrentFrame();
  const docs = [['وثيقة الموافقة المبدئية', 'مستخرجة من المنظومة'], ['فاتورة مرقّمة ومختومة وممضاة', 'باسم العون المشارك حصريًّا'],
    ['وثيقة إثبات خلاص كلفة الإقامة'], ['نسخة من الإحالة على المرتّب', 'عند الخلاص بالتقسيط'], ['التصريح على الشرف', 'الملحق عدد 3']];
  const D = docs.map((_, i) => 50 + i * 42);
  const done = docs.filter((_, i) => f > D[i] + 10).length;
  const pct = lin(f, 40, D[4] + 14, 0, 1, inout);
  return (
    <Base kinds={['arc', 'hex']} seed={121} tone="deep" glow={[50, 30]}>
      <Title l1="جهّز وثائقك" l2="الأصلية" delay={0} variant="pop" />
      <In delay={16} from="scale" style={{position: 'absolute', top: 560, left: 60, right: 60}}>
        <Card style={{padding: '40px 46px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 36, paddingBottom: 26, borderBottom: `2px solid ${C.line}`, marginBottom: 10}}>
            <div style={{position: 'relative', width: 200, height: 200}}>
              <Gauge p={pct} size={200} />
              <div style={T({position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, fontWeight: 900, direction: 'ltr'})}>{Math.round(pct * 100)}%</div>
            </div>
            <div>
              <div style={T({fontSize: 50, fontWeight: 900})}>ملفّك جاهز بنسبة</div>
              <div style={T({fontSize: 42, fontWeight: 700, color: C.mute})}>{done} / 5 وثائق</div>
            </div>
          </div>
          {docs.map(([a, b], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '22px 0', borderBottom: i < 4 ? `1px solid ${C.line}` : 'none',
              opacity: lin(f, D[i] - 20, D[i] - 6), transform: `translateX(${(1 - lin(f, D[i] - 20, D[i])) * -60}px)`}}>
              <svg width={56} height={66} viewBox="0 0 40 48"><path d="M4 2 H26 L36 12 V46 H4 Z" fill={f > D[i] + 10 ? C.y : C.blue} /><path d="M26 2 V12 H36" fill="rgba(0,0,0,.2)" /></svg>
              <div style={{flex: 1}}>
                <div style={T({fontSize: 46, fontWeight: 700})}>{a}</div>
                {b && <div style={T({fontSize: 34, fontWeight: 700, color: C.y})}>{b}</div>}
              </div>
              <Check p={lin(f, D[i], D[i] + 12)} size={56} />
            </div>
          ))}
        </Card>
      </In>
    </Base>
  );
};

/* ============ S12 انتبه ============ */
export const S12 = () => {
  const f = useCurrentFrame();
  const shake = f > 40 && f < 60 ? Math.sin(f * 2.2) * 14 * (1 - (f - 40) / 20) : 0;
  const stampS = useSp(70, {damping: 9, stiffness: 200});
  return (
    <Base kinds={['tri', 'plus']} seed={131} tone="alert">
      <div style={{position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `rotate(${shake * 0.3}deg) translateX(${shake}px)`}}>
        <In delay={0} from="scale">
          <svg width={260} height={240} viewBox="0 0 60 55"><path d="M30 3 L57 52 H3 Z" fill={C.navy} stroke={C.navy} strokeWidth="3" strokeLinejoin="round" />
            <rect x="27.5" y="18" width="5" height="19" rx="2.5" fill={C.y} /><circle cx="30" cy="44" r="3.2" fill={C.y} /></svg>
        </In>
      </div>
      <In delay={14} from="down" style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <span style={T({fontSize: 60, fontWeight: 900, color: '#fff', background: C.red, padding: '6px 40px', borderRadius: 18})}>انتبه!</span>
      </In>
      <div style={{position: 'absolute', top: 640, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Words text="وثيقة ناقصة" delay={26} variant="slide" size={128} color={C.navy} style={{justifyContent: 'center'}} />
        <Words text="أو غير مطابقة" delay={40} variant="slide" size={128} color={C.navy} style={{justifyContent: 'center'}} />
      </div>
      <div style={{position: 'absolute', top: 1010, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{transform: `scale(${2.4 - stampS * 1.4}) rotate(${-6}deg)`, opacity: lin(f, 70, 76), padding: '10px 50px', border: `8px solid ${C.red}`, borderRadius: 26}}>
          <span style={T({fontSize: 116, fontWeight: 900, color: C.red})}>رفض آلي</span>
        </div>
      </div>
      <In delay={110} from="up" style={{position: 'absolute', top: 1340, left: 70, right: 70}}>
        <div style={{background: C.navy, borderRadius: 36, padding: '40px 46px', boxShadow: '0 30px 60px rgba(0,0,0,.35)', display: 'flex', gap: 26, alignItems: 'center'}}>
          <svg width={70} height={70} viewBox="0 0 50 50" style={{flexShrink: 0}}><circle cx="25" cy="25" r="21" fill="none" stroke={C.red} strokeWidth="5" /><line x1="11" y1="39" x2="39" y2="11" stroke={C.red} strokeWidth="5" /></svg>
          <span style={T({fontSize: 46, fontWeight: 700, lineHeight: 1.5})}>لا تُقبل أيّ فاتورة باسم غير اسم العون المشارك، ولو كان القرين أو أحد الفروع أو الأصول</span>
        </div>
      </In>
    </Base>
  );
};

/* ============ S13 أرسل الملف ============ */
export const S13 = () => {
  const f = useCurrentFrame();
  const fly = useSp(14, {damping: 14, stiffness: 70});
  const flap = lin(f, 50, 72, 0, 1, inout);
  const plane = lin(f, 150, 200, 0, 1, Easing_in);
  return (
    <Base kinds={['wave', 'diamond']} seed={141} tone="mid">
      <Title l1="أرسل الملف" l2="بالبريد" delay={0} variant="rise" />
      <div style={{position: 'absolute', top: 640, left: 80, right: 80, height: 560, perspective: 1800,
        transform: `translate(${(1 - fly) * -900}px, ${(1 - fly) * 300}px) rotate(${(1 - fly) * -25}deg)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 30, background: 'linear-gradient(160deg, #F7E2A8, #E9C878)', boxShadow: '0 40px 80px rgba(0,0,0,.45)', overflow: 'hidden'}}>
          <svg width={920} height={300} style={{position: 'absolute', top: 0, left: 0, transformOrigin: 'top', transform: `rotateX(${180 - flap * 180}deg)`}}>
          <path d="M0 0 L460 260 L920 0 Z" fill="#D9B45C" stroke="rgba(0,0,0,.08)" />
        </svg>
          <div style={{position: 'absolute', top: 200, left: 50, right: 50, padding: '18px 10px', border: '4px dashed rgba(10,30,90,.35)', borderRadius: 20, textAlign: 'center', background: 'rgba(255,248,225,.6)'}}>
            <span style={T({fontSize: 54, fontWeight: 900, color: C.navy, whiteSpace: 'nowrap'})}>مشاركة في مصيف العائلات</span>
          </div>
          <div style={{position: 'absolute', top: 350, right: 60, left: 60}}>
            <div style={T({fontSize: 42, fontWeight: 900, color: '#2B2410'})}>مكتب الضبط المركزي للديوان الوطني للبريد</div>
            <div style={T({fontSize: 36, fontWeight: 400, color: '#4A3F1E', lineHeight: 1.5})}>إدارة التكوين والعمل الاجتماعي والثقافي</div>
            <div style={T({fontSize: 36, fontWeight: 400, color: '#4A3F1E'})}>نهج الهادي نويرة، 1030 تونس</div>
          </div>
        </div>
        <div style={{position: 'absolute', top: 36, right: 40, opacity: lin(f, 76, 86), transform: `scale(${0.6 + 0.4 * lin(f, 76, 90)})`}}>
          <span style={T({fontSize: 36, fontWeight: 900, color: '#fff', background: C.red, padding: '8px 26px', borderRadius: 14})}>ظرف مغلق • مضمون الوصول</span>
        </div>
      </div>
      <svg width={1080} height={400} style={{position: 'absolute', top: 1230, left: 0}}>
        <path d="M120 300 C 400 380, 700 60, 980 80" fill="none" stroke={C.y} strokeWidth={4} strokeDasharray="10 14" opacity={0.6}
          strokeDashoffset={-f * 2} />
        <g transform={`translate(${120 + plane * 860}, ${300 - plane * 220}) rotate(-20)`} opacity={lin(f, 100, 112)}>
          <path d="M0 0 L60 -22 L22 10 Z" fill={C.y} /><path d="M22 10 L30 30 L36 4 Z" fill={C.y2} />
        </g>
      </svg>
      <In delay={100} from="scale" style={{position: 'absolute', top: 1560, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '20px 44px', borderRadius: 26, background: C.card, border: `2px solid ${C.y}`}}>
          <span style={T({fontSize: 48, fontWeight: 700, color: C.mute})}>آخر أجل:</span>
          <span style={T({fontSize: 70, fontWeight: 900, color: C.y})}>10 أكتوبر</span>
        </div>
      </In>
    </Base>
  );
};
const Easing_in = (t) => t * t;

/* ============ S14 الملف كامل؟ ============ */
export const S14 = () => {
  const f = useCurrentFrame();
  const st = useSp(48, {damping: 8, stiffness: 220});
  const hit = f >= 52 && f < 66 ? Math.sin((f - 52) * 2.5) * 10 * (1 - (f - 52) / 14) : 0;
  const burst = lin(f, 52, 85);
  return (
    <Base kinds={['ring', 'plus']} seed={151} tone="deep" glow={[50, 45]}>
      <Title l1="الملف" l2="كامل؟" delay={0} variant="zoom" align="center" />
      <div style={{position: 'absolute', top: 600, left: 150, right: 150, height: 720, transform: `translate(${hit}px, ${Math.abs(hit) * 0.5}px)`}}>
        <In delay={10} from="flip" style={{height: '100%'}}>
          <div style={{height: '100%', borderRadius: 34, background: 'linear-gradient(180deg, #F4F7FF, #DCE5FF)', padding: '60px 56px', boxShadow: '0 40px 90px rgba(0,0,0,.5)'}}>
            <div style={T({fontSize: 54, fontWeight: 900, color: C.navy})}>طلب الانتفاع بالدعم</div>
            {[1, 0.6, 1, 0.6, 0.85].map((w, i) => <div key={i} style={{height: 22, borderRadius: 11, background: '#C2CEF0', width: `${w * 100 * lin(f, 18 + i * 4, 30 + i * 4)}%`, marginTop: 36}} />)}
          </div>
        </In>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {[...Array(12)].map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={400 + Math.cos(a) * (150 + burst * 120)} y1={1130 + Math.sin(a) * (150 + burst * 120)}
            x2={400 + Math.cos(a) * (180 + burst * 220)} y2={1130 + Math.sin(a) * (180 + burst * 220)} stroke={C.y} strokeWidth={8} strokeLinecap="round" opacity={(1 - burst) * (f > 52 ? 1 : 0)} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 400 - 190, top: 1130 - 190, width: 380, height: 380, borderRadius: '50%', background: '#121A33',
        border: `16px solid ${C.y}`, outline: `6px solid #121A33`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${3 - st * 2}) rotate(${-14 + (1 - st) * 30}deg)`, opacity: lin(f, 46, 50), boxShadow: '0 20px 60px rgba(0,0,0,.5)'}}>
        <span style={T({fontSize: 110, fontWeight: 900, color: C.y})}>مقبول</span>
      </div>
      <In delay={95} from="up" style={{position: 'absolute', top: 1450, left: 70, right: 70}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, padding: '34px 40px', borderRadius: 30, background: 'rgba(255,199,44,.10)', border: `2px solid rgba(255,199,44,.5)`}}>
          <div style={{width: 120, height: 80, borderRadius: 14, background: `linear-gradient(135deg, ${C.y}, ${C.y2})`, position: 'relative', flexShrink: 0,
            transform: `rotateY(${Math.sin(f / 15) * 20}deg)`}}>
            <div style={{position: 'absolute', top: 18, left: 0, right: 0, height: 14, background: 'rgba(10,20,60,.6)'}} />
          </div>
          <div style={T({fontSize: 44, fontWeight: 700, lineHeight: 1.5})}>
            يُشحن مبلغ الدعم على بطاقة <span style={{color: C.y, fontWeight: 900, direction: 'ltr', unicodeBidi: 'isolate', whiteSpace: 'nowrap'}}>e-dinar postier</span> بعد انتهاء المصيف عن طريق التعاونية
          </div>
        </div>
      </In>
    </Base>
  );
};

/* ============ S15 باختصار ============ */
export const S15 = () => {
  const f = useCurrentFrame();
  const items = ['التسجيل في المنظومة', 'الحجز والخلاص', 'تسجيل معطيات الحجز', 'إرسال الملف الأصلي', 'شحن الدعم'];
  const D = items.map((_, i) => 24 + i * 30);
  return (
    <Base kinds={['diamond', 'cube']} seed={161} tone="mid">
      <Title l1="باختصار:" delay={0} variant="drop" align="center" />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={`M540 520 L540 ${520 + 1180 * lin(f, 20, 170, 0, 1, inout)}`} stroke={C.y} strokeWidth={5} strokeDasharray="6 14" strokeLinecap="round" opacity={0.6} />
      </svg>
      {items.map((t, i) => {
        const last = i === 4;
        const s = useSp(D[i], {damping: 11, stiffness: 150});
        return (
          <div key={i} style={{position: 'absolute', top: 540 + i * 236, left: 110, right: 110, transform: `scale(${s}) translateY(${(1 - s) * 40}px)`, opacity: lin(f, D[i], D[i] + 8)}}>
            <div style={{height: 180, borderRadius: 999, background: last ? C.y : C.card, border: `2px solid ${last ? C.y : C.line}`, display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px',
              boxShadow: last ? `0 0 ${40 + Math.sin(f / 6) * 20}px rgba(255,199,44,.6)` : '0 20px 50px rgba(0,0,20,.4)'}}>
              <div style={{width: 110, height: 110, borderRadius: 55, background: last ? C.navy : C.y, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <span style={T({fontSize: 62, fontWeight: 900, color: last ? C.y : C.navy})}>{i + 1}</span>
              </div>
              <span style={T({fontSize: 60, fontWeight: 900, color: last ? C.navy : C.w})}>{t}</span>
            </div>
          </div>
        );
      })}
    </Base>
  );
};

/* ============ S16 OUTRO ============ */
export const S16 = () => {
  const f = useCurrentFrame();
  const s = useSp(20, {damping: 12, stiffness: 70});
  const spin = useSp(20, {damping: 18, stiffness: 40});
  const ry = (1 - spin) * -540 + Math.sin(f / 40) * 28;
  const bob = Math.sin(f / 20) * 14;
  return (
    <Base kinds={['diamond', 'ring']} seed={171} tone="dusk">
      <Horizon y={1420} sun={lin(f, 0, 80, 0.3, 1)} />
      <div style={{position: 'absolute', top: 150, left: 60, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Words text="تمتّع" delay={4} variant="drop" size={124} style={{justifyContent: 'center'}} />
        <Words text="بمصيف العائلات" delay={12} variant="drop" size={124} style={{justifyContent: 'center'}} />
        <Words text="مع البريد التونسي" delay={24} variant="mask" size={74} color={C.y} style={{justifyContent: 'center', marginTop: 8}} />
      </div>
      <div style={{position: 'absolute', left: 540 - 300, top: 1215, width: 600, height: 70, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(0,0,10,.55), rgba(0,0,10,0))', transform: `scale(${s * (1 - bob / 140)})`}} />
      <div style={{position: 'absolute', left: 540 - 330, top: 640, width: 660, height: 660, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,199,44,.35), rgba(255,199,44,0))', opacity: s}} />
      <div style={{position: 'absolute', left: 540 - 220, top: 740 + bob, width: 440, height: 440, perspective: 1800,
        transform: `scale(${s}) translateY(${(1 - s) * 400}px)`}}>
        <Logo3D size={440} depth={48} ry={ry} rx={-8 + Math.sin(f / 33) * 5} />
      </div>
      {[0, 1, 2].map((i) => {
        const a = f / 35 + (i * Math.PI * 2) / 3;
        const z = Math.sin(a);
        return <div key={i} style={{position: 'absolute', left: 540 - 55 + Math.cos(a) * 330, top: 960 - 55 + z * 210, width: 110, height: 110, perspective: 800,
          zIndex: z > 0 ? 2 : 0, opacity: lin(f, 40 + i * 6, 56 + i * 6), transform: `scale(${0.75 + z * 0.25})`}}>
          <Logo3D size={110} depth={16} layers={10} ry={f * 2.4 + i * 60} rx={Math.sin(f / 25 + i) * 20} shine={i / 3} />
        </div>;
      })}
      <In delay={60} from="scale" style={{position: 'absolute', top: 1270, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <span style={T({fontSize: 100, fontWeight: 900, textShadow: '0 10px 30px rgba(0,0,0,.5)'})}>مصيف العائلات</span>
      </In>
      <In delay={86} from="up" style={{position: 'absolute', top: 1470, left: 40, right: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: '34px 20px', borderRadius: 36, background: 'rgba(5,12,42,.82)', border: '2px solid rgba(130,160,255,.25)'}}>
        <span style={T({fontSize: 40, fontWeight: 400, color: C.mute, textAlign: 'center'})}>لمزيد من الاستفسار، الاتصال بالسيد <b style={{color: C.w, fontWeight: 900}}>محمد الشرفي</b></span>
        <div style={{display: 'flex', gap: 30}}>
          {['95 542 040', '93 667 475'].map((n, i) => (
            <In key={n} delay={100 + i * 10} from="scale">
              <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '22px 36px', borderRadius: 24, background: C.card, border: `2px solid ${C.y}`}}>
                <svg width={44} height={44} viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.6 3.6a1 1 0 01-.25 1z" fill={C.y} /></svg>
                <span style={{fontFamily: FONT, fontSize: 58, fontWeight: 900, color: C.w, direction: 'ltr'}}>{n}</span>
              </div>
            </In>
          ))}
        </div>
      </In>
    </Base>
  );
};
