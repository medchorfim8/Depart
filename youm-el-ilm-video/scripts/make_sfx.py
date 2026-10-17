"""Synthesize the transition sound effects into public/sfx/ (44.1 kHz stereo WAV).

Run: python3 scripts/make_sfx.py   (needs numpy only)
"""
import os
import wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)
os.makedirs('public/sfx', exist_ok=True)


def t(sec):
    return np.arange(int(SR * sec)) / SR


def svf(x, fc, q=0.7, mode='bp'):
    """State-variable filter with a per-sample cutoff (Hz)."""
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    f = 2 * np.sin(np.pi * np.clip(fc, 20, SR / 6) / SR)
    low = band = 0.0
    out = np.empty_like(x)
    for n in range(len(x)):
        high = x[n] - low - q * band
        band += f[n] * high
        low += f[n] * band
        out[n] = band if mode == 'bp' else low if mode == 'lp' else high
    return out


def env(n, attack, release, curve=2.0):
    a = int(n * attack)
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** curve
    e[a:] = np.linspace(1, 0, n - a) ** (curve * release)
    return e


def reverb(x, mix=0.25, decay=0.35):
    out = x.copy()
    for d, g in [(0.029, 0.6), (0.037, 0.5), (0.053, 0.4), (0.071, 0.3), (0.11, 0.2)]:
        k = int(SR * d)
        out[k:] += x[:-k] * g * decay
    return x * (1 - mix) + out * mix


def stereo(x, pan=None):
    if pan is None:
        pan = np.zeros_like(x)
    pan = np.broadcast_to(pan, x.shape)
    l = x * np.cos((pan + 1) * np.pi / 4)
    r = x * np.sin((pan + 1) * np.pi / 4)
    return np.stack([l, r], 1)


def save(name, st, peak=0.9):
    tail = np.zeros((int(SR * 0.05), 2))
    st = np.concatenate([st, tail])
    st = st / (np.abs(st).max() + 1e-9) * peak
    fade = min(len(st), 400)
    st[-fade:] *= np.linspace(1, 0, fade)[:, None]
    with wave.open(f'public/sfx/{name}.wav', 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())


def whoosh(dur=0.7, f0=300, f1=3200, f2=600, pan=(-0.8, 0.8), q=0.9):
    x = rng.standard_normal(int(SR * dur))
    n = len(x)
    p = np.linspace(0, 1, n)
    fc = np.where(p < 0.55, f0 + (f1 - f0) * (p / 0.55) ** 1.5, f1 + (f2 - f1) * ((p - 0.55) / 0.45))
    y = svf(x, fc, q) * env(n, 0.55, 1.2)
    return stereo(reverb(y, 0.2), np.linspace(*pan, n))


def pop(f0=900, f1=180, dur=0.16):
    tt = t(dur)
    freq = f1 + (f0 - f1) * np.exp(-tt * 40)
    y = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-tt * 28)
    y += svf(rng.standard_normal(len(tt)), 4000, 1.2) * np.exp(-tt * 120) * 0.4
    return stereo(reverb(y, 0.15))


def chime(notes=(1046.5, 1318.5, 1568.0), gap=0.07, dur=1.2):
    n = int(SR * dur)
    y = np.zeros(n)
    for i, fr in enumerate(notes):
        s = int(SR * gap * i)
        tt = t(dur)[: n - s]
        tone = (np.sin(2 * np.pi * fr * tt) + 0.35 * np.sin(2 * np.pi * fr * 2.01 * tt) + 0.12 * np.sin(2 * np.pi * fr * 3.02 * tt))
        y[s:] += tone * np.exp(-tt * 4.5) * (1 - np.exp(-tt * 400))
    return stereo(reverb(y, 0.35, 0.6), np.sin(np.linspace(0, np.pi, n)) * 0.3)


def paper(flips=4, spacing=0.06):
    n = int(SR * (spacing * flips + 0.25))
    y = np.zeros(n)
    for i in range(flips):
        s = int(SR * spacing * i)
        m = int(SR * 0.09)
        burst = svf(rng.standard_normal(m), np.linspace(2500, 6000, m), 1.4) * env(m, 0.15, 1.5)
        y[s:s + m] += burst * (1 - i * 0.12)
    return stereo(reverb(y, 0.12), np.linspace(0.5, -0.5, n))


def impact(dur=0.9):
    tt = t(dur)
    freq = 45 + 110 * np.exp(-tt * 18)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-tt * 6)
    hit = svf(rng.standard_normal(len(tt)), 1800, 1.0, 'lp') * np.exp(-tt * 30)
    return stereo(reverb(body * 1.0 + hit * 0.6, 0.3, 0.5))


def riser(dur=0.6):
    x = rng.standard_normal(int(SR * dur))
    n = len(x)
    p = np.linspace(0, 1, n)
    y = svf(x, 400 + 6000 * p ** 2, 0.6) * p ** 2
    tone = np.sin(2 * np.pi * np.cumsum(200 + 900 * p ** 2) / SR) * p ** 3 * 0.3
    return stereo(reverb(y + tone, 0.25), np.linspace(-0.3, 0.3, n))


def shimmer(dur=1.6, grains=40):
    n = int(SR * dur)
    y = np.zeros(n)
    for i in range(grains):
        s = int(rng.uniform(0, 0.75) * n)
        fr = rng.choice([1568, 2093, 2349, 2637, 3136, 3520])
        m = min(int(SR * 0.5), n - s)
        tt = t(0.5)[:m]
        y[s:s + m] += np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 9) * rng.uniform(0.3, 1)
    return stereo(reverb(y * env(n, 0.1, 0.8, 1.0), 0.45, 0.7), np.sin(np.linspace(0, 6, n)) * 0.6)


def stamp():
    tt = t(0.35)
    thud = np.sin(2 * np.pi * np.cumsum(70 + 160 * np.exp(-tt * 40)) / SR) * np.exp(-tt * 14)
    slap = svf(rng.standard_normal(len(tt)), 2500, 0.8) * np.exp(-tt * 60)
    return stereo(reverb(thud + slap * 0.8, 0.15))


save('whoosh', whoosh())
save('whoosh-low', whoosh(0.8, 150, 1400, 300, (0.7, -0.7), 0.8))
save('swish', whoosh(0.35, 800, 6000, 2500, (-0.9, 0.6), 1.2))
save('swoosh-up', whoosh(0.6, 200, 5000, 4000, (0.0, 0.0), 0.7))
save('pop', pop())
save('chime', chime())
save('chime-soft', chime((784.0, 987.8), 0.09, 1.0), 0.7)
save('paper', paper())
save('paper-quick', paper(3, 0.045))
save('impact', impact())
save('riser', riser())
save('shimmer', shimmer())
save('stamp', stamp())
print('ok', sorted(os.listdir('public/sfx')))
