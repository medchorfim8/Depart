"""Generate the voiceover, one clip per scene, and register it in src/voice.json.

Uses Microsoft's neural voices through edge-tts (needs internet). Each sentence
is sped up a little if needed so it ends before its scene does.

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
    args = ap.parse_args()

    cfg = json.load(open(os.path.join(ROOT, 'scripts', 'voice_lines.json'), encoding='utf-8'))
    fps, cuts = cfg['fps'], cfg['cuts']
    os.makedirs(os.path.join(ROOT, 'public', 'voice'), exist_ok=True)
    clips = []
    for i, text in enumerate(cfg['lines']):
        start = cuts[i] + LEAD_IN
        slot = (cuts[i + 1] - TAIL - start) / fps
        name = f'voice/{i + 1:02d}.mp3'
        out = os.path.join(ROOT, 'public', name)
        rate = args.rate
        dur = await synth(text, args.voice, rate, args.pitch, out)
        while dur > slot and rate < args.rate + 35:
            rate += 5
            dur = await synth(text, args.voice, rate, args.pitch, out)
        flag = '' if dur <= slot else '  <-- still too long, shorten this sentence'
        print(f'{i + 1:2d}  {dur:5.2f}s / {slot:5.2f}s  rate {rate:+d}%{flag}')
        clips.append({'file': name, 'from': start, 'frames': int(dur * fps) + 1})
    with open(os.path.join(ROOT, 'src', 'voice.json'), 'w', encoding='utf-8') as f:
        json.dump(clips, f, indent=1)
    print('wrote src/voice.json; preview with: npm start')


asyncio.run(main())
