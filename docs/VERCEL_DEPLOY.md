# 🚀 Deploy ไปยัง Vercel

## ขั้นตอน:

### 1. Push โค้ดขึ้น GitHub
```bash
git add .
git commit -m "Add Vercel serverless function"
git push
```

### 2. สร้างบัญชี Vercel
1. ไปที่ https://vercel.com
2. Sign up ด้วย GitHub
3. คลิก **"Add New Project"**
4. เลือก repository: **LUCKKANAPro**
5. คลิก **"Import"**

### 3. ตั้งค่า Environment Variable
1. ใน Vercel Dashboard → Settings → Environment Variables
2. เพิ่มตัวแปร:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `[วาง API Key ใหม่ของคุณ]`
   - **Environment**: Production, Preview, Development (เลือกทั้งหมด)
3. คลิก **Save**

### 4. Deploy!
- Vercel จะ deploy อัตโนมัติ
- รอ 1-2 นาที
- จะได้ URL: `https://your-project.vercel.app`

## 🔒 ความปลอดภัย:
- ✅ API Key เก็บใน Server (ไม่ส่งมาที่ Browser)
- ✅ ไม่มี API Key ใน GitHub
- ✅ Frontend เรียกผ่าน `/api/gemini` แทน

## 💰 ค่าใช้จ่าย:
- **Vercel**: ฟรี (100 GB bandwidth/month)
- **Gemini API**: ฟรี (ตาม quota ที่เลือก)

## 📝 หมายเหตุ:
- ไฟล์ `js/config.js` ยังใช้สำหรับ Development (localhost)
- Production จะใช้ `/api/gemini` แทน
