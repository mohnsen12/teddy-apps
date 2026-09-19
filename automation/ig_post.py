#!/usr/bin/env python3
"""instagram image/video uploader; supports --dry-run and --upload-only."""
from social_upload import main

if __name__ == '__main__':
    raise SystemExit(main('instagram'))
