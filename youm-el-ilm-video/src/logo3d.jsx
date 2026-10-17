import React from 'react';
import {staticFile} from 'remotion';

const EMBLEM = staticFile('logo-emblem.png');
const mask = {WebkitMaskImage: `url(${EMBLEM})`, WebkitMaskSize: '100% 100%', maskImage: `url(${EMBLEM})`, maskSize: '100% 100%'};

/*
 * The emblem as a solid 3D plate: a stack of gold silhouettes gives the
 * extruded edge, the logo sits on the front and (mirrored) on the back, and a
 * light sweep follows the rotation so it reads as polished metal.
 */
export const Logo3D = ({size = 420, depth = 44, layers = 28, rx = 0, ry = 0, rz = 0, shine = 0}) => {
  const step = depth / layers;
  // light catches the face when it turns toward the upper right
  const light = Math.max(0, Math.cos(((ry - 25) * Math.PI) / 180));
  const sweep = ((ry % 360) + 360) % 360 / 360;
  return (
    <div style={{width: size, height: size, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`}}>
      {[...Array(layers)].map((_, i) => {
        const t = i / (layers - 1);
        return (
          <div key={i} style={{position: 'absolute', inset: 0, ...mask,
            background: `linear-gradient(135deg, hsl(42, 95%, ${46 - t * 18}%), hsl(38, 90%, ${30 - t * 12}%))`,
            transform: `translateZ(${depth / 2 - (i + 0.5) * step}px)`}} />
        );
      })}
      {/* back face, mirrored so it reads correctly from behind */}
      <div style={{position: 'absolute', inset: 0, transform: `translateZ(${-depth / 2}px) rotateY(180deg)`, backfaceVisibility: 'hidden'}}>
        <img src={EMBLEM} style={{width: '100%', height: '100%', transform: 'scaleX(-1)'}} />
      </div>
      {/* front face */}
      <div style={{position: 'absolute', inset: 0, transform: `translateZ(${depth / 2}px)`, backfaceVisibility: 'hidden'}}>
        <img src={EMBLEM} style={{width: '100%', height: '100%', filter: `brightness(${0.86 + light * 0.18})`}} />
        <div style={{position: 'absolute', inset: 0, ...mask, overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: '-50%', left: `${-60 + (sweep + shine) % 1 * 220}%`, width: '35%', height: '200%', transform: 'rotate(25deg)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))'}} />
        </div>
      </div>
    </div>
  );
};
