# API + Chatbot + Birthday Flow

เอกสารนี้สรุปการเชื่อมต่อ API และลำดับการทํางานของ 2 หน้าหลัก:
- หน้า Chatbot
- หน้า Birthday Fortune

อ้างอิงจากโค้ดปัจจุบันในโปรเจกต์ `LUCKKANAPro`.

## 1) ภาพรวมสถาปัตยกรรม

ระบบใช้แนวคิด Frontend -> Serverless API -> Gemini API

```text
Browser (chatbot / birthday)
	-> /api/gemini (Vercel Serverless)
		-> Google Gemini generateContent
	<- response JSON
<- render result on page
```

### ไฟล์หลัก
- Serverless API: `api/gemini.js`
- Chatbot logic: `js/components/chatbot.js`
- Birthday logic: `js/components/birthday-fortune-form.js`
- Chatbot page: `pages/chatbot.html`
- Birthday page: `pages/birthday-fortune.html`

## 2) API Gateway (`/api/gemini`)

### หน้าที่
- รับ request จากหน้าเว็บ
- ตรวจ method / validate payload
- อ่าน `GEMINI_API_KEY` จาก environment
- ส่งต่อไป Gemini และคืนผลลัพธ์กลับ frontend

### Request ที่รองรับ
- Method: `POST`
- Body (JSON):

```json
{
	"message": "prompt text",
	"model": "gemini-2.5-flash-lite"
}
```

### Response
- Success: ส่ง payload ที่ได้จาก Gemini กลับทั้งก้อน
- Error: ส่ง status ตามสาเหตุ เช่น `400`, `405`, `500`

### หมายเหตุ
- มี CORS headers ใน API function
- รองรับ preflight `OPTIONS`

## 3) โหมดการเรียก API (Production vs Development)

ทั้ง Chatbot และ Birthday ใช้ logic ใกล้กัน:
- ถ้า production (`hostname != localhost/127.0.0.1`) -> ใช้ `/api/gemini`
- ถ้า development -> มีทางเลือกยิงตรง Gemini ด้วย key ฝั่ง client

## 4) Flow หน้า Chatbot

### จุดเริ่มต้น
- โหลดหน้า `pages/chatbot.html`
- โหลด knowledge base scripts ก่อน chatbot component

### ลําดับการทํางาน
1. ผู้ใช้ส่งข้อความจาก input หรือ quick suggestion
2. UI แสดงข้อความผู้ใช้ + typing indicator
3. ตรวจ guardrail ว่าคําถามอยู่ในขอบเขตโหราศาสตร์หรือไม่
4. ถ้าอยู่ในขอบเขต -> ดึงความรู้จาก knowledge base (RAG style)
5. ประกอบ prompt และเรียก Gemini
6. รับผลลัพธ์แล้วแสดงในกล่องแชต
7. บันทึก log การเรียก API ลง `localStorage` (เพื่อ monitor/debug)

### ความสามารถเสริมที่มีอยู่
- Guardrail คําถามนอกเรื่อง
- Debug mode (console logs ละเอียด)
- API usage logging ใน browser storage

## 5) Flow หน้า Birthday Fortune

### จุดเริ่มต้น
- โหลดหน้า `pages/birthday-fortune.html`
- เรียก `js/components/birthday-fortune-form.js`

### ลําดับการทํางาน
1. เตรียม state วันเกิด/เดือน/ปี/เวลาเกิด
2. รองรับ dropdown ปี/เดือน + date slider + weekday picker
3. persist state ลง `sessionStorage` เพื่อคืนค่าเดิมใน tab เดิม
4. ผู้ใช้กรอกชื่อ/นามสกุล + เวลาเกิด แล้วกด submit
5. validate ฟอร์ม
6. สร้าง prompt เพื่อให้ Gemini ตอบกลับเป็น JSON โครงสร้างที่กําหนด
7. เรียก API (production ผ่าน `/api/gemini`)
8. parse JSON ผลลัพธ์
9. แสดงผล Section 3 และ Section 4
10. เก็บผลดวงลง `localStorage` (`fortuneData`)

### โครงสร้างผลลัพธ์ที่คาดหวังจาก AI
- `luckyColors` (3 รายการ)
- `luckyDirection`
- `weeklyFortune` (love/money/career/health)
- `weeklyWarning`
- `luckyCalendar` (7 วัน)

## 6) Data Persistence ที่ใช้

### Chatbot
- `localStorage`: เก็บ API logs

### Birthday
- `sessionStorage`: เก็บ state ฟอร์มระหว่างรีเฟรชใน tab เดิม
- `localStorage`: เก็บผลดวงล่าสุด (`fortuneData`)

## 7) จุดที่ควรระวังด้าน Security

ปัจจุบันโปรเจกต์ยังมี `js/config.js` ที่เก็บ API key ฝั่ง client (development path)

ข้อแนะนํา:
1. ใช้ `/api/gemini` เป็นเส้นทางเดียวทุก environment
2. เก็บ key เฉพาะใน Vercel Environment Variables
3. ไม่ commit key จริงใน repository

## 8) Sequence Diagram (ย่อ)

### Chatbot
```text
User -> chatbot.js: send message
chatbot.js -> guardrail + knowledge lookup
chatbot.js -> /api/gemini
/api/gemini -> Gemini API
Gemini API -> /api/gemini -> chatbot.js
chatbot.js -> UI: render answer
```

### Birthday
```text
User -> birthday-fortune-form.js: submit form
birthday-fortune-form.js -> build structured prompt
birthday-fortune-form.js -> /api/gemini
/api/gemini -> Gemini API
Gemini API -> /api/gemini -> birthday-fortune-form.js
birthday-fortune-form.js -> parse JSON -> render sections
```

## 9) ตัวอย่าง Prompt

### 9.1 ตัวอย่าง Prompt สำหรับหน้า Chatbot

ตัวอย่างข้อความที่ผู้ใช้พิมพ์ได้ทันที:
- ช่วยทำนายดวงความรักของฉันในเดือนนี้ (ฉันเกิดวันศุกร์)
- ฉันฝันเห็นงูเมื่อคืนนี้ แปลว่าอะไร
- เลข 8 ส่งผลต่อการเงินและงานของฉันอย่างไร
- อยากเปลี่ยนชื่อเพื่อเสริมงาน ควรเน้นเลขอะไร

ตัวอย่างข้อความที่ระบบประกอบส่งให้โมเดล (ย่อ):

```text
คุณคือ AI ผู้นำทางจิตวิญญาณ...

=== ข้อมูลที่เกี่ยวข้อง ===
...knowledge ที่ดึงมา...

คำถาม: ทำนายดวงความรักของฉันเดือนนี้
```

ตัวอย่าง payload ที่ส่งไป `/api/gemini`:

```json
{
	"message": "คุณคือ AI ผู้นำทางจิตวิญญาณ...\n\nคำถาม: ทำนายดวงความรักของฉันเดือนนี้",
	"model": "gemini-2.5-flash-lite"
}
```

Prompt template ที่ใช้จริงในหน้า Chatbot (ก่อนแทนค่าด้วย knowledge และคำถามผู้ใช้):

```text
คุณคือ AI ผู้นำทางจิตวิญญาณที่มีความรู้เกี่ยวกับโหราศาสตร์ ดาราศาสตร์ ดวงชะตา และการทำนาย คุณมีประสบการณ์มายาวนานกว่า 1,000 ปี

{relevantKnowledge}

🛡️ ข้อจำกัดสำคัญ:
- ตอบได้เฉพาะเรื่อง: โหราศาสตร์ ราศี ดวงชะตา เลขศาสตร์ ทาโรต์ ความฝัน การทำนาย
- หากถูกถามเรื่องอื่น ให้ปฏิเสธอย่างสุภาพและชี้ทางกลับมาที่ความเชี่ยวชาญ

คุณสามารถ:
- ทำนายดวงความรัก การเงิน การงาน สุขภาพ
- ตีความความฝัน
- อ่านดวงดาว ราศี ทาโรต์ เลขศาสตร์
- ให้คำปรึกษาเกี่ยวกับชีวิต ความรัก และชะตากรรม

รูปแบบการตอบ:
- ใช้ภาษาไทยที่สวยงาม มีเสน่ห์ลึกลับแต่เข้าใจง่าย
- อ้างอิงข้อมูลจาก Knowledge Base
- ความยาวประมาณ 3-5 ประโยค

จงตอบคำถามต่อไปนี้ในฐานะ AI ผู้นำทางจิตวิญญาณ โดยอ้างอิงข้อมูลจาก Knowledge Base:

คำถาม: {userMessage}
```

วิธีดู prompt ที่ส่งจริงแบบเต็มใน runtime:
1. เปิด `DEBUG_MODE = true` ในหน้า Chatbot
2. เปิด DevTools Console
3. ดู log กลุ่ม `🔍 DEBUG: Gemini API Request` และรายการ `📤 Full Prompt`

หมายเหตุ:
- ใน production path ค่าที่ส่งเข้า `/api/gemini` คือข้อความที่ประกอบแล้วทั้งก้อน
- key `message` จะเป็น `system prompt + relevantKnowledge + คำถามผู้ใช้`

### 9.2 ตัวอย่าง Prompt สำหรับหน้า Birthday Fortune

ตัวอย่างอินพุตผู้ใช้ก่อนกดคำนวณ:
- ชื่อ: สมชาย ใจดี
- วันเกิด: 14 เมษายน 1998
- เวลาเกิด: 09:00 - 09:59

ตัวอย่าง prompt ที่ส่งให้ Gemini (ย่อ):

```text
คุณคือผู้เชี่ยวชาญด้านโหราศาสตร์และดวงชะตา

ข้อมูลผู้ขอดูดวง:
- ชื่อ: สมชาย ใจดี
- วันเกิด: 14 เมษายน 2541 (14/4/1998)
- เวลาเกิด: 09:00 - 09:59

วิเคราะห์ดวงชะตาและตอบกลับเป็น JSON object เท่านั้น...
```

ตัวอย่างโครงผลลัพธ์ JSON ที่คาดหวัง:

```json
{
	"luckyColors": [
		{"name": "สีทอง", "hex": "#D4AF37", "meaning": "เสริมบารมี"},
		{"name": "สีเขียว", "hex": "#2E8B57", "meaning": "งานราบรื่น"},
		{"name": "สีฟ้า", "hex": "#5DADE2", "meaning": "สื่อสารดี"}
	],
	"luckyDirection": {
		"name": "ทิศตะวันออก",
		"meaning": "เหมาะเริ่มงานใหม่และเจรจาสำคัญ"
	},
	"weeklyFortune": {
		"love": {"points": ["...", "...", "..."]},
		"money": {"points": ["...", "...", "..."]},
		"career": {"points": ["...", "...", "..."]},
		"health": {"points": ["...", "...", "..."]}
	},
	"weeklyWarning": ["...", "...", "...", "..."],
	"luckyCalendar": [
		{"day": "จันทร์", "color": "สีเขียว", "hex": "#2E8B57", "action": "งานคืบหน้า"}
	]
}
```

## 10) Quick Troubleshooting

1. API 500 + "API key not configured"
	 - ตรวจ `GEMINI_API_KEY` บน Vercel

2. Chatbot ตอบไม่ได้ แต่ UI ปกติ
	 - ดู console logs (debug mode)
	 - ตรวจ network request ที่ `/api/gemini`

3. Birthday ได้ผลลัพธ์แปลกหรือไม่ครบ
	 - ตรวจว่า AI ตอบ JSON ได้ parse จริง
	 - ถ้า parse fail ระบบจะใช้ fallback data

---

เอกสารนี้เหมาะใช้เป็น handoff ให้ทีม frontend/backend และใช้ประกอบการ deploy/check production readiness.
