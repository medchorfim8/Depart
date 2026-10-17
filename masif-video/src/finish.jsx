import React from 'react';
import {AbsoluteFill, useCurrentFrame, random} from 'remotion';
import {C, lin} from './lib';

/* warm golden dust drifting upward: summer light */
export const Bokeh = ({n = 22}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      {[...Array(n)].map((_, i) => {
        const r = (k) => random(`bk-${i}-${k}`);
        const size = 10 + r('s') * 46;
        const speed = 0.25 + r('v') * 0.6;
        const y = ((r('y') * 2200 - f * speed) % 2200 + 2200) % 2200 - 140;
        const x = r('x') * 1080 + Math.sin(f / (50 + r('p') * 50) + i) * 40;
        const tw = 0.45 + 0.55 * Math.abs(Math.sin(f / (30 + r('t') * 40) + i));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,214,120,${0.55 * tw}) 0%, rgba(255,199,44,0) 70%)`,
          filter: `blur(${r('b') * 3}px)`}} />;
      })}
    </AbsoluteFill>
  );
};

/* soft sea band at the bottom of every middle scene, gives the empty lower area a summer anchor */
export const SeaFooter = ({from, to}) => {
  const f = useCurrentFrame();
  const show = lin(f, from, from + 24) * (1 - lin(f, to - 16, to));
  if (show <= 0) return null;
  const wave = (i) => {
    const y0 = 70 + i * 34, amp = 9 - i * 1.5, len = 260 + i * 70, ph = f / (26 - i * 4) + i * 1.7;
    let d = `M 0 ${y0}`;
    for (let x = 0; x <= 1080; x += 20) d += ` L ${x} ${(y0 + Math.sin((x / len) * Math.PI * 2 + ph) * amp).toFixed(1)}`;
    return d;
  };
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, opacity: show, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,12,42,0) 0%, rgba(5,12,42,.55) 55%, rgba(4,10,34,.9) 100%)'}} />
      <svg width={1080} height={260} style={{position: 'absolute', inset: 0}}>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={wave(i)} fill="none" strokeLinecap="round"
            stroke={i === 0 ? 'rgba(255,199,44,.32)' : `rgba(150,175,255,${0.22 - i * 0.04})`} strokeWidth={i === 0 ? 3 : 2} />
        ))}
      </svg>
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
