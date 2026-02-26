# 🚀 Production Deployment - Quick Guide

## 📦 ไฟล์สำคัญที่ต้องอ่าน

1. **UPGRADE_GUIDE.md** - คู่มืออัพเกรด API เต็มรูปแบบ
2. **DEPLOYMENT_CHECKLIST.md** - Checklist ก่อน launch
3. **GEMINI_API_LIMITS.md** - ข้อมูล API และ Quota
4. **.env.template** - Template สำหรับ Environment Variables

---

## ⚡ Quick Start (5 นาที)

### 1. สร้าง Google Cloud Project
```
https://console.cloud.google.com/
→ New Project → ชื่อ "LUCKKANAPro-Production"
```

### 2. Enable Billing
```
→ Billing → Add Billing Account
→ ใส่บัตรเครดิต
```

### 3. สร้าง API Key
```
APIs & Services → Credentials → Create API Key
→ Restrict Key:
  - HTTP referrers: https://yourdomain.com/*
  - API: Generative Language API
```

### 4. ตั้ง Budget Alert
```
Billing → Budgets → Create Budget
→ $10/month
→ Alert at 50%, 90%, 100%
```

### 5. แก้โค้ด
```javascript
// js/components/chatbot.js
const GEMINI_API_KEY = 'YOUR_NEW_PRODUCTION_KEY';
```

### 6. Deploy!
```bash
# Upload ไฟล์ไปที่ hosting
# เช่น Netlify, Vercel, GitHub Pages
```

---

## 💰 ค่าใช้จ่ายโดยประมาณ

| ผู้ใช้/วัน | Conversations/วัน | ค่าใช้จ่าย/เดือน |
|-----------|------------------|----------------|
| 10-50 | 100-500 | $1-5 (~30-150 บาท) |
| 50-200 | 500-2,000 | $5-15 (~150-450 บาท) |
| 200-1,000 | 2,000-10,000 | $15-75 (~450-2,250 บาท) |

**หมายเหตุ**: ราคาจริงขึ้นกับความยาวของการสนทนา

---

## 🛡️ Security Checklist (สำคัญมาก!)

- ✅ API Key มี Restrictions (Domain + API)
- ✅ ไม่มี API Key ใน Git
- ✅ ใช้ HTTPS เท่านั้น
- ✅ มี Rate Limiting
- ✅ ตั้ง Budget Alert

---

## 📞 ติดปัญหา?

### อ่านเอกสาร
1. **UPGRADE_GUIDE.md** - วิธีอัพเกรดแบบละเอียด
2. **DEPLOYMENT_CHECKLIST.md** - Checklist ครบถ้วน

### ติดต่อ Support
- Google Cloud Support: https://console.cloud.google.com/support
- Gemini API Docs: https://ai.google.dev/gemini-api/docs

---

## 🎯 Next Steps

หลัง Launch:
1. Monitor API Usage ทุกวัน (สัปดาห์แรก)
2. เช็ค Billing (เดือนแรก)
3. รวบรวม User Feedback
4. Optimize Performance

---

**พร้อมแล้ว? เริ่มจาก UPGRADE_GUIDE.md เลย!** 🚀
