import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="dpezsckqq",
    api_key="949446525952659",
    api_secret="PRr_DPc4R9fUAiJZOxB0WSLXXrs"
)

video_files = [
    ("assets/images/bg12zo.mp4", "luckkana/bg12zo"),
    ("assets/images/bgindex3.mp4", "luckkana/bgindex3"),
    ("assets/images/loadd.mp4", "luckkana/loadd"),
    ("assets/images/chinese-zodiac/Chnbg1.mp4", "luckkana/chinese-zodiac/Chnbg1"),
    ("assets/images/simsy/symsibg1.mp4", "luckkana/simsy/symsibg1"),
    ("assets/images/simsy/\u0e01\u0e34\u0e49\u0e07\u0e01\u0e49\u0e32\u0e19\u0e43\u0e1a.mp4", "luckkana/simsy/kingkanbia"),
    ("assets/images/social-proof/bgs4.mp4", "luckkana/social-proof/bgs4"),
    ("assets/images/social-proof/bgs5.mov", "luckkana/social-proof/bgs5"),
]

for local_path, public_id in video_files:
    print(f"Uploading {local_path} -> {public_id} ...")
    try:
        result = cloudinary.uploader.upload(
            local_path,
            public_id=public_id,
            resource_type="video",
            overwrite=True
        )
        print(f"  OK: {result['secure_url']}")
    except Exception as e:
        print(f"  FAILED: {e}")

print("\nAll done!")
