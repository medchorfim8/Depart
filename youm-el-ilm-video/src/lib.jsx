import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, spring, Easing, random, staticFile, Img} from 'remotion';

export const C = {
  navy: '#0B1E5B', navy2: '#14298A', royal: '#1F44C2', blue: '#4F6FE8',
  y: '#FFC72C', y2: '#FFB000', w: '#FFFFFF', ink: '#0B1E5B', mute: '#5B6B9A', gold: '#C98A00', red: '#E5372F',
  card: 'rgba(255,255,255,0.88)', line: 'rgba(31,68,194,0.14)',
};
export const FONT = 'Tajawal, sans-serif';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const inout = Easing.bezier(0.65, 0, 0.35, 1);

export const useSp = (delay = 0, cfg = {damping: 14, mass: 0.8, stiffness: 120}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: cfg});
};
export const lin = (f, a, b, from = 0, to = 1, e = ease) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: e});

/* ---------------- animated words ---------------- */
export const Words = ({text, delay = 0, variant = 'rise', color = C.ink, size = 120, weight = 900, stagger = 4, style = {}}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: `0 ${size * 0.22}px`, ...style}}>
      {words.map((w, i) => {
        const d = delay + i * stagger;
        const s = spring({frame: f - d, fps, config: {damping: 13, stiffness: 140, mass: 0.7}});
        const p = lin(f, d, d + 16);
        let t = '', o = p, filt = '', clip;
        if (variant === 'rise') { t = `translateY(${(1 - s) * 70}px)`; filt = `blur(${(1 - p) * 10}px)`; }
        if (variant === 'pop') { t = `scale(${0.3 + s * 0.7}) rotate(${(1 - s) * -8}deg)`; }
        if (variant === 'slide') { t = `translateX(${(1 - s) * 160}px)`; filt = `blur(${(1 - p) * 8}px)`; }
        if (variant === 'drop') { t = `translateY(${(1 - s) * -90}px) rotateX(${(1 - s) * 70}deg)`; }
        if (variant === 'mask') { o = 1; clip = `inset(${(1 - p) * 100}% 0 0 0)`; t = `translateY(${(1 - p) * 40}px)`; }
        if (variant === 'zoom') { t = `scale(${2.2 - s * 1.2})`; filt = `blur(${(1 - p) * 14}px)`; }
        return (
          <span key={i} style={{display: 'inline-block', color, fontSize: size, fontWeight: weight, lineHeight: 1.18,
            fontFamily: FONT, transform: t, opacity: o, filter: filt, clipPath: clip, transformOrigin: 'center bottom',
            textShadow: '0 6px 26px rgba(31,68,194,0.18)'}}>{w}</span>
        );
      })}
    </div>
  );
};

/* Standard 2-line title block (white / yellow) + accent bar */
export const Title = ({l1, l2, delay = 0, variant = 'rise', top = 170, size = 124, sub, subColor = C.mute, align = 'right'}) => {
  const f = useCurrentFrame();
  const bar = lin(f, delay + 14, delay + 34);
  const just = align === 'center' ? 'center' : 'flex-start';
  return (
    <div style={{position: 'absolute', top, right: 80, left: 80, display: 'flex', flexDirection: 'column', alignItems: just}}>
      {l1 && <Words text={l1} delay={delay} variant={variant} size={size} style={{justifyContent: just}} />}
      {l2 && <Words text={l2} delay={delay + 7} variant={variant} size={size} color={C.royal} style={{justifyContent: just}} />}
      <div style={{height: 10, width: 170 * bar, background: `linear-gradient(90deg, ${C.y}, ${C.y2})`, borderRadius: 10, marginTop: 18}} />
      {sub && <div style={{marginTop: 22, opacity: lin(f, delay + 18, delay + 34), transform: `translateY(${(1 - lin(f, delay + 18, delay + 34)) * 20}px)`}}>
        <Words text={sub} delay={delay + 18} variant="mask" size={56} weight={700} color={subColor} stagger={3} style={{justifyContent: just}} />
      </div>}
    </div>
  );
};

/* ---------------- card ---------------- */
export const Card = ({children, style = {}, glow = false}) => (
  <div style={{background: C.card, border: `2px solid ${glow ? 'rgba(255,199,44,.7)' : C.line}`, borderRadius: 38, backdropFilter: 'blur(6px)', boxShadow: glow ? `0 0 0 6px rgba(255,199,44,.18), 0 26px 60px rgba(201,138,0,.22)` : '0 24px 60px rgba(31,68,194,.16)', ...style}}>{children}</div>
);

/* entrance wrapper for elements */
export const In = ({delay = 0, from = 'up', children, style = {}, dist = 90}) => {
  const f = useCurrentFrame();
  const s = useSp(delay, {damping: 15, stiffness: 120, mass: 0.8});
  const p = lin(f, delay, delay + 14);
  const m = {up: [0, dist], down: [0, -dist], right: [dist, 0], left: [-dist, 0]}[from] || [0, 0];
  const sc = from === 'scale' ? 0.6 + 0.4 * s : 1;
  const rot = from === 'flip' ? `rotateX(${(1 - s) * 80}deg)` : '';
  return (
    <div style={{transform: `perspective(1400px) translate(${m[0] * (1 - s)}px, ${m[1] * (1 - s)}px) scale(${sc}) ${rot}`, opacity: p, ...style}}>{children}</div>
  );
};

/* ---------------- decorative shape field ---------------- */
const shapePath = (k, s) => {
  const h = s / 2;
  switch (k) {
    case 'tri': return <polygon points={`0,${-h} ${h * 0.95},${h * 0.7} ${-h * 0.95},${h * 0.7}`} />;
    case 'hex': { const p = [...Array(6)].map((_, i) => `${Math.cos(i * Math.PI / 3) * h},${Math.sin(i * Math.PI / 3) * h}`).join(' '); return <polygon points={p} />; }
    case 'ring': return <g><circle r={h} /><circle r={h * 0.62} opacity={0.6} /></g>;
    case 'plus': return <path d={`M${-h},0 L${h},0 M0,${-h} L0,${h}`} />;
    case 'diamond': return <polygon points={`0,${-h} ${h},0 0,${h} ${-h},0`} />;
    case 'arc': return <path d={`M${-h},0 A${h},${h} 0 0 1 ${h},0`} />;
    case 'cube': {
      const a = h * 0.85, b = h * 0.5;
      return <g><polygon points={`0,${-h} ${a},${-b} ${a},${b} 0,${h} ${-a},${b} ${-a},${-b}`} /><path d={`M${-a},${-b} L0,0 L${a},${-b} M0,0 L0,${h}`} /></g>;
    }
    case 'star': { const p = [...Array(10)].map((_, i) => { const r = i % 2 ? h * 0.45 : h, a = -Math.PI / 2 + i * Math.PI / 5; return `${Math.cos(a) * r},${Math.sin(a) * r}`; }).join(' '); return <polygon points={p} />; }
    case 'spark': return <path d={`M0,${-h} Q${h * 0.12},${-h * 0.12} ${h},0 Q${h * 0.12},${h * 0.12} 0,${h} Q${-h * 0.12},${h * 0.12} ${-h},0 Q${-h * 0.12},${-h * 0.12} 0,${-h} Z`} />;
    case 'cap': return <g><polygon points={`0,${-h * 0.55} ${h},${-h * 0.1} 0,${h * 0.35} ${-h},${-h * 0.1}`} /><path d={`M${-h * 0.55},${h * 0.08} L${-h * 0.55},${h * 0.5} Q0,${h * 0.75} ${h * 0.55},${h * 0.5} L${h * 0.55},${h * 0.08} M${h * 0.75},${-h * 0.02} L${h * 0.75},${h * 0.55}`} /></g>;
    case 'book': return <g><path d={`M0,${-h * 0.35} Q${-h * 0.5},${-h * 0.6} ${-h},${-h * 0.4} L${-h},${h * 0.5} Q${-h * 0.5},${h * 0.3} 0,${h * 0.55} Q${h * 0.5},${h * 0.3} ${h},${h * 0.5} L${h},${-h * 0.4} Q${h * 0.5},${-h * 0.6} 0,${-h * 0.35} Z`} /><path d={`M0,${-h * 0.35} L0,${h * 0.55}`} /></g>;
    case 'wave': return <path d={`M${-h},0 q${h / 4},${-h / 3} ${h / 2},0 t${h / 2},0 t${h / 2},0 t${h / 2},0`} />;
    default: return <circle r={h} />;
  }
};
export const ShapeField = ({kinds = ['cube'], seed = 1, n = 16, opacity = 1}) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity}}>
      {[...Array(n)].map((_, i) => {
        const r = (k) => random(`${seed}-${i}-${k}`);
        const k = kinds[Math.floor(r('k') * kinds.length)];
        const size = 60 + r('s') * 260;
        const depth = 0.3 + r('d') * 0.9;
        const x = r('x') * 1080 + Math.sin(f / (60 + r('p') * 60) + i) * 30 * depth;
        const y = ((r('y') * 2100 - f * depth * 0.9) % 2100 + 2100) % 2100 - 90;
        const rot = r('r') * 360 + f * (r('v') - 0.5) * 1.6;
        const col = r('c') > 0.72 ? C.y : C.blue;
        const appear = lin(f, i * 1.5, i * 1.5 + 20);
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${rot}) scale(${appear})`} fill="none" stroke={col}
            strokeWidth={2 + depth * 1.5} opacity={(0.18 + depth * 0.28)} strokeLinecap="round" strokeLinejoin="round">
            {shapePath(k, size * depth)}
          </g>
        );
      })}
    </svg>
  );
};

/* dot grid accent */
export const DotGrid = ({x = 0, y = 0, cols = 8, rows = 6, gap = 44, delay = 0, color = C.y}) => {
  const f = useCurrentFrame();
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={cols * gap} height={rows * gap}>
      {[...Array(cols * rows)].map((_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const p = lin(f, delay + (c + r) * 1.2, delay + (c + r) * 1.2 + 10);
        const pulse = 0.5 + 0.5 * Math.sin(f / 12 - (c + r) * 0.5);
        return <circle key={i} cx={c * gap} cy={r * gap} r={4 * p} fill={color} opacity={0.25 + 0.35 * pulse} />;
      })}
    </svg>
  );
};

export const Logo = ({size = 110, style = {}}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.18, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,.4)', ...style}}>
    <Img src={staticFile('logo.png')} style={{width: '100%', height: '100%'}} />
  </div>
);

/* person icon */
export const Person = ({color = C.y, size = 120}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="rgba(255,255,255,.08)" stroke={color} strokeWidth="3" />
    <circle cx="50" cy="40" r="15" fill={color} />
    <path d="M22 80 C26 60, 74 60, 78 80" fill={color} />
  </svg>
);

export const Check = ({p = 1, size = 44, color = C.y}) => (
  <svg width={size} height={size} viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="22" fill={color} opacity={p} transform={`scale(${p})`} style={{transformOrigin: '25px 25px'}} />
    <path d="M14 26 L22 34 L37 17" fill="none" stroke={C.navy} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="40" strokeDashoffset={40 * (1 - p)} />
  </svg>
);
