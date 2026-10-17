"""Generate the voiceover, one clip per scene, and register it in src/voice.json.

Uses Microsoft's neural voices through edge-tts (needs internet). A sentence is
sped up slightly (at most --max-boost percent) if it overruns its scene; when
that is not enough the scene itself is lengthened, so the voice stays natural.

    python3 -m venv ~/tts && ~/tts/bin/pip install edge-tts mutagen
    ~/tts/bin/python scripts/make_voice.py                    # Tunisian male voice
    ~/tts/bin/python scripts/make_voice.py --voice ar-TN-ReemNeural   # female

Edit the sentences in scripts/voice_lines.json, then run the script again.
"""
import argparse
import asyncio
import json
import os

import edge_tts
from mutagen.mp3 import MP3

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEAD_IN = 8     # frames of silence at the start of each scene
TAIL = 14       # frames kept free before the next scene


async def synth(text, voice, rate, pitch, out):
    await edge_tts.Communicate(text, voice, rate=f'{rate:+d}%', pitch=pitch).save(out)
    return MP3(out).info.length


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default='ar-TN-HediNeural')
    ap.add_argument('--rate', type=int, default=0, help='base speed in percent, e.g. -5 or 10')
    ap.add_argument('--pitch', default='+0Hz')
    ap.add_argument('--max-boost', type=int, default=15, help='most a sentence may be sped up, in percent')
    args = ap.parse_args()

    cfg = json.load(open(os.path.join(ROOT, 'scripts', 'voice_lines.json'), encoding='utf-8'))
    fps, cuts = cfg['fps'], cfg['cuts']
    os.makedirs(os.path.join(ROOT, 'public', 'voice'), exist_ok=True)
    clips, new_cuts = [], [0]
    for i, text in enumerate(cfg['lines']):
        base_len = cuts[i + 1] - cuts[i]
        slot = (base_len - LEAD_IN - TAIL) / fps
        name = f'voice/{i + 1:02d}.mp3'
        out = os.path.join(ROOT, 'public', name)
        rate = args.rate
        dur = await synth(text, args.voice, rate, args.pitch, out)
        while dur > slot and rate < args.rate + args.max_boost:
            rate += 5
            dur = await synth(text, args.voice, rate, args.pitch, out)
        frames = int(dur * fps) + 1
        scene_len = max(base_len, LEAD_IN + frames + TAIL)
        start = new_cuts[-1]
        new_cuts.append(start + scene_len)
        note = f'  scene +{(scene_len - base_len) / fps:.1f}s' if scene_len > base_len else ''
        print(f'{i + 1:2d}  {dur:5.2f}s  rate {rate:+d}%{note}')
        clips.append({'file': name, 'from': start + LEAD_IN, 'frames': frames})
    with open(os.path.join(ROOT, 'src', 'voice.json'), 'w', encoding='utf-8') as f:
        json.dump({'cuts': new_cuts, 'clips': clips}, f, indent=1)
    print(f'video length {new_cuts[-1] / fps:.1f}s; wrote src/voice.json; preview with: npm start')


asyncio.run(main())
