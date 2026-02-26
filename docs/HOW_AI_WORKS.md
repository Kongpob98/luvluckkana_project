# 🤖 AI ของคุณทำงานอย่างไร - ภาพรวมทั้งระบบ

## 🎯 สถาปัตยกรรมระบบ (Architecture)

```
User พิมพ์คำถาม
        ↓
[1] chatbot.js รับข้อความ
        ↓
[2] ค้นหา Knowledge Base ที่เกี่ยวข้อง
        ↓
[3] สร้าง System Prompt + Knowledge
        ↓
[4] ส่งไปที่ Gemini API (Google)
        ↓
[5] Gemini AI ประมวลผล
        ↓
[6] รับคำตอบกลับมา
        ↓
[7] แสดงผลให้ User + บันทึก Log
```

---

## 📚 ขั้นตอนละเอียด

### **ขั้นที่ 1: รับคำถามจาก User**
```javascript
// ใน chatbot.js
User พิมพ์: "ทำนายดวงราศีมังกร"
        ↓
sendMessage(message) ถูกเรียก
```

### **ขั้นที่ 2: ค้นหา Knowledge Base (RAG System)**
```javascript
getRelevantKnowledge(message)
        ↓
ตรวจสอบว่าคำถามเกี่ยวกับอะไร:
  ✓ ราศี → ดึง zodiac-knowledge.js
  ✓ ความฝัน → ดึง dream-knowledge.js
  ✓ ทาโรต → ดึง fortune-knowledge.js
  ✓ เลขศาสตร์ → ดึง numerology-knowledge.js
        ↓
ได้ข้อมูลที่เกี่ยวข้อง เช่น:
"ราศีมังกร: ช่วงเกิด 22 ธ.ค. - 19 ม.ค.
 ความรัก: มีเสน่ห์ดึงดูดใจ..."
```

### **ขั้นที่ 3: สร้าง Prompt**
```javascript
systemPrompt = `
คุณคือ AI ผู้นำทางจิตวิญญาณ
มีความรู้เกี่ยวกับโหราศาสตร์ 1,000 ปี

=== ข้อมูลที่เกี่ยวข้อง ===
ราศีมังกร (22 ธ.ค. - 19 ม.ค.)
ความรัก: มีเสน่ห์ดึงดูดใจ คู่ควรคือราศีพฤษภ กันย์...
การงาน: มีโอกาสก้าวหน้า...
(+ ข้อมูลอื่นๆ จาก Knowledge Base)

จงตอบคำถามต่อไปนี้...

คำถาม: ทำนายดวงราศีมังกร
`
```

### **ขั้นที่ 4: ส่งไปที่ Gemini API**
```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent')
        ↓
Request Body:
{
  "contents": [{
    "parts": [{ "text": "[System Prompt + คำถาม]" }]
  }],
  "generationConfig": {
    "temperature": 0.9,    // ความสร้างสรรค์ (0-2)
    "topK": 40,            // เลือก 40 คำที่น่าจะเป็นไปได้
    "topP": 0.95,          // รวม probability 95%
    "maxOutputTokens": 1024 // คำตอบไม่เกิน 1024 tokens
  }
}
```

### **ขั้นที่ 5: Gemini AI ประมวลผล**
```
Google Servers (USA)
        ↓
Gemini 2.5 Flash Model
  - อ่าน System Prompt
  - ดู Knowledge Base ที่ส่งไป
  - วิเคราะห์คำถาม
  - สร้างคำตอบที่เหมาะสม
        ↓
ใช้เวลา ~1-3 วินาที
```

### **ขั้นที่ 6: รับคำตอบกลับมา**
```javascript
Response:
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "ดวงราศีมังกรในเดือนนี้เต็มไปด้วย
                 โอกาสทางการเงิน ดาวพฤหัสบดีส่องแสง
                 ให้ความโชคดี คนโสดมีโอกาสพบรัก..."
      }]
    }
  }],
  "usageMetadata": {
    "promptTokenCount": 450,      // Input tokens
    "candidatesTokenCount": 150,  // Output tokens
    "totalTokenCount": 600        // รวม
  }
}
```

### **ขั้นที่ 7: แสดงผล + บันทึก**
```javascript
1. แสดงคำตอบให้ User เห็น
2. บันทึก log ลง localStorage
3. อัพเดท API Monitor
```

---

## 🧠 RAG System (Retrieval-Augmented Generation)

### **ทำไมต้องใช้ RAG?**

❌ **ถ้าไม่มี RAG:**
```
User: "ทำนายดวงราศีมังกร"
        ↓
AI: "ราศีมังกรเป็นราศีดิน มีลักษณะอดทน..." 
(คำตอบทั่วไป ไม่เฉพาะเจาะจง)
```

✅ **มี RAG:**
```
User: "ทำนายดวงราศีมังกร"
        ↓
ค้นหา zodiac-knowledge.js
        ↓
ดึงข้อมูลเฉพาะราศีมังกร
        ↓
AI: "ราศีมังกร (22 ธ.ค. - 19 ม.ค.) 
     ความรัก: มีเสน่ห์ดึงดูดใจ คู่ควร: พฤษภ กันย์
     การงาน: โอกาสก้าวหน้าในเดือนนี้
     การเงิน: รายได้เพิ่ม 20%
     สีมงคล: น้ำเงิน เทา เลขมงคล: 3, 7, 10"
(คำตอบละเอียด แม่นยำ จากข้อมูลของคุณ)
```

---

## 📊 Knowledge Base ของคุณ

### **1. zodiac-knowledge.js** (12 ราศี)
```javascript
{
  name: "ราศีมังกร",
  dateRange: "22 ธ.ค. - 19 ม.ค.",
  love: {
    personality: "...",
    compatible: ["พฤษภ", "กันย์", "ราศีดินทุกราศี"],
    advice: "...",
    prediction: "..."
  },
  career: {...},
  finance: {...},
  health: {...},
  luckyColor: ["น้ำเงิน", "เทา", "น้ำตาล"],
  luckyNumber: [3, 7, 10]
}
```

### **2. dream-knowledge.js** (ความฝัน)
```javascript
{
  symbol: "งู",
  category: "สัตว์",
  interpretations: {
    general: "เตือนภัย ระวังศัตรู",
    love: "คนรักไม่ซื่อสัตย์",
    money: "โอกาสรวย",
    work: "ระวังคนทรยศ"
  }
}
```

### **3. fortune-knowledge.js** (ทาโรต + เลขศาสตร์)
```javascript
// Tarot Cards
{
  name: "The Lovers",
  meaning: "ความรัก ความสัมพันธ์",
  upright: "รักแท้ ความผูกพัน",
  reversed: "ความสัมพันธ์แตกร้าว"
}

// Numerology
{
  number: 7,
  meaning: "ปัญญา ความลึกลับ",
  personality: "...",
  career: "นักวิจัย นักปรัชญา"
}
```

### **4. numerology-knowledge.js** (จาก PDF)
```javascript
{
  numbers: {
    1: {
      planet: "ดาวอาทิตย์",
      element: "ไฟ",
      personality: "ครอบงำ ชอบเป็นใหญ่...",
      colors: {good: ["ส้ม","ทอง"], bad: ["ฟ้า","น้ำเงิน"]},
      gems: ["พลอยสีส้ม", "บุษราคัม"]
    }
    // ... 1-19
  },
  letterValues: {...},  // แปลงอักษรไทย → เลข
  birthDayNaming: {...} // การตั้งชื่อตามวันเกิด
}
```

---

## ⚙️ Configuration (ตั้งค่า AI)

```javascript
generationConfig: {
  temperature: 0.9,         // ความสร้างสรรค์
  topK: 40,                 // จำนวนตัวเลือก
  topP: 0.95,               // ความน่าจะเป็น
  maxOutputTokens: 1024     // ความยาวคำตอบ
}
```

### **Temperature (0.0 - 2.0)**
- `0.0` → ตอบตรงตาม Knowledge Base (ซ้ำๆ)
- `0.9` → **ปัจจุบัน** สร้างสรรค์พอดี
- `2.0` → สร้างสรรค์มาก (อาจแต่งเรื่อง)

### **Top K & Top P**
- กำหนดว่า AI จะเลือกคำจากตัวเลือกไหน
- ตั้งปานกลาง → คำตอบหลากหลายแต่ยังมีคุณภาพ

---

## 🔒 Safety Settings

```javascript
safetySettings: [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
]
```

ป้องกัน:
- ❌ การล่วงละเมิด
- ❌ เนื้อหาอนาจาร
- ❌ เนื้อหาอันตราย

---

## 📈 Performance

### **ความเร็ว:**
```
User ส่งคำถาม
  ↓ ~50ms (JavaScript)
ค้นหา Knowledge
  ↓ ~100ms (ค้นหา local)
ส่ง API
  ↓ ~1-3 วินาที (Internet + AI)
แสดงผล
  ↓ ~50ms (Render)
────────────────
รวม: ~1.5-3.5 วินาที
```

### **Token Usage (ต่อ 1 คำถาม):**
```
System Prompt: ~300 tokens
Knowledge Base: ~150 tokens
User Message: ~20 tokens
────────────────────────
Input Total: ~470 tokens

AI Response: ~150 tokens
────────────────────────
Total: ~620 tokens/request
```

### **Quota (Free Tier):**
```
1,500 requests/day
  ↓
~620 tokens/request
  ↓
~930,000 tokens/day ใช้ได้
(Limit คือ 1M tokens/minute ไม่น่ากังวล)
```

---

## 🎯 Flow Chart สมบูรณ์

```
┌─────────────────────────────────────────┐
│         User Interface (HTML)           │
│  ┌─────────────────────────────────┐   │
│  │  Input: "ทำนายดวงราศีมังกร"   │   │
│  └──────────────┬──────────────────┘   │
└─────────────────┼──────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      chatbot.js (Frontend Logic)        │
│  ┌──────────────────────────────────┐  │
│  │ 1. sendMessage()                 │  │
│  │ 2. getRelevantKnowledge()        │  │
│  │    → ค้นหา "มังกร"              │  │
│  │    → พบใน zodiac-knowledge.js   │  │
│  │    → ดึงข้อมูลราศีมังกรทั้งหมด │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Knowledge Base (Local Data)           │
│  ┌──────────────────────────────────┐  │
│  │ zodiac-knowledge.js              │  │
│  │ dream-knowledge.js               │  │
│  │ fortune-knowledge.js             │  │
│  │ numerology-knowledge.js          │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│     Prompt Builder (chatbot.js)         │
│  ┌──────────────────────────────────┐  │
│  │ System Prompt + Knowledge        │  │
│  │ + User Question                  │  │
│  │ = Complete Prompt (~470 tokens)  │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┘
                  ↓
         🌐 Internet 🌐
                  ↓
┌─────────────────────────────────────────┐
│  Gemini API (Google Cloud - USA)        │
│  ┌──────────────────────────────────┐  │
│  │ Model: gemini-2.5-flash          │  │
│  │ Context: 1M tokens               │  │
│  │ Processing: ~1-3 seconds         │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┘
                  ↓
         🌐 Internet 🌐
                  ↓
┌─────────────────────────────────────────┐
│      Response Handler (chatbot.js)      │
│  ┌──────────────────────────────────┐  │
│  │ 1. รับ response                  │  │
│  │ 2. แสดงผลใน UI                  │  │
│  │ 3. บันทึก localStorage           │  │
│  │ 4. อัพเดท API Monitor           │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         User Interface (HTML)           │
│  ┌─────────────────────────────────┐   │
│  │  Output: "ดวงราศีมังกร..."     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🔑 Key Features

### **1. Smart Knowledge Retrieval**
- ตรวจจับคีย์เวิร์ดอัตโนมัติ
- ดึงเฉพาะข้อมูลที่เกี่ยวข้อง
- ลดการใช้ tokens

### **2. Contextual Responses**
- AI ตอบจากข้อมูลของคุณ
- ไม่ใช่ความรู้ทั่วไปจาก internet
- แม่นยำ เฉพาะเจาะจง

### **3. Multi-Domain Knowledge**
- ดวงดาว (12 ราศี)
- ความฝัน (20+ สัญลักษณ์)
- ทาโรต (22 ใบ Major Arcana)
- เลขศาสตร์ (1-19, การตั้งชื่อ)

### **4. Error Handling**
- Retry อัตโนมัติถ้า API fail
- Fallback responses
- Log ทุก error

### **5. Monitoring**
- Real-time API tracking
- Token usage statistics
- Error logging

---

## 📁 ไฟล์สำคัญ

```
LUCKKANAPro/
├── chatbot.html              # UI หลัก
├── js/
│   └── components/
│       └── chatbot.js        # Logic หลัก (450+ บรรทัด)
├── js/data/
│   ├── zodiac-knowledge.js   # ข้อมูลราศี
│   ├── dream-knowledge.js    # ข้อมูลความฝัน
│   ├── fortune-knowledge.js  # ทาโรต
│   └── numerology-knowledge.js # เลขศาสตร์
├── api-monitor.html          # ดู API usage
└── debug-console.html        # Debug guide
```

---

## 🎓 สรุป

**AI ของคุณคือ Hybrid System:**

1. **Frontend (Browser):** 
   - จัดการ UI
   - ค้นหา Knowledge Base
   - สร้าง Prompt

2. **Knowledge Base (Local):**
   - เก็บข้อมูลเฉพาะทาง
   - 12 ราศี + ความฝัน + ทาโรต + เลขศาสตร์
   - ~1,500+ จุดข้อมูล

3. **Gemini API (Cloud):**
   - AI Model ที่ฉลาด
   - ประมวลผลภาษาไทย
   - สร้างคำตอบที่เป็นธรรมชาติ

4. **Monitoring (Local):**
   - ติดตามการใช้งาน
   - วิเคราะห์ performance
   - จัดการ quota

**ผลลัพธ์:**
✅ AI ที่ฉลาด (Gemini 2.5 Flash)
✅ ข้อมูลเฉพาะทาง (Knowledge Base)
✅ คำตอบแม่นยำ (RAG System)
✅ ไม่มีค่าใช้จ่าย (Free Tier)
