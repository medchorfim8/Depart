import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig, random, spring} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

/* studio lighting so gold reads as polished metal */
const Env = () => {
  const {gl, scene} = useThree();
  const env = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    return pm.fromScene(new RoomEnvironment(), 0.04).texture;
  }, [gl]);
  scene.environment = env;
  return null;
};

export const Stage3D = ({children, camZ = 9, fov = 35}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={{position: [0, 0, camZ], fov}} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <Env />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={1.6} />
      <directionalLight position={[-5, 2, 3]} intensity={0.6} color="#9DB2FF" />
      {children}
    </ThreeCanvas>
  );
};

const GOLD = {color: '#FFC23A', metalness: 1, roughness: 0.2, envMapIntensity: 1.3};
const NAVY = {color: '#16297A', metalness: 0.3, roughness: 0.45};

/* trophy cup built from a lathe profile, handles, stem and a two-step base */
export const Trophy = ({scale = 1, rotY = 0, position = [0, 0, 0]}) => {
  const cup = useMemo(() => {
    const pts = [[0, 0], [0.18, 0.02], [0.32, 0.12], [0.52, 0.4], [0.68, 0.8], [0.76, 1.2], [0.8, 1.55], [0.86, 1.62], [0.8, 1.64]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  return (
    <group position={position} scale={scale} rotation={[0.08, rotY, 0]}>
      <mesh geometry={cup} position={[0, 0.25, 0]}><meshStandardMaterial {...GOLD} side={THREE.DoubleSide} /></mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.78, 1.25, 0]} rotation={[0, 0, s > 0 ? -Math.PI / 2 : Math.PI / 2]}>
          <torusGeometry args={[0.32, 0.07, 18, 40, Math.PI]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.1, 0.14, 0.5, 32]} /><meshStandardMaterial {...GOLD} /></mesh>
      <mesh position={[0, -0.28, 0]}><sphereGeometry args={[0.17, 32, 16]} /><meshStandardMaterial {...GOLD} /></mesh>
      <mesh position={[0, -0.52, 0]}><cylinderGeometry args={[0.5, 0.6, 0.18, 48]} /><meshStandardMaterial {...GOLD} /></mesh>
      <mesh position={[0, -0.82, 0]}><boxGeometry args={[1.35, 0.45, 1.0]} /><meshStandardMaterial {...NAVY} /></mesh>
      <mesh position={[0, -0.82, 0.505]}><boxGeometry args={[0.9, 0.2, 0.02]} /><meshStandardMaterial {...GOLD} /></mesh>
      <mesh position={[0, -1.12, 0]}><boxGeometry args={[1.6, 0.16, 1.2]} /><meshStandardMaterial {...NAVY} /></mesh>
    </group>
  );
};

/* graduation mortarboard with tassel */
export const Cap = ({scale = 1, position = [0, 0, 0], rotation = [0, 0, 0]}) => (
  <group position={position} scale={scale} rotation={rotation}>
    <mesh rotation={[0, Math.PI / 4, 0]}><boxGeometry args={[1.9, 0.08, 1.9]} /><meshStandardMaterial {...NAVY} /></mesh>
    <mesh position={[0, -0.32, 0]}><cylinderGeometry args={[0.62, 0.7, 0.56, 40]} /><meshStandardMaterial {...NAVY} /></mesh>
    <mesh position={[0, 0.07, 0]}><sphereGeometry args={[0.09, 20, 10]} /><meshStandardMaterial {...GOLD} /></mesh>
    <mesh position={[0.6, -0.12, 0.6]} rotation={[0.2, 0, -0.25]}><cylinderGeometry args={[0.025, 0.025, 0.5, 8]} /><meshStandardMaterial {...GOLD} /></mesh>
    <mesh position={[0.66, -0.42, 0.66]}><coneGeometry args={[0.09, 0.26, 16]} /><meshStandardMaterial {...GOLD} /></mesh>
  </group>
);

const starShape = (r1 = 0.5, r2 = 0.22) => {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? r2 : r1, a = Math.PI / 2 + (i * Math.PI) / 5;
    i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  return s;
};
export const Star = ({scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], color}) => {
  const geo = useMemo(() => new THREE.ExtrudeGeometry(starShape(), {depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3}), []);
  return <mesh geometry={geo} position={position} scale={scale} rotation={rotation}><meshStandardMaterial {...GOLD} color={color || GOLD.color} /></mesh>;
};

export const Coin = ({scale = 1, position = [0, 0, 0], rotation = [0, 0, 0]}) => (
  <group position={position} scale={scale} rotation={rotation}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.5, 0.5, 0.09, 56]} /><meshStandardMaterial {...GOLD} /></mesh>
    {[1, -1].map((s) => <mesh key={s} position={[0, 0, s * 0.047]}><torusGeometry args={[0.4, 0.025, 10, 48]} /><meshStandardMaterial {...GOLD} color="#E5A400" /></mesh>)}
  </group>
);

/* medal: gold disc with a star, hung on a blue ribbon */
export const Medal = ({scale = 1, position = [0, 0, 0], swing = 0, rotY = 0}) => (
  <group position={position} scale={scale} rotation={[0, 0, swing]}>
    <mesh position={[-0.28, 1.0, -0.02]} rotation={[0, 0, -0.32]}><boxGeometry args={[0.42, 1.5, 0.03]} /><meshStandardMaterial color="#4F6FE8" roughness={0.5} /></mesh>
    <mesh position={[0.28, 1.0, -0.04]} rotation={[0, 0, 0.32]}><boxGeometry args={[0.42, 1.5, 0.03]} /><meshStandardMaterial color="#1F44C2" roughness={0.5} /></mesh>
    <group rotation={[0, rotY, 0]}>
      <Coin scale={1.6} />
      <Star scale={0.95} position={[0, 0, 0.06]} color="#FFE08A" />
    </group>
  </group>
);

const CONFETTI_COLORS = ['#FFC72C', '#1F44C2', '#FF6F91', '#2EC4B6', '#6E8BFF', '#FFB000'];
/* falling paper confetti; start = frame where it begins, burst = shoot up first */
export const Confetti3D = ({n = 90, start = 0, burst = false, spread = 9}) => {
  const f = useCurrentFrame() - start;
  if (f < 0) return null;
  const t = f / 30;
  return (
    <>
      {[...Array(n)].map((_, i) => {
        const r = (k) => random(`c3-${i}-${k}`);
        let x = (r('x') - 0.5) * spread, y, z = (r('z') - 0.5) * 4;
        if (burst) {
          const vx = (r('vx') - 0.5) * 9, vy = 7 + r('vy') * 7;
          x = vx * t; y = -5 + vy * t - 7 * t * t;
          if (y < -7) return null;
        } else {
          y = 7 - ((t * (1.2 + r('v') * 1.4) + r('y') * 14) % 14);
        }
        x += Math.sin(t * 2 + i) * 0.3;
        return (
          <mesh key={i} position={[x, y, z]} rotation={[t * (2 + r('a') * 4), t * (1 + r('b') * 3), r('c') * 6]}>
            <planeGeometry args={[0.18, 0.1]} />
            <meshStandardMaterial color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]} side={THREE.DoubleSide} roughness={0.6} metalness={0.1} />
          </mesh>
        );
      })}
    </>
  );
};

/* caps thrown in the air, the classic graduation moment */
export const CapToss = ({start = 0, n = 6}) => {
  const f = useCurrentFrame() - start;
  if (f < 0) return null;
  const t = f / 30;
  return (
    <>
      {[...Array(n)].map((_, i) => {
        const r = (k) => random(`ct-${i}-${k}`);
        const delay = r('d') * 0.4;
        const tt = Math.max(0, t - delay);
        const x = (i - (n - 1) / 2) * 1.3 + (r('vx') - 0.5) * 1.5 * tt;
        const y = -6 + (11 + r('vy') * 3) * tt - 6.5 * tt * tt;
        return <Cap key={i} scale={0.32 + r('s') * 0.12} position={[x * 0.75, y, -2.5 + r('z') * 1.2]} rotation={[0.5 + tt * (2 + r('a') * 3), tt * 3 * (r('b') - 0.5), tt * 2 * (r('c') - 0.5)]} />;
      })}
    </>
  );
};

export const useEntry = (delay = 0, cfg = {damping: 12, stiffness: 80}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: cfg});
};
