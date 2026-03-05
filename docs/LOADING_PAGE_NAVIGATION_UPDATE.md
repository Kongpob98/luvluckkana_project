# Loading Screen - Page Navigation Update 🚀

## การอัพเดทล่าสุด

Loading Screen ตอนนี้รองรับ **Page Navigation** แล้ว! จะแสดง loading อัตโนมัติทั้งตอนเปิดเว็บไซต์และตอนเปลี่ยนหน้า

---

## ✨ คุณสมบัติใหม่

### 1. Auto-show เมื่อคลิกลิงก์
- คลิกลิงก์ภายในเว็บไซต์ → แสดง loading ทันที
- รอ `minDisplayTime` → เปลี่ยนหน้า
- หน้าใหม่โหลดเสร็จ → ซ่อน loading

### 2. Smart Link Detection
- ✅ Intercept: ลิงก์ภายในเว็บไซต์
- ❌ ไม่ Intercept: ลิงก์ภายนอก, `target="_blank"`, `download`, `data-no-loading`

### 3. Browser History Support
- รองรับปุ่ม Back/Forward
- แสดง loading เมื่อใช้ browser navigation

---

## 📦 ไฟล์ที่อัพเดท

### JavaScript Component
- **`/js/components/loading.js`**
  - เพิ่ม `interceptLinks` option
  - เพิ่มฟังก์ชัน `setupLinkInterception()`
  - เพิ่มฟังก์ชัน `isInternalLink()`
  - เพิ่มฟังก์ชัน `navigateToPage()`
  - รองรับ `popstate` event (back/forward)

### หน้าเว็บที่เพิ่ม Loading Screen
- ✅ `/pages/index.html`
- ✅ `/pages/12zodiac.html` 
- ✅ `/pages/blog.html`
- ✅ `/pages/chatbot.html`
- ✅ `/pages/numerology.html`
- ✅ `/pages/simsy.html`

### Documentation
- 📝 `/docs/LOADING_SCREEN_GUIDE.md` - อัพเดทเอกสารครบถ้วน
- 🎮 `/pages/loading-demo.html` - เพิ่มตัวอย่าง page navigation

---

## 🚀 การใช้งาน

### แบบอัตโนมัติ (แนะนำ)
เพียงเพิ่ม 2 บรรทัดนี้:

```html
<link rel="stylesheet" href="../css/loading.css">
<script src="../js/components/loading.js"></script>
```

**ทำงานอัตโนมัติ:**
1. ✅ แสดง loading เมื่อเปิดเว็บ
2. ✅ แสดง loading เมื่อคลิกลิงก์ภายใน
3. ✅ ซ่อน loading เมื่อหน้าโหลดเสร็จ

### ปิดการ Intercept สำหรับลิงก์

```html
<!-- ลิงก์นี้จะไม่แสดง loading -->
<a href="page.html" data-no-loading>ไม่แสดง Loading</a>

<!-- ลิงก์ภายนอกจะไม่แสดง loading อัตโนมัติ -->
<a href="https://google.com" target="_blank">Google</a>
```

### ควบคุมด้วย JavaScript

```javascript
// แสดง loading manual
window.loadingScreen.show();

// ซ่อน loading manual
window.loadingScreen.hide();

// Navigate with loading
window.loadingScreen.navigateToPage('about.html');
```

### ปรับแต่ง Options

```javascript
const loading = LoadingScreen.init({
    videoSrc: '../assets/images/loadd.mp4',
    minDisplayTime: 2000,      // แสดงอย่างน้อย 2 วินาที
    showProgress: true,         // แสดงข้อความ "กำลังโหลด"
    autoHide: true,            // ซ่อนอัตโนมัติ
    interceptLinks: true       // Intercept internal links (default: true)
});
```

---

## 🎯 เทคนิคการทำงาน

### Link Interception Flow

```
1. Click Link
   ↓
2. Check if internal link
   ↓ (Yes)
3. Prevent default navigation
   ↓
4. Show loading screen
   ↓
5. Wait minDisplayTime
   ↓
6. Navigate to new page
   ↓
7. New page loads
   ↓
8. Hide loading automatically
```

### Internal Link Detection

```javascript
// ตรวจสอบว่าลิงก์เป็น internal หรือไม่
isInternalLink(link) {
    const linkUrl = new URL(link.href, window.location.href);
    const currentUrl = new URL(window.location.href);
    
    return linkUrl.origin === currentUrl.origin && 
           !link.href.startsWith('#') &&
           linkUrl.pathname !== currentUrl.pathname;
}
```

---

## 📱 Responsive Behavior

- **Desktop**: วีดีโอ 600x600px
- **Tablet** (≤768px): วีดีโอ 400x400px
- **Mobile** (≤480px): วีดีโอ 300x300px

---

## 🎨 การปรับแต่ง

### เปลี่ยนเวลา Transition

```css
.loading-screen {
    transition: opacity 1s ease-out; /* เปลี่ยนจาก 0.5s */
}
```

### เปลี่ยนสีพื้นหลัง

```css
.loading-screen {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}
```

---

## 🧪 ทดสอบการทำงาน

### 1. เปิด Demo Page
```
/pages/loading-demo.html
```

### 2. ทดสอบ Page Navigation
- คลิกลิงก์ "ไปหน้า Home", "ไปหน้า 12 Zodiac" 
- สังเกต loading แสดงก่อนเปลี่ยนหน้า

### 3. ทดสอบ Browser Navigation
- เปลี่ยนหน้า → กดปุ่ม Back
- ควรเห็น loading แสดงเมื่อกลับหน้า

---

## ⚠️ ข้อควรระวัง

### 1. minDisplayTime
- ถ้าตั้งสูงเกินไป (>3000ms) → ผู้ใช้รอนาน
- ถ้าตั้งต่ำเกินไป (<1000ms) → อาจดูกระตุก
- **แนะนำ**: 1500-2000ms

### 2. Video File Size
- ควรใช้วีดีโอขนาดไม่เกิน 1-2 MB
- ใช้ MP4 format สำหรับ compatibility
- Optimize สำหรับ web (compress)

### 3. Browser Autoplay Policy
- บางเบราว์เซอร์บล็อก autoplay
- ต้องมี `muted` attribute
- Component จัดการ fallback อัตโนมัติ

---

## 🐛 Troubleshooting

### Loading ไม่แสดงเมื่อคลิกลิงก์
- ✅ ตรวจสอบว่าเพิ่ม `loading.js` แล้ว
- ✅ เช็ค `interceptLinks: true` ใน options
- ✅ ดูว่าลิงก์มี `data-no-loading` หรือไม่

### Loading แสดงแต่ไม่เปลี่ยนหน้า
- ✅ เช็ค console สำหรับ errors
- ✅ ตรวจสอบ path ของลิงก์ให้ถูกต้อง

### วีดีโอไม่เล่น
- ✅ ตรวจสอบ path: `../assets/images/loadd.mp4`
- ✅ ตรวจสอบว่าไฟล์มีอยู่จริง
- ✅ เทสบน browser อื่น

---

## 📚 เอกสารเพิ่มเติม

- 📖 **Full Guide**: `/docs/LOADING_SCREEN_GUIDE.md`
- 🎮 **Demo Page**: `/pages/loading-demo.html`
- 💻 **Source Code**: `/js/components/loading.js`
- 🎨 **Styles**: `/css/loading.css`

---

## 🎉 สรุป

Loading Screen ตอนนี้:
- ✅ แสดงเมื่อเปิดเว็บไซต์
- ✅ แสดงเมื่อเปลี่ยนหน้า (NEW!)
- ✅ รองรับ back/forward (NEW!)
- ✅ ป้องกัน double-click (NEW!)
- ✅ Smart link detection (NEW!)

**ผลลัพธ์**: ประสบการณ์การใช้งานที่ลื่นไหลและ professional มากขึ้น! 🚀

---

สร้างโดย Luckkana Star Team ⭐
