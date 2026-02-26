# 🚀 คู่มืออัพเกรด Gemini API สำหรับ Production

## 📋 เมื่อไหร่ต้องอัพเกรด?

### 🔴 สัญญาณที่บอกว่าต้องอัพเกรด
- ✅ เว็บไซต์พร้อม publish สู่สาธารณะ
- ✅ มีผู้ใช้งานมากกว่า 100 คน/วัน
- ✅ เจอ Error 429 (Quota Exceeded) บ่อยๆ
- ✅ ต้องการความเป็นส่วนตัวของข้อมูล
- ✅ ต้องการ uptime 99.9%

---

## 💳 ขั้นตอนการอัพเกรด (Pay-as-you-go)

### 1️⃣ เปิดใช้งาน Billing

#### ไปที่ Google AI Studio
```
https://aistudio.google.com/apikey
```

#### คลิก "Upgrade to Paid"
1. เข้า **API Keys** ในเมนูซ้าย
2. คลิก **"Enable billing"** หรือ **"Upgrade to paid"**
3. เลือก **Google Cloud Project** (หรือสร้างใหม่)

---

### 2️⃣ ตั้งค่า Google Cloud Billing

#### A. สร้าง Google Cloud Project
```
https://console.cloud.google.com/
```

1. **New Project** → ตั้งชื่อ เช่น `LUCKKANAPro-Production`
2. เลือก **Billing Account** (ต้องใส่บัตรเครดิต)
3. **Enable Generative Language API**

#### B. เปิดใช้งาน API
```bash
# ไปที่ APIs & Services > Enable APIs and Services
# ค้นหา "Generative Language API"
# คลิก Enable
```

---

### 3️⃣ สร้าง API Key แบบ Production

#### ไปที่ API Keys
```
https://console.cloud.google.com/apis/credentials
```

1. **Create Credentials** → **API Key**
2. **Restrict Key** (สำคัญมาก!)
   - Application restrictions: **HTTP referrers (websites)**
   - Website restrictions: 
     ```
     https://yourdomain.com/*
     https://www.yourdomain.com/*
     ```
   - API restrictions: **Generative Language API**
3. คัดลอก API Key ใหม่

---

### 4️⃣ อัพเดทโค้ดในโปรเจค

#### เปลี่ยน API Key
```javascript
// js/components/chatbot.js
const GEMINI_API_KEY = 'YOUR_NEW_PRODUCTION_API_KEY';
```

#### หรือใช้ Environment Variable (แนะนำ)
```javascript
// สร้างไฟล์ js/config.js
const CONFIG = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'fallback-key',
    IS_PRODUCTION: window.location.hostname !== 'localhost'
};

// ใน chatbot.js
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
```

---

### 5️⃣ ตั้งค่า Budget Alert (ป้องกันค่าใช้จ่ายเกิน)

#### ไปที่ Billing > Budgets & alerts
```
https://console.cloud.google.com/billing/budgets
```

1. **Create Budget**
2. ตั้งค่า:
   - **Budget name**: LUCKKANAPro Monthly Limit
   - **Budget amount**: $10/month (หรือตามต้องการ)
   - **Alerts**: 
     - 50% ของ budget
     - 90% ของ budget
     - 100% ของ budget
3. **Email notifications**: ใส่อีเมลของคุณ

---

## 💰 คำนวณค่าใช้จ่าย

### Gemini 2.5 Flash (Paid Tier)
- **Input**: $0.075 / 1M tokens
- **Output**: $0.30 / 1M tokens

### ตัวอย่างการคำนวณ

#### สมมติ: 10,000 การสนทนา/เดือน
```
แต่ละการสนทนา:
- Input: 500 tokens (คำถาม + Knowledge Base)
- Output: 200 tokens (คำตอบ)

คำนวณ:
Input:  10,000 × 500 = 5,000,000 tokens
Output: 10,000 × 200 = 2,000,000 tokens

ค่าใช้จ่าย:
Input:  5M × $0.075/1M = $0.375
Output: 2M × $0.30/1M  = $0.60
รวม:   $0.975/เดือน (~30 บาท)
```

#### ถ้า 100,000 การสนทนา/เดือน
```
Input:  50M × $0.075/1M = $3.75
Output: 20M × $0.30/1M  = $6.00
รวม:   $9.75/เดือน (~300 บาท)
```

---

## 🛡️ Security Best Practices

### 1. ซ่อน API Key
```javascript
// ❌ ไม่ดี - API Key โชว์ในโค้ด
const GEMINI_API_KEY = 'AIzaSyAlalX0jht7EDUPR2xxQoX59FpTvCGXsQo';

// ✅ ดี - ใช้ Environment Variable
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
```

### 2. จำกัด Domain (API Key Restrictions)
```
เฉพาะ:
- https://luckkana.com/*
- https://www.luckkana.com/*
```

### 3. ใช้ Backend Proxy (แนะนำสุด)
```javascript
// แทนที่จะเรียก API ตรงจาก Frontend
// สร้าง Backend API ของเราเอง

// Frontend → Your Backend → Gemini API
fetch('https://yourdomain.com/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: userMessage })
});

// Backend จะเก็บ API Key ปลอดภัย
```

---

## 🏗️ สถาปัตยกรรมแบบ Production

### Option 1: Frontend Only (ง่าย แต่ API Key โชว์)
```
User Browser → Gemini API (ตรง)
```
- ✅ ง่าย setup ไว
- ❌ API Key โชว์ในโค้ด
- ❌ ควบคุมการใช้งานยาก

### Option 2: Backend Proxy (แนะนำ)
```
User → Your Backend → Gemini API
```
- ✅ API Key ปลอดภัย
- ✅ ควบคุม rate limiting ได้
- ✅ เก็บ logs ได้
- ❌ ต้องมี Backend

---

## 🚀 ตัวอย่าง Backend (Node.js)

### สร้าง Simple Backend API

```javascript
// server.js (Node.js + Express)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Rate limiting (เช่น จำกัด 1,000 requests/วัน)
        // TODO: ใช้ Redis หรือ Database เก็บ counter
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### อัพเดท Frontend
```javascript
// chatbot.js
async function getGeminiResponse(userMessage) {
    const response = await fetch('https://yourdomain.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });
    return await response.json();
}
```

---

## 📊 Monitoring & Analytics

### 1. ดู Usage ใน Google Cloud Console
```
https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/metrics
```

### 2. ตั้งค่า Logging
```javascript
// เก็บ log ทุกครั้งที่มีการเรียก API
console.log('[API]', {
    timestamp: new Date(),
    user: userId,
    tokens: {
        input: inputTokens,
        output: outputTokens
    },
    cost: calculatedCost
});
```

### 3. Dashboard
ใช้ Google Cloud Monitoring หรือ สร้าง Dashboard เอง

---

## 🎯 Checklist ก่อน Launch Production

### เทคนิค
- [ ] API Key ใหม่ (Production)
- [ ] จำกัด Domain/IP
- [ ] ตั้ง Budget Alert
- [ ] Error Handling ครบถ้วน
- [ ] Rate Limiting (ถ้ามี Backend)
- [ ] Logging & Monitoring

### ธุรกิจ
- [ ] คำนวณค่าใช้จ่ายต่อเดือน
- [ ] เตรียมบัตรเครดิต/วิธีชำระเงิน
- [ ] อ่าน Terms of Service
- [ ] เตรียมแผน Scale (ถ้าผู้ใช้เพิ่ม)

### กฎหมาย
- [ ] Privacy Policy (บอกว่าใช้ AI)
- [ ] Terms of Use
- [ ] Cookies Notice (ถ้ามี)

---

## 💡 เคล็ดลับประหยัดค่าใช้จ่าย

### 1. Context Caching
```javascript
// เก็บ Knowledge Base ไว้ใน cache
// ไม่ต้องส่งซ้ำทุกครั้ง → ประหยัด 90%
```

### 2. Response Streaming
```javascript
// ใช้ streaming แทน one-shot
// ผู้ใช้เห็นผลเร็วขึ้น
```

### 3. Shorter System Prompts
```javascript
// ลด System Prompt จาก 1,000 tokens → 200 tokens
// ประหยัดได้มาก
```

### 4. Cache คำตอบที่ซ้ำ
```javascript
// คำถามเดิม → ใช้คำตอบเก่า
// ไม่ต้องเรียก API ใหม่
```

---

## 🆘 แก้ปัญหาที่พบบ่อย

### ❌ Error: API Key not valid
```
→ ตรวจสอบว่า Enable Billing แล้ว
→ ตรวจสอบ API Restrictions
```

### ❌ Error 429: Quota Exceeded
```
→ ซื้อ Quota เพิ่ม หรือ
→ รอให้ Quota Reset
```

### ❌ ค่าใช้จ่ายสูงกว่าที่คิด
```
→ ดู Logs หา Request ที่ไม่ปกติ
→ ตั้ง Budget Alert ให้ต่ำลง
→ ใช้ Caching
```

---

## 📞 ติดต่อ Support

- **Google Cloud Support**: https://cloud.google.com/support
- **Gemini API Forum**: https://discuss.ai.google.dev/
- **Documentation**: https://ai.google.dev/gemini-api/docs

---

## 🎉 สรุป Steps สำหรับคุณ

1. **ตอนนี้**: ใช้ Free Tier พัฒนาต่อ ✅
2. **ก่อน Launch**: 
   - สร้าง Google Cloud Project
   - Enable Billing
   - สร้าง Production API Key
   - ตั้ง Budget Alert
3. **หลัง Launch**: 
   - Monitor Usage
   - Optimize Costs
   - Scale ตามผู้ใช้

---

**ค่าใช้จ่ายประมาณ**: $5-20/เดือน สำหรับเว็บขนาดกลาง (10k-50k requests)

**คุ้มค่าไหม?**: คุ้มมาก! เทียบกับการจ้างคนตอบแชท 24/7 🚀
