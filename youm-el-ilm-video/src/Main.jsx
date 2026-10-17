import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, delayRender, continueRender, interpolate} from 'remotion';
import {C, lin, inout, Logo} from './lib';
import * as S from './scenes';
import {Bokeh, SeaFooter, Grade} from './finish';
import {cuts, voice} from './timeline';

const TOTAL = cuts[cuts.length - 1];
const comps = [S.S1, S.S2, S.S3, S.S4, S.S5, S.S6, S.S7, S.SPrize, S.S8, S.S9, S.S10];
const trans = ['none', 'circle', 'diag', 'blinds', 'diamond', 'zoom', 'split', 'blindsV', 'slideUp', 'flip', 'circle2'];
const TD = 18;

/* music sits lower while the narrator speaks (src/voice.json is written by scripts/make_voice.py) */
const musicLevel = (fr) => {
  if (!voice.length) return 0.55;
  const duck = Math.max(0, ...voice.map((v) => interpolate(fr, [v.from - 8, v.from, v.from + v.frames, v.from + v.frames + 10], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));
  return 0.32 - 0.2 * duck;
};

/* a different sound for each page change, plus a few accents inside scenes: [scene, frames into it, sound, volume] */
const sfx = [
  [1, 0, 'whoosh', 0.35], [2, 0, 'chime-soft', 0.3], [3, 0, 'swish', 0.32], [4, 0, 'pop', 0.35], [5, 0, 'paper', 0.4],
  [6, 0, 'shimmer', 0.3], [7, 0, 'swoosh-up', 0.32], [8, 0, 'impact', 0.42], [9, 0, 'paper-quick', 0.38], [10, 0, 'whoosh-low', 0.38],
  [0, 10, 'riser', 0.22], [0, 52, 'chime', 0.28], [1, 30, 'pop', 0.3], [7, 120, 'chime-soft', 0.22], [10, 26, 'shimmer', 0.25],
].map(([scene, off, name, vol]) => [cuts[scene] + off, name, vol]);
const SfxTrack = () => sfx.map(([at, name, vol]) => (
  <Sequence key={`${at}-${name}`} from={Math.max(0, at - 3)} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
  </Sequence>
));

const strips = (n, p, vertical) => {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 100, b = a + (100 / n) * p;
    if (!vertical) pts.push(`0% ${a}%`, `100% ${a}%`, `100% ${b}%`, `0% ${b}%`, `0% ${a}%`);
    else pts.push(`${a}% 0%`, `${a}% 100%`, `${b}% 100%`, `${b}% 0%`, `${a}% 0%`);
  }
  return `polygon(${pts.join(',')})`;
};

const Enter = ({type, children}) => {
  const f = useCurrentFrame();
  const p = lin(f, 0, TD, 0, 1, inout);
  if (type === 'none' || p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  let st = {};
  switch (type) {
    case 'circle': st.clipPath = `circle(${p * 125}% at 85% 12%)`; break;
    case 'circle2': st.clipPath = `circle(${p * 125}% at 50% 55%)`; break;
    case 'diag': { const x1 = 100 - p * 170; st.clipPath = `polygon(${x1}% 0%, 130% 0%, 130% 100%, ${x1 + 70}% 100%)`; break; }
    case 'diag2': { const x1 = p * 170; st.clipPath = `polygon(-30% 0%, ${x1}% 0%, ${x1 - 70}% 100%, -30% 100%)`; break; }
    case 'blinds': st.clipPath = strips(8, p, false); break;
    case 'blindsV': st.clipPath = strips(6, p, true); break;
    case 'diamond': { const k = p * 105; st.clipPath = `polygon(50% ${50 - k}%, ${50 + k}% 50%, 50% ${50 + k}%, ${50 - k}% 50%)`; break; }
    case 'split': st.clipPath = `inset(0 ${50 - 50 * p}% 0 ${50 - 50 * p}%)`; break;
    case 'zoom': st = {transform: `scale(${1.5 - 0.5 * p})`, opacity: p, filter: `blur(${(1 - p) * 18}px)`}; break;
    case 'slideUp': st = {transform: `translateY(${(1 - p) * 100}%)`}; break;
    case 'flip': st = {transform: `perspective(2200px) rotateY(${(1 - p) * 80}deg)`, transformOrigin: 'right center', opacity: Math.min(1, p * 2)}; break;
    default: break;
  }
  return <AbsoluteFill style={st}>{children}</AbsoluteFill>;
};

/* accent sweep at each cut (varies) */
const Sweep = ({kind}) => {
  const f = useCurrentFrame();
  const p = lin(f, 0, 22, 0, 1, inout);
  if (p >= 1) return null;
  if (kind === 0) return <div style={{position: 'absolute', top: -600, left: -600 + p * 2600, width: 220, height: 3200, transform: 'rotate(22deg)', background: C.y, opacity: 0.9}} />;
  if (kind === 1) return <>{[0, 1].map((i) => { const q = Math.max(0, p - i * 0.15); return <div key={i} style={{position: 'absolute', left: 540 - 1300 * q, top: 960 - 1300 * q, width: 2600 * q, height: 2600 * q, borderRadius: '50%', border: `${30 * (1 - q)}px solid ${i ? C.blue : C.y}`, opacity: 1 - q}} />; })}</>;
  if (kind === 2) return <>{[...Array(5)].map((_, i) => <div key={i} style={{position: 'absolute', top: i * 400 - 100, left: -1200 + (p * 2600) - i * 120, width: 900, height: 26, borderRadius: 13, background: i % 2 ? C.blue : C.y, opacity: 0.85}} />)}</>;
  return <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: 0.35 * (1 - p)}} />;
};

const Fonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const defs = [];
    for (const w of [400, 700, 900]) {
      defs.push(new FontFace('Tajawal', `url(${staticFile(`fonts/tajawal-arabic-${w}-normal.woff2`)})`, {weight: String(w), unicodeRange: 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC'}));
      defs.push(new FontFace('Tajawal', `url(${staticFile(`fonts/tajawal-latin-${w}-normal.woff2`)})`, {weight: String(w), unicodeRange: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD'}));
    }
    Promise.all(defs.map((d) => d.load().then((ff) => document.fonts.add(ff)))).then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
  }, []);
  return null;
};

const Progress = () => {
  const f = useCurrentFrame();
  const p = f / TOTAL;
  const show = lin(f, 176, 196) * (1 - lin(f, cuts[cuts.length - 2], cuts[cuts.length - 2] + 16));
  return (
    <div style={{position: 'absolute', bottom: 70, left: 120, right: 120, height: 8, borderRadius: 4, background: 'rgba(31,68,194,.14)', opacity: show, direction: 'ltr'}}>
      <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${p * 100}%`, borderRadius: 4, background: `linear-gradient(270deg, ${C.y}, ${C.y2})`, boxShadow: `0 0 14px ${C.y}`}} />
      {cuts.slice(1, -1).map((c) => <div key={c} style={{position: 'absolute', right: `${(c / TOTAL) * 100}%`, top: -5, width: 18, height: 18, marginRight: -9, borderRadius: 9,
        background: f >= c ? C.y : '#C9D6FF', border: '3px solid #FFFFFF'}} />)}
    </div>
  );
};

const Badge = () => {
  const f = useCurrentFrame();
  const show = lin(f, 176, 200) * (1 - lin(f, cuts[cuts.length - 2], cuts[cuts.length - 2] + 14));
  const flip = cuts.reduce((a, c) => (f >= c && f < c + 16 ? lin(f, c, c + 16) : a), 1);
  return (
    <div style={{position: 'absolute', left: 56, top: 64, opacity: show, perspective: 600}}>
      <Logo size={112} style={{transform: `rotateY(${(1 - flip) * 360}deg)`, border: `3px solid ${C.y}`}} />
    </div>
  );
};

export const Main = () => (
  <AbsoluteFill style={{background: '#F4F8FF', direction: 'rtl'}}>
    <Fonts />
    <SfxTrack />
    <Audio src={staticFile('music.wav')} loop volume={(fr) => musicLevel(fr) * interpolate(fr, [0, 15, TOTAL - 60, TOTAL], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    {voice.map((v) => (
      <Sequence key={v.file} from={v.from} durationInFrames={v.frames} layout="none">
        <Audio src={staticFile(v.file)} volume={1} />
      </Sequence>
    ))}
    {comps.map((Comp, i) => {
      const from = cuts[i];
      const dur = cuts[i + 1] - cuts[i] + TD + 2;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <AbsoluteFill><Enter type={trans[i]}><Comp /></Enter></AbsoluteFill>
        </Sequence>
      );
    })}
    {cuts.slice(1, -1).map((c, i) => (
      <Sequence key={'s' + c} from={c} durationInFrames={24} layout="none"><AbsoluteFill style={{pointerEvents: 'none'}}><Sweep kind={i % 4} /></AbsoluteFill></Sequence>
    ))}
    <Bokeh />
    <SeaFooter from={176} to={cuts[cuts.length - 2] + 16} />
    <Badge />
    <Progress />
    <Grade />
  </AbsoluteFill>
);
