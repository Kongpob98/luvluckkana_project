#!/usr/bin/env python3
import fitz, re, json  # fitz = PyMuPDF

doc = fitz.open('/Users/kongk/Downloads/ใบเซียมซี.pdf')

# Use dict mode: PyMuPDF groups text into blocks→lines→spans naturally
# Each line is a visually contiguous row of text, so we can join spans within a line
text_lines = []
for page in doc:
    blocks = page.get_text('dict')['blocks']
    for block in blocks:
        if block.get('type') != 0:  # 0 = text block
            continue
        for line in block['lines']:
            line_text = ''.join(span['text'] for span in line['spans']).strip()
            if line_text:
                text_lines.append(line_text)

# Join all lines with empty string (Thai line-wraps are visual only, not word boundaries)
# then normalize multiple spaces (from within-line spaces that are intentional)
full_text = ''.join(text_lines)
full_text = re.sub(r' {2,}', ' ', full_text)

slips = {}
parts = re.split(r'(?=ใบที่\s*\d+\s*:)', full_text)
for part in parts:
    m = re.match(r'ใบที่\s*(\d+)\s*:\s*([^(]+)\(([^)]+)\)', part)
    if not m:
        continue
    num = int(m.group(1))
    title = m.group(2).strip()
    level = m.group(3).strip()

    poem_m = re.search(r'กลอน\s*:\s*(.+?)(?=ความหมาย\s*:)', part, re.DOTALL)
    poem = poem_m.group(1).strip() if poem_m else ''
    poem = re.sub(r'\s+', ' ', poem).strip()

    meaning_m = re.search(r'ความหมาย\s*:\s*(.+?)(?=ใบที่\s*\d+|$)', part, re.DOTALL)
    meaning = meaning_m.group(1).strip() if meaning_m else ''
    meaning = re.sub(r'\s+', ' ', meaning).strip()

    slips[num] = {
        'title': title,
        'level': level,
        'poem': poem,
        'meaning': meaning
    }

print(f'พบ {len(slips)} ใบ')
for k in sorted(slips.keys()):
    s = slips[k]
    print(f'ใบ {k}: {s["title"]} ({s["level"]})')

out_path = '/Users/kongk/LUCKKANAPro/data/simsy_slips.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(slips, f, ensure_ascii=False, indent=2)
print(f'\nบันทึกแล้ว: {out_path}')
