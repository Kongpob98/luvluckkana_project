# 📊 วิธีดู Gemini API Usage (ไม่ต้องใช้ AI Studio)

## 🎯 เครื่องมือใหม่: API Monitor

เนื่องจาก API Key ของคุณไม่สามารถเข้า Google AI Studio ได้ ฉันได้สร้าง **API Monitor** แบบ Local ให้แทน!

---

## 🚀 วิธีใช้งาน (ง่ายมาก!)

### ขั้นตอนที่ 1: เปิด API Monitor
```
http://localhost:8000/api-monitor.html
```

### ขั้นตอนที่ 2: เปิด Chatbot (แท็บใหม่)
```
http://localhost:8000/chatbot.html
```

### ขั้นตอนที่ 3: ส่งข้อความในแชท
พิมพ์อะไรก็ได้ เช่น:
- "ทำนายดวงราศีมังกร"
- "เลข 7 หมายถึงอะไร"
- "ฝันเห็นงู"

### ขั้นตอนที่ 4: กลับมาดู API Monitor
**อัพเดทอัตโนมัติทุก 2 วินาที!** 🔄

---

## 📊 ข้อมูลที่คุณจะเห็น

### Dashboard (บนสุด)
```
┌─────────────────────────────────────────────────┐
│ 📝 Total Requests        ✅ Successful         │
│    15                        14                 │
│                                                  │
│ ❌ Errors                🎯 Token Usage        │
│    1                         8,450              │
│                          5,200 in · 3,250 out   │
└─────────────────────────────────────────────────┘
```

### API Call Logs (ด้านล่าง)
```
📋 API Call Logs                    [🗑️ Clear Logs]
────────────────────────────────────────────────────

⏰ 30/1/2569, 14:30:45
💬 ทำนายดวงราศีมังกร                  ✅ Success

📊 Tokens: 450 input  150 output  600 total
💡 ดวงราศีมังกรในเดือนนี้เต็มไปด้วยโอกาสทางการเงิน...

────────────────────────────────────────────────────

⏰ 30/1/2569, 14:28:12
💬 เลข 7 หมายถึงอะไร                  ✅ Success

📊 Tokens: 380 input  120 output  500 total
💡 เลข 7 ในเลขศาสตร์หมายถึงดาวเสาร์...
```

---

## ✨ ฟีเจอร์เด่น

### 1. **Real-time Monitoring** ⚡
- อัพเดทอัตโนมัติทุก 2 วินาที
- ไม่ต้อง refresh หน้าเว็บ

### 2. **Token Tracking** 📊
- ดู Input/Output tokens แยกกัน
- แถบแสดงการใช้งาน (เทียบกับ 1M tokens)

### 3. **Error Logging** ❌
- บันทึก Error ทุกครั้ง
- แสดง Error message ชัดเจน

### 4. **Storage** 💾
- เก็บ logs ใน localStorage
- เก็บได้สูงสุด 50 รายการ
- ลบได้ทุกเมื่อด้วยปุ่ม Clear

---

## 🔧 การทำงาน (Behind the scenes)

```javascript
chatbot.js
    ↓
ส่ง API → Gemini
    ↓
บันทึก → localStorage
    ↓
api-monitor.html อ่าน → แสดงผล
```

### ข้อมูลที่บันทึก:
```json
{
  "timestamp": "30/1/2569, 14:30:45",
  "userMessage": "ทำนายดวงราศีมังกร",
  "response": "ดวงราศีมังกร...",
  "status": 200,
  "tokens": {
    "input": 450,
    "output": 150,
    "total": 600
  }
}
```

---

## 💡 Tips

### ดู Console พร้อมกัน
```
1. F12 → Console (ดู debug logs)
2. เปิด api-monitor.html (ดู history)
```

### Export Logs
```javascript
// ใน Console พิมพ์:
copy(localStorage.getItem('gemini_api_logs'))

// แล้ว Paste ลง text file
```

### Clear Logs
- กดปุ่ม "🗑️ Clear Logs" ใน api-monitor.html
- หรือพิมพ์ใน Console:
```javascript
localStorage.removeItem('gemini_api_logs')
```

---

## 📈 การตรวจสอบ Quota

### Free Tier Limits:
- ✅ **15 RPM** (Requests Per Minute)
- ✅ **1,500 RPD** (Requests Per Day)
- ✅ **1M TPM** (Tokens Per Minute)

### ดูการใช้งาน:
1. เปิด api-monitor.html
2. ดูที่ Dashboard:
   - Total Requests = จำนวนที่ใช้ไป
   - Token Usage = โทเค็นที่ใช้ไป

### ถ้าเกิน Limit:
```
❌ Error
Status: 429
Error: Resource has been exhausted (e.g. check quota).
```

---

## 🎨 สีความหมาย

| สี | ความหมาย |
|----|----------|
| 🟢 เขียว | Success (200) |
| 🔴 แดง | Error (400, 429, 500) |
| 🔵 น้ำเงิน | Input tokens |
| 🟣 ม่วง | Output tokens |

---

## 🆚 เปรียบเทียบ Google AI Studio

| ฟีเจอร์ | AI Studio | API Monitor (Local) |
|---------|-----------|---------------------|
| ดู History | ✅ | ✅ |
| Real-time | ❌ | ✅ |
| Token Usage | ✅ | ✅ |
| Error Details | ⚠️ | ✅ |
| ต้อง Login | ✅ | ❌ |
| Export Data | ⚠️ | ✅ (copy/paste) |
| **ใช้ได้กับ API Key แบบคุณ** | ❌ | ✅ |

---

## 🔗 ลิงก์ที่เกี่ยวข้อง

- 🤖 [Chatbot](http://localhost:8000/chatbot.html)
- 📊 [API Monitor](http://localhost:8000/api-monitor.html)
- 🔍 [Debug Console](http://localhost:8000/debug-console.html)
- 📖 [API Limits](./GEMINI_API_LIMITS.md)

---

## ❓ FAQ

### Q: ทำไมไม่เห็นข้อมูล?
A: ต้องส่งข้อความใน chatbot.html ก่อน แล้วกลับมาดู

### Q: ข้อมูลหายไปไหน?
A: เก็บใน localStorage (browser storage) ถ้าลบ browser cache ข้อมูลจะหาย

### Q: ดูได้กี่รายการ?
A: สูงสุด 50 รายการล่าสุด (เก่าสุดถูกลบอัตโนมัติ)

### Q: Export ข้อมูลได้ไหม?
A: ได้! กด F12 → Console → พิมพ์:
```javascript
copy(localStorage.getItem('gemini_api_logs'))
```

---

## ✅ สรุป

**API Monitor** เป็นทางเลือกที่ดีกว่า Google AI Studio สำหรับคุณ เพราะ:
- ✅ ไม่ต้อง login
- ✅ Real-time updates
- ✅ ใช้งานง่าย
- ✅ ดูได้ทันทีที่ส่ง API

**ลองเลย!** 🚀
```
http://localhost:8000/api-monitor.html
```
