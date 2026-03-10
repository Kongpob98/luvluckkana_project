import os, re, glob

CLOUD_BASE = "https://res.cloudinary.com/dpezsckqq/image/upload/luckkana"
IMAGE_EXTS = {'.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'}

PATTERN = re.compile(r'(\.\./)*assets/images/([^\s"\'\)\]>]+)')

files = (
    glob.glob('pages/*.html') +
    glob.glob('css/*.css') +
    glob.glob('js/**/*.js', recursive=True)
)

total_replaced = 0

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    count = [0]

    def replace_url(m, count=count):
        relative_path = m.group(2)
        _, ext = os.path.splitext(relative_path)
        if ext.lower() not in IMAGE_EXTS:
            return m.group(0)
        count[0] += 1
        return CLOUD_BASE + "/" + relative_path

    new_content = PATTERN.sub(replace_url, content)

    if count[0] > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("OK " + filepath + " — เปลี่ยน " + str(count[0]) + " URLs")
        total_replaced += count[0]
    else:
        print("-- " + filepath + " — ไม่มีการเปลี่ยนแปลง")

print("\nเสร็จสิ้น! เปลี่ยนทั้งหมด " + str(total_replaced) + " URLs")
