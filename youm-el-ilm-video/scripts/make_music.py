"""Generate the background music bed public/music.wav (uplifting I-V-vi-IV in D major, 100 BPM).

Run: python3 scripts/make_music.py [seconds] [--uniform]   (needs numpy only)

--uniform keeps the full groove (pad, arpeggio, bass, soft drums) from the first
bar to the last, so the bed sounds the same everywhere, as in the outro.
"""
import sys
import wave
import numpy as np

SR = 44100
BPM = 100
args = [a for a in sys.argv[1:] if not a.startswith('--')]
UNIFORM = '--uniform' in sys.argv
DUR = float(args[0]) if args else 67.5
beat = 60 / BPM
bar = beat * 4
n = int(SR * (DUR + 1))
L = np.zeros(n)
R = np.zeros(n)
rng = np.random.default_rng(3)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def add(sig, start, pan=0.0, gain=1.0):
    s = int(start * SR)
    if s >= n:
        return
    sig = sig[: n - s] * gain
    L[s:s + len(sig)] += sig * np.cos((pan + 1) * np.pi / 4)
    R[s:s + len(sig)] += sig * np.sin((pan + 1) * np.pi / 4)


def tone(freq, dur, harmonics=(1, 0.5, 0.25), attack=0.01, decay=3.0, detune=0.0):
    t = np.arange(int(SR * dur)) / SR
    y = sum(a * np.sin(2 * np.pi * freq * (k + 1) * (1 + detune) * t) for k, a in enumerate(harmonics))
    env = np.minimum(1, t / attack) * np.exp(-t * decay)
    return y * env


# D major: D A Bm G  (roots as MIDI)
prog = [(50, [62, 66, 69]), (45, [61, 64, 69]), (47, [62, 66, 71]), (43, [62, 67, 71])]
bars = int(np.ceil(DUR / bar))
for b in range(bars):
    t0 = b * bar
    root, chord = prog[b % 4]
    full = UNIFORM or 4 <= b < bars - 2
    fade_in = 1 if UNIFORM else min(1, (b + 1) / 4)
    # pad: soft, detuned, long attack
    for m in chord:
        for d, p in [(-0.003, -0.5), (0.003, 0.5)]:
            add(tone(hz(m), bar + 0.4, (1, 0.3, 0.12), attack=0.5, decay=0.35, detune=d), t0, p, 0.05 * fade_in)
    # pluck arpeggio in 8ths
    pattern = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 12, chord[0] + 24, chord[2] + 12, chord[1] + 12, chord[2]]
    for i, m in enumerate(pattern):
        add(tone(hz(m), 0.5, (1, 0.45, 0.2, 0.1), attack=0.004, decay=7), t0 + i * beat / 2, 0.35 * np.sin(i), 0.06 * fade_in)
    if full:
        # bass
        for i in range(4):
            add(tone(hz(root - 12), beat * 0.9, (1, 0.6, 0.2), attack=0.01, decay=2.5), t0 + i * beat, 0, 0.16)
        # kick on every beat
        for i in range(4):
            t = np.arange(int(SR * 0.3)) / SR
            k = np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-t * 30)) / SR) * np.exp(-t * 12)
            add(k, t0 + i * beat, 0, 0.35)
        # clap on 2 and 4
        for i in (1, 3):
            t = np.arange(int(SR * 0.2)) / SR
            c = rng.standard_normal(len(t)) * np.exp(-t * 25)
            c = np.convolve(c, np.ones(3) / 3, 'same') - np.convolve(c, np.ones(30) / 30, 'same')
            add(c, t0 + i * beat, 0.1, 0.09)
        # hats on off-beats
        for i in range(8):
            t = np.arange(int(SR * 0.06)) / SR
            h = rng.standard_normal(len(t))
            h = (h - np.convolve(h, np.ones(6) / 6, 'same')) * np.exp(-t * 70)
            add(h, t0 + i * beat / 2 + beat / 4, -0.3 if i % 2 else 0.3, 0.035)

out = np.stack([L, R], 1)[: int(SR * DUR)]
fade = int(SR * 3)
out[-fade:] *= np.linspace(1, 0, fade)[:, None]
out[: int(SR * (1.0 if UNIFORM else 0.5))] *= np.linspace(0, 1, int(SR * (1.0 if UNIFORM else 0.5)))[:, None]
out = out / np.abs(out).max() * 0.85
with wave.open('public/music.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print('music.wav', DUR, 's')
