#!/usr/bin/env python3
"""Local media validation and lossless-framing delivery copies for social posts."""
import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / 'automation' / 'media_cache'
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic', '.bmp', '.tif', '.tiff'}
VIDEO_EXTENSIONS = {'.mp4', '.mov', '.m4v', '.webm', '.mkv', '.avi'}
FFMPEG = '/opt/homebrew/bin/ffmpeg'
FFPROBE = '/opt/homebrew/bin/ffprobe'
PLATFORMS = ('facebook', 'instagram', 'linkedin')


def atomic_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd, name = tempfile.mkstemp(prefix='.' + path.name, dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as f:
            json.dump(value, f, ensure_ascii=False, indent=2)
            f.flush()
            os.fsync(f.fileno())
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)


def digest_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def source_path(value):
    path = Path(value).resolve(strict=True)
    allowed = (ROOT / 'billeder', ROOT / 'videoer')
    if not any(path.is_relative_to(parent) for parent in allowed):
        raise ValueError('Mediet skal ligge i billeder eller videoer.')
    if not path.is_file() or path.stat().st_size == 0:
        raise ValueError('Mediefilen mangler eller er tom.')
    if path.suffix.lower() not in IMAGE_EXTENSIONS | VIDEO_EXTENSIONS:
        raise ValueError('Ikke et understottet billed- eller videoformat.')
    return path


def probe(path):
    result = subprocess.run(
        [FFPROBE, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)],
        capture_output=True, text=True, timeout=60, check=True,
    )
    info = json.loads(result.stdout)
    video = next((s for s in info['streams'] if s['codec_type'] == 'video'), None)
    if not video or not video.get('width') or not video.get('height'):
        raise ValueError('Mediet har ingen gyldig billedstrom.')
    return {
        'width': video['width'], 'height': video['height'],
        'codec': video['codec_name'], 'pixel_format': video.get('pix_fmt'),
        'fps': video.get('avg_frame_rate'),
        'duration': float(info.get('format', {}).get('duration', 0)),
        'audio': [s['codec_name'] for s in info['streams'] if s['codec_type'] == 'audio'],
    }


def prepare(value, platform):
    if platform not in PLATFORMS:
        raise ValueError('Ukendt platform.')
    path = source_path(value)
    kind = 'video' if path.suffix.lower() in VIDEO_EXTENSIONS else 'image'
    fingerprint = digest_file(path)
    key = hashlib.sha256(('media-v1:' + platform + ':' + fingerprint).encode()).hexdigest()
    CACHE.mkdir(parents=True, exist_ok=True, mode=0o700)
    target = CACHE / (key + ('.mp4' if kind == 'video' else '.jpg'))
    meta_path = CACHE / (key + '.json')
    info = probe(path)
    if kind == 'video' and not 3 <= info['duration'] <= 900:
        raise ValueError('Videoen skal vaere mellem 3 sekunder og 15 minutter; originalen bliver ikke klippet.')
    if not (target.exists() and meta_path.exists()):
        temporary = CACHE / (key + '.' + str(os.getpid()) + '.tmp' + target.suffix)
        base = [FFMPEG, '-nostdin', '-v', 'error', '-y', '-i', str(path)]
        if kind == 'image':
            # Fit, never crop: Instagram needs JPEG and an aspect ratio of 4:5..1.91:1.
            w, h = info['width'], info['height']
            canvas_w, canvas_h = max(w, math.ceil(h * .8)), max(h, math.ceil(w / 1.91))
            factor = min(1, 1080 / canvas_w, 1350 / canvas_h)
            cw, ch = max(2, round(canvas_w * factor)), max(2, round(canvas_h * factor))
            sw, sh = max(1, round(w * factor)), max(1, round(h * factor))
            filt = f'scale={sw}:{sh},pad={cw}:{ch}:(ow-iw)/2:(oh-ih)/2:white,setsar=1'
            command = base + ['-vf', filt, '-frames:v', '1', '-q:v', '2', '-pix_fmt', 'yuvj420p', '-update', '1', str(temporary)]
        else:
            w, h = info['width'], info['height']
            if platform == 'facebook' and w / h < .8 and info['duration'] <= 90:
                # Reels must be truly 9:16. Padding keeps every embedded word visible.
                filt = 'scale=1080:1920:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:0x1F3A2E,setsar=1'
            else:
                filt = 'scale=1920:1920:force_original_aspect_ratio=decrease:force_divisible_by=2:reset_sar=1'
                # Do not upscale the original just to reach a nominal resolution.
                factor = min(1, 1920 / w, 1920 / h)
                filt = f'scale={max(2, int(w*factor)//2*2)}:{max(2, int(h*factor)//2*2)},setsar=1'
            command = base + ['-map', '0:v:0', '-map', '0:a:0?', '-vf', filt,
                '-c:v', 'libx264', '-preset', 'fast', '-crf', '19', '-profile:v', 'high',
                '-pix_fmt', 'yuv420p', '-r', '30', '-g', '60', '-maxrate', '12M', '-bufsize', '24M',
                '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '128k',
                '-movflags', '+faststart', '-map_metadata', '-1', str(temporary)]
        try:
            subprocess.run(command, capture_output=True, check=True, timeout=1800)
            output = probe(temporary)
            limit = 8 * 1024**2 if kind == 'image' else 1024**3
            if temporary.stat().st_size > limit:
                raise ValueError('Uploadkopien overskrider platformens filgraense.')
            os.replace(temporary, target)
            atomic_json(meta_path, {'source_sha256': fingerprint, 'output': output})
        finally:
            temporary.unlink(missing_ok=True)
    output = json.loads(meta_path.read_text())['output']
    return {'media_path': str(path), 'prepared_path': str(target), 'media_type': kind,
            'media_id': str(path.relative_to(ROOT)), 'sha256': fingerprint,
            'source': info, 'output': output, 'bytes': target.stat().st_size,
            'platform': platform}


def inventory():
    result = []
    for category in ('integrationer', 'automatisering', 'b2b-portaler', 'custom-bc-apps', 'workflows'):
        for folder in (ROOT / 'billeder' / category, ROOT / 'videoer' / category):
            if not folder.exists():
                continue
            for path in sorted(folder.rglob('*')):
                if path.is_file() and not path.is_symlink() and path.suffix.lower() in IMAGE_EXTENSIONS | VIDEO_EXTENSIONS:
                    result.append({'path': str(path), 'category': category,
                        'kind': 'video' if path.suffix.lower() in VIDEO_EXTENSIONS else 'image',
                        'bytes': path.stat().st_size})
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['inventory', 'prepare', 'audit'])
    parser.add_argument('--platform', choices=PLATFORMS, default='instagram')
    parser.add_argument('--file')
    parser.add_argument('--report')
    args = parser.parse_args()
    if args.command == 'inventory':
        result = inventory()
    elif args.command == 'prepare':
        result = prepare(args.file, args.platform)
    else:
        result = []
        for media in inventory():
            for platform in PLATFORMS:
                try:
                    result.append({'ok': True, 'category': media['category'], **prepare(media['path'], platform)})
                except Exception as error:
                    result.append({'ok': False, **media, 'platform': platform, 'error': str(error)})
        if args.report:
            atomic_json(args.report, result)
    print(json.dumps(result, ensure_ascii=False))
    return int(any(not item.get('ok', True) for item in result)) if isinstance(result, list) else 0


if __name__ == '__main__':
    raise SystemExit(main())
