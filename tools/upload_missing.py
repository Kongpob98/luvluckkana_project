#!/usr/bin/env python3
"""Upload missing images to Cloudinary."""
import cloudinary
import cloudinary.uploader
import cloudinary.api
import os

cloudinary.config(
    cloud_name='dpezsckqq',
    api_key='949446525952659',
    api_secret='PRr_DPc4R9fUAiJZOxB0WSLXXrs'
)

# Get existing Cloudinary IDs
print("Fetching existing Cloudinary resources...")
result = cloudinary.api.resources(type='upload', prefix='luckkana', max_results=500)
existing = set(r['public_id'] for r in result['resources'])
print(f"Found {len(existing)} existing resources")

IMAGE_EXTS = {'.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'}
base = 'assets/images'
uploaded = []
failed = []

for root, dirs, files in os.walk(base):
    for f in sorted(files):
        ext = os.path.splitext(f)[1].lower()
        if ext not in IMAGE_EXTS:
            continue
        local_path = os.path.join(root, f)
        rel_path = os.path.relpath(local_path, base)
        name_no_ext = os.path.splitext(rel_path)[0]
        public_id = 'luckkana/' + name_no_ext.replace(os.sep, '/')

        if public_id in existing:
            continue

        try:
            cloudinary.uploader.upload(
                local_path,
                public_id=public_id,
                overwrite=False,
                resource_type='image',
                use_filename=False
            )
            print(f'OK: {public_id}')
            uploaded.append(public_id)
        except Exception as e:
            print(f'FAIL: {public_id} -> {str(e)[:100]}')
            failed.append(public_id)

print(f'\nDone: {len(uploaded)} uploaded, {len(failed)} failed')
if failed:
    print("Failed:")
    for f in failed:
        print(f"  {f}")
