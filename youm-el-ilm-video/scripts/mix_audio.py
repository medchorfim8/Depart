"""Offline audio mix for the finished video: one steady music bed, the transition
effects and the narration, then the mix is put back on the rendered video.

    python3 scripts/mix_audio.py out/youm-el-ilm.mp4 out/youm-el-ilm-final.mp4

Writes out/mix.wav (full soundtrack) and out/background.wav (music bed alone).
Needs numpy and audiotsm (pip install audiotsm) and uses Remotion's ffmpeg.
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FFDIR = os.path.join(ROOT, 'node_modules', '@remotion', 'compositor-linux-x64-gnu')
FFMPEG = os.path.join(FFDIR, 'ffmpeg')
ENV = dict(os.environ, LD_LIBRARY_PATH=FFDIR)
SR, FPS = 48000, 30

# narration loudness (speech RMS) and how far below it the music sits
SPEECH_DB = -20.0
BED_BELOW_SPEECH_DB = 16.0

# keep in sync with the sfx list in src/Main.jsx: [scene, frames into scene, sound, volume]
SFX = [
    [1, 0, 'whoosh', 0.35], [2, 0, 'chime-soft', 0.3], [3, 0, 'swish', 0.32], [4, 0, 'pop', 0.35], [5, 0, 'paper', 0.4],
    [6, 0, 'shimmer', 0.3], [7, 0, 'swoosh-up', 0.32], [8, 0, 'impact', 0.42], [9, 0, 'paper-quick', 0.38], [10, 0, 'whoosh-low', 0.38],
    [0, 10, 'riser', 0.22], [0, 52, 'chime', 0.28], [1, 30, 'pop', 0.3], [7, 120, 'chime-soft', 0.22], [10, 26, 'shimmer', 0.25],
]


def load(path):
    """Decode any audio file to float32 stereo at SR."""
    tmp = os.path.join(ROOT, 'out', '.decode.wav')
    os.makedirs(os.path.dirname(tmp), exist_ok=True)
    subprocess.run([FFMPEG, '-v', 'error', '-y', '-i', path, '-ac', '2', '-ar', str(SR), '-c:a', 'pcm_s16le', tmp], check=True, env=ENV)
    with wave.open(tmp) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768
    os.remove(tmp)
    return a.reshape(-1, 2)


def save(path, a):
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(a, -1, 1) * 32767).astype('<i2').tobytes())


def rms_db(a, gate=0.01):
    m = a.mean(1)
    fr = m[: len(m) // 480 * 480].reshape(-1, 480)
    e = np.sqrt((fr ** 2).mean(1))
    e = e[e > gate]
    return 20 * np.log10(np.sqrt((e ** 2).mean()) + 1e-9)


def fit(clip, frames):
    """Gently time-compress a clip (WSOLA, pitch kept) when it runs past its slot, by at most 8%."""
    target = int(frames / FPS * SR)
    if len(clip) <= target:
        return clip
    from audiotsm import wsola
    from audiotsm.io.array import ArrayReader, ArrayWriter
    speed = min(1.08, len(clip) / target)
    reader, writer = ArrayReader(clip.T.copy()), ArrayWriter(2)
    wsola(2, speed=speed).run(reader, writer)
    print(f'   fitted to slot: speed x{speed:.3f}')
    return writer.data.T


def main():
    video, out_video = sys.argv[1], sys.argv[2]
    tl = json.load(open(os.path.join(ROOT, 'src', 'voice.json'), encoding='utf-8'))
    cuts, clips = tl['cuts'], tl['clips']
    n = int(cuts[-1] / FPS * SR)

    # 1. steady music bed: same groove everywhere, one level, fades only at the ends
    bed = load(os.path.join(ROOT, 'public', 'music.wav'))
    if len(bed) < n:
        sys.exit('public/music.wav is shorter than the video; run scripts/make_music.py <seconds> --uniform')
    bed = bed[:n].copy()
    bed *= 10 ** ((SPEECH_DB - BED_BELOW_SPEECH_DB - rms_db(bed, 0.001)) / 20)
    fade_in, fade_out = int(1.0 * SR), int(2.5 * SR)
    bed[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
    bed[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None]

    # 2. transition effects
    fx = np.zeros((n, 2), np.float32)
    for scene, off, name, vol in SFX:
        s = load(os.path.join(ROOT, 'public', 'sfx', f'{name}.wav')) * vol
        at = max(0, int((cuts[scene] + off - 3) / FPS * SR))
        e = min(n, at + len(s))
        fx[at:e] += s[: e - at]

    # 3. narration, levelled to the same loudness
    vo = np.zeros((n, 2), np.float32)
    for c in clips:
        v = load(os.path.join(ROOT, 'public', c['file']))
        v *= 10 ** ((SPEECH_DB - rms_db(v)) / 20)
        nxt = [x for x in cuts if x > c['from']]
        slot = (nxt[0] - c['from'] - 6) if nxt else c['frames']
        print(f"{c['file']}  {len(v) / SR:5.2f}s  slot {slot / FPS:5.2f}s")
        v = fit(v, slot)
        at = int(c['from'] / FPS * SR)
        e = min(n, at + len(v))
        vo[at:e] += v[: e - at]

    mix = bed + fx + vo
    peak = np.abs(mix).max()
    if peak > 0.97:
        mix *= 0.97 / peak
    os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
    save(os.path.join(ROOT, 'out', 'background.wav'), bed)
    save(os.path.join(ROOT, 'out', 'mix.wav'), mix)
    print(f'bed {rms_db(bed, 0.001):.1f} dB, speech {rms_db(vo):.1f} dB, peak {20 * np.log10(np.abs(mix).max()):.1f} dB')

    subprocess.run([FFMPEG, '-v', 'error', '-y', '-i', video, '-i', os.path.join(ROOT, 'out', 'mix.wav'), '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', out_video], check=True, env=ENV)
    print('wrote', out_video)


main()
