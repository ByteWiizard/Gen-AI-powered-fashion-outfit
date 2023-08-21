

import string
import numpy as np
from pathlib import Path
import requests
import pickle
import sys
import re
import gdown

def prettify_name(name):
    valid = "-_%s%s" % (string.ascii_letters, string.digits)
    return ''.join(map(lambda c : c if c in valid else '_', name))


def pad_frames(strip, pad_fract_horiz=64, pad_fract_vert=0, pad_value=None):
    dtype = strip[0].dtype
    if pad_value is None:
        if dtype in [np.float32, np.float64]:
            pad_value = 1.0
        else:
            pad_value = np.iinfo(dtype).max
    
    frames = [strip[0]]
    for frame in strip[1:]:
        if pad_fract_horiz > 0:
            frames.append(pad_value*np.ones((frame.shape[0], frame.shape[1]//pad_fract_horiz, 3), dtype=dtype))
        elif pad_fract_vert > 0:
            frames.append(pad_value*np.ones((frame.shape[0]//pad_fract_vert, frame.shape[1], 3), dtype=dtype))
        frames.append(frame)
    return frames


def download_google_drive(url, output_name):
    print('Downloading', url)
    gdown.download(url, str(output_name))

def download_generic(url, output_name):
    print('Downloading', url)
    session = requests.Session()
    r = session.get(url, allow_redirects=True)
    r.raise_for_status()

    # No encoding means raw data
    if r.encoding is None:
        with open(output_name, 'wb') as f:
            f.write(r.content)
    else:
        download_manual(url, output_name)

def download_manual(url, output_name):
    outpath = Path(output_name).resolve()
    while not outpath.is_file():
        print('Could not find checkpoint')
        print(f'Please download the checkpoint from\n{url}\nand save it as\n{outpath}')
        input('Press any key to continue...')

def download_ckpt(url, output_name):
    if 'drive.google' in url:
        download_google_drive(url, output_name)
    elif 'mega.nz' in url:
        download_manual(url, output_name)
    else:
        download_generic(url, output_name)