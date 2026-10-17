import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile, random} from 'remotion';
import {C, FONT, lin, inout} from './lib';

/* dark stage lit by drifting gold and blue light, in the style of the "Claude" glow animation */
export const GlowBG = ({children, intensity = 1}) => {
  const f = useCurrentFrame();
  const blob = (x, y, r, color, k) => (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%',
      background: `radial-gradient(closest-side, ${color}, rgba(0,0,0,0))`, filter: 'blur(40px)', opacity: intensity * (0.75 + 0.25 * Math.sin(f / 30 + k))}} />
  );
  return (
    <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 110%, #0E2A8F 0%, #06103A 45%, #02061A 100%)', overflow: 'hidden'}}>
      {blob(540 + Math.sin(f / 50) * 260, 1750 + Math.cos(f / 40) * 60, 620, 'rgba(255,184,0,.75)', 0)}
      {blob(160 + Math.cos(f / 45) * 120, 1500, 460, 'rgba(31,68,194,.85)', 1)}
      {blob(930 + Math.sin(f / 38) * 100, 1450, 420, 'rgba(79,111,232,.75)', 2)}
      {blob(540, 380 + Math.sin(f / 60) * 40, 380, 'rgba(255,199,44,.18)', 3)}
      {[...Array(40)].map((_, i) => {
        const r = (k) => random(`gs-${i}-${k}`);
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(f / (12 + r('t') * 20) + i));
        return <div key={i} style={{position: 'absolute', left: r('x') * 1080, top: ((r('y') * 1920 - f * (0.3 + r('v'))) % 1920 + 1920) % 1920,
          width: 3 + r('s') * 4, height: 3 + r('s') * 4, borderRadius: '50%', background: '#FFE7A8', opacity: tw * 0.7, boxShadow: '0 0 8px #FFC72C'}} />;
      })}
      {children}
    </AbsoluteFill>
  );
};

/* spinning ring of light (gold to blue), with a bright arc sweeping around */
export const LightRing = ({cx = 540, cy = 960, size = 760, p = 1}) => {
  const f = useCurrentFrame();
  const rot = f * 2.2;
  const ring = (w, blur, alpha, speed, cols) => (
    <div style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size, borderRadius: '50%',
      background: `conic-gradient(from ${rot * speed}deg, ${cols})`, filter: `blur(${blur}px)`, opacity: alpha * p,
      WebkitMaskImage: `radial-gradient(circle, transparent ${50 - w}%, #000 ${51 - w}%, #000 50%, transparent 51%)`,
      maskImage: `radial-gradient(circle, transparent ${50 - w}%, #000 ${51 - w}%, #000 50%, transparent 51%)`,
      transform: `scale(${0.6 + 0.4 * p})`}} />
  );
  return (
    <>
      {ring(9, 30, 0.9, 1, 'rgba(255,199,44,0) 0deg, #FFC72C 70deg, #FFB000 120deg, rgba(31,68,194,0) 180deg, #4F6FE8 250deg, #1F44C2 300deg, rgba(255,199,44,0) 360deg')}
      {ring(3, 6, 1, 1, 'rgba(255,230,160,0) 0deg, #FFF3C4 90deg, rgba(255,230,160,0) 140deg, rgba(160,185,255,0) 200deg, #C9D6FF 280deg, rgba(160,185,255,0) 330deg')}
      {ring(14, 60, 0.5, -0.6, 'rgba(255,199,44,0) 0deg, rgba(255,199,44,.8) 120deg, rgba(31,68,194,.8) 240deg, rgba(255,199,44,0) 360deg')}
    </>
  );
};

/* Arabic-safe reveal: a soft mask wipes in from the right so letters keep their joins */
export const Reveal = ({children, start = 0, dur = 24, style = {}}) => {
  const f = useCurrentFrame();
  const p = lin(f, start, start + dur, 0, 1, inout);
  const edge = interpolate(p, [0, 1], [-20, 120]);
  const m = `linear-gradient(to left, #000 ${edge - 20}%, transparent ${edge}%)`;
  return (
    <div style={{WebkitMaskImage: m, maskImage: m, filter: `blur(${(1 - p) * 6}px)`, ...style}}>{children}</div>
  );
};

/* the glowing prompt box with text typed in, as in the viral animation */
export const GlowBox = ({text, start = 0, cps = 1.4, width = 900, style = {}}) => {
  const f = useCurrentFrame();
  const appear = lin(f, start, start + 14, 0, 1, inout);
  const n = Math.max(0, Math.floor((f - start - 10) * cps));
  const words = text.split(' ');
  let shown = '', count = 0;
  for (const w of words) { if (count + w.length > n) break; shown += (shown ? ' ' : '') + w; count += w.length + 1; }
  const typing = shown.length < text.length;
  const hue = f * 3;
  return (
    <div style={{width, position: 'relative', opacity: appear, transform: `translateY(${(1 - appear) * 40}px) scale(${0.94 + appear * 0.06})`, ...style}}>
      <div style={{position: 'absolute', inset: -4, borderRadius: 40, background: `conic-gradient(from ${hue}deg, #FFC72C, #FFB000, #1F44C2, #4F6FE8, #FFC72C)`, filter: 'blur(14px)', opacity: 0.85}} />
      <div style={{position: 'absolute', inset: -2, borderRadius: 38, background: `conic-gradient(from ${hue}deg, #FFE08A, #FFB000, #4F6FE8, #9DB2FF, #FFE08A)`}} />
      <div style={{position: 'relative', borderRadius: 36, background: 'linear-gradient(180deg, #0D1B52, #071338)', padding: '34px 40px 26px', minHeight: 170}}>
        <div style={{fontFamily: FONT, fontSize: 48, fontWeight: 700, color: '#F4F7FF', lineHeight: 1.45, minHeight: 70}}>
          {shown}<span style={{opacity: typing || Math.floor(f / 10) % 2 ? 1 : 0, color: C.y}}>|</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
          <div style={{width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${C.y}, ${C.y2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(255,199,44,.6)'}}>
            <svg width={30} height={30} viewBox="0 0 24 24"><path d="M12 19 V5 M5 12 L12 5 L19 12" fill="none" stroke={C.navy} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <span style={{fontFamily: FONT, fontSize: 28, fontWeight: 700, color: '#9DB2FF'}}>البريد التونسي</span>
        </div>
      </div>
    </div>
  );
};

/* the La Poste emblem glowing in the middle of the light ring */
export const GlowEmblem = ({size = 300, p = 1}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: size, height: size, transform: `scale(${0.5 + 0.5 * p}) rotate(${(1 - p) * -30}deg)`, opacity: p,
      filter: `drop-shadow(0 0 ${30 + Math.sin(f / 10) * 10}px rgba(255,199,44,.7))`}}>
      <Img src={staticFile('logo-emblem.png')} style={{width: '100%', height: '100%'}} />
    </div>
  );
};

/* the certificate floating in, with a gold glow and a light sweep */
export const Certificate = ({start = 0, width = 920}) => {
  const f = useCurrentFrame();
  const p = lin(f, start, start + 40, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const sweep = lin(f, start + 40, start + 80, -0.4, 1.4);
  const h = width * 1131 / 1600;
  return (
    <div style={{width, height: h, perspective: 1800}}>
      <div style={{position: 'relative', width, height: h, transformStyle: 'preserve-3d',
        transform: `rotateY(${(1 - p) * -70 + Math.sin(f / 45) * 5}deg) rotateX(${(1 - p) * 25 + Math.cos(f / 50) * 3}deg) translateZ(${(1 - p) * -400}px)`, opacity: Math.min(1, p * 2)}}>
        <div style={{position: 'absolute', inset: -18, borderRadius: 24, background: 'radial-gradient(closest-side, rgba(255,199,44,.55), rgba(255,199,44,0))', filter: 'blur(30px)'}} />
        <Img src={staticFile('certificate.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 14,
          boxShadow: '0 40px 80px rgba(11,30,91,.35), 0 0 0 4px #FFC72C'}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden', pointerEvents: 'none'}}>
          <div style={{position: 'absolute', top: '-40%', left: `${sweep * 100}%`, width: '22%', height: '180%', transform: 'rotate(20deg)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.7), rgba(255,255,255,0))'}} />
        </div>
      </div>
    </div>
  );
};
