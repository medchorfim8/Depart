"""Cut the diamond emblem out of public/logo.png into public/logo-emblem.png (transparent background)."""
import numpy as np
from PIL import Image, ImageFilter

im = np.array(Image.open('public/logo.png').convert('RGB')).astype(int)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
yellow = (r > 200) & (g > 140) & (b < 120)
h, w = yellow.shape
cx = w // 2
ys = np.where(yellow[:, cx])[0]
top, bottom = ys.min(), ys.max()
cy = (top + bottom) / 2
half = (bottom - top) / 2
yy, xx = np.mgrid[0:h, 0:w]
diamond = (np.abs(xx - cx) + np.abs(yy - cy)) <= half
alpha = (diamond | yellow).astype(np.uint8) * 255
a = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8))
out = Image.fromarray(im.astype(np.uint8)).convert('RGBA')
out.putalpha(a)
out.save('public/logo-emblem.png')
print('diamond', cx, cy, half)
