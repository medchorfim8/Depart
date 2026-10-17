import React from 'react';
import {AbsoluteFill, useCurrentFrame, random} from 'remotion';
import {C, lin} from './lib';

/* slow falling gold confetti and twinkling sparkles: ceremony atmosphere */
export const Bokeh = ({n = 26}) => {
  const f = useCurrentFrame();
  const cols = ['#FFC72C', '#FFE08A', '#FFFFFF', '#9DB2FF'];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {[...Array(n)].map((_, i) => {
          const r = (k) => random(`cf-${i}-${k}`);
          const speed = 0.9 + r('v') * 1.4;
          const y = ((r('y') * 2100 + f * speed) % 2100) - 120;
          const x = r('x') * 1080 + Math.sin(f / (30 + r('p') * 30) + i) * 50;
          const w = 10 + r('w') * 12;
          const flip = Math.cos(f / (8 + r('f') * 8) + i);
          return <rect key={i} x={x} y={y} width={w} height={w * 0.55} rx={2} fill={cols[i % cols.length]} opacity={0.55}
            transform={`rotate(${f * (r('s') - 0.5) * 6 + r('r') * 360} ${x} ${y}) scale(1 ${flip})`} />;
        })}
        {[...Array(14)].map((_, i) => {
          const r = (k) => random(`tw-${i}-${k}`);
          const tw = Math.max(0, Math.sin(f / (14 + r('t') * 16) + r('o') * 6));
          const x = r('x') * 1080, y = r('y') * 1700, h = 10 + r('s') * 18;
          return <path key={'t' + i} d={`M${x},${y - h} Q${x + h * 0.12},${y - h * 0.12} ${x + h},${y} Q${x + h * 0.12},${y + h * 0.12} ${x},${y + h} Q${x - h * 0.12},${y + h * 0.12} ${x - h},${y} Q${x - h * 0.12},${y - h * 0.12} ${x},${y - h} Z`}
            fill="#FFF3C4" opacity={tw * 0.8} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* stage floor light with a row of twinkling bulbs, anchors the lower part of every middle scene */
export const SeaFooter = ({from, to}) => {
  const f = useCurrentFrame();
  const show = lin(f, from, from + 24) * (1 - lin(f, to - 16, to));
  if (show <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, opacity: show, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,12,42,0) 0%, rgba(5,12,42,.6) 55%, rgba(4,10,34,.92) 100%)'}} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 70, height: 120, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,214,120,.20), rgba(255,199,44,0))'}} />
      {[...Array(16)].map((_, i) => {
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / 9 + i * 0.9));
        return <div key={i} style={{position: 'absolute', top: 110 + Math.sin(i / 15 * Math.PI) * 26, left: 38 + i * 67, width: 10, height: 10, borderRadius: 5, background: '#FFE7A8',
          boxShadow: `0 0 ${12 * tw}px ${3 * tw}px rgba(255,214,120,${0.55 * tw})`, opacity: 0.45 + 0.55 * tw}} />;
      })}
    </div>
  );
};

/* light grade: warm top light, vignette and fine film grain */
export const Grade = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(90% 45% at 85% 0%, rgba(255,190,90,.10), rgba(255,190,90,0) 70%)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(120% 85% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,18,.42) 100%)'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay'}}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} /></filter>
        <rect width="1080" height="1920" filter="url(#grain)" />
      </svg>
      <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 2px ${C.navy}`}} />
    </AbsoluteFill>
  );
};
