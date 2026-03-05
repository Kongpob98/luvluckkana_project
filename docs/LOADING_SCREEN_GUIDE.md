# Loading Screen Component 🎬

Loading Screen Component ที่ใช้วีดีโอ animation `loadd.mp4` เพื่อแสดงขณะที่หน้าเว็บกำลังโหลด **และระหว่างการเปลี่ยนหน้า (Page Navigation)**

## ✨ คุณสมบัติหลัก

- 🚀 **Auto-show เมื่อเปิดเว็บไซต์** - แสดงทันทีเมื่อโหลดหน้าครั้งแรก
- 🔄 **Auto-show เมื่อเปลี่ยนหน้า** - แสดงอัตโนมัติเมื่อคลิกลิงก์ภายในเว็บไซต์
- ⚡ **Auto-hide เมื่อโหลดเสร็จ** - ซ่อนอัตโนมัติด้วย smooth transition
- 🎥 **Seamless Video Animation** - วีดีโอ loop ไม่มีสะดุด
- 📱 **Responsive Design** - รองรับทุกขนาดหน้าจอ

## ไฟล์ที่เกี่ยวข้อง

- **CSS**: `/css/loading.css`
- **JavaScript**: `/js/components/loading.js`
- **Video**: `/assets/images/loadd.mp4`
- **Demo**: `/pages/loading-demo.html`

---

## การติดตั้ง

### 1. เพิ่ม CSS และ JavaScript ในหน้า HTML

```html
<!DOCTYPE html>
<html lang="th">
<head>
    <!-- เพิ่ม loading.css -->
    <link rel="stylesheet" href="../css/loading.css">
</head>
<body>
    <!-- เนื้อหาของคุณ -->
    
    <!-- เพิ่ม loading.js ก่อน closing body tag -->
    <script src="../js/components/loading.js"></script>
</body>
</html>
```

### 2. Loading จะทำงานอัตโนมัติ

เมื่อเพิ่มไฟล์แล้ว loading screen จะ:
- ✅ แสดงอัตโนมัติเมื่อเปิดหน้า
- ✅ แสดงอัตโนมัติเมื่อคลิกลิงก์ภายในเว็บไซต์ (Page Navigation)
- ✅ ซ่อนอัตโนมัติเมื่อหน้าโหลดเสร็จ (ขั้นต่ำ 1.5 วินาที)
- ✅ รองรับปุ่ม Back/Forward ของ Browser
- ✅ ป้องกันการ scroll ขณะแสดง loading

### 3. การทำงานกับ Page Navigation

Loading screen จะ **intercept** การคลิกลิงก์ภายในเว็บไซต์อัตโนมัติ:

```html
<!-- ลิงก์ภายในเว็บไซต์ - จะแสดง loading อัตโนมัติ -->
<a href="about.html">About Us</a>
<a href="contact.html">Contact</a>

<!-- ลิงก์ภายนอก - ไม่แสดง loading -->
<a href="https://google.com" target="_blank">Google</a>

<!-- ปิดการแสดง loading สำหรับลิงก์นี้ -->
<a href="page.html" data-no-loading>No Loading</a>
```

**การทำงาน:**
1. ผู้ใช้คลิกลิงก์ภายในเว็บไซต์
2. Loading screen แสดงทันที
3. รอ `minDisplayTime` (default: 1.5 วินาที)
4. เปลี่ยนไปหน้าใหม่
5. Loading screen ซ่อนเมื่อหน้าใหม่โหลดเสร็จ

---

## การใช้งาน

### แสดงและซ่อน Loading ด้วย JavaScript

```javascript
// แสดง loading
window.loadingScreen.show();

// ซ่อน loading
window.loadingScreen.hide();
```

### ตัวอย่างการใช้กับ API Call

```javascript
async function loadData() {
    // แสดง loading
    window.loadingScreen.show();
    
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // ซ่อน loading เมื่อเสร็จ
        window.loadingScreen.hide();
    }
}
```

### ตัวอย่างการโหลดหน้าแบบ SPA Navigation

```javascript
function navigateToPage(url) {
    window.loadingScreen.show();
    
    // โหลดเนื้อหาหน้าใหม่
    fetch(url)
        .then(response => response.text())
        .then(html => {
            // อัพเดทเนื้อหา
            document.getElementById('main-content').innerHTML = html;
        })
        .finally(() => {
            window.loadingScreen.hide();
        });
}
```

---

## การกำหนดค่า (Options)

สร้าง Loading Screen ใหม่ด้วย custom options:

```javascript
const customLoading = LoadingScreen.init({
    videoSrc: '../assets/images/loadd.mp4',  // ที่อยู่วีดีโอ animation
    minDisplayTime: 2000,                     // เวลาแสดงขั้นต่ำ (milliseconds)
    showProgress: true,                       // แสดงข้อความ "กำลังโหลด..."
    autoHide: true,                           // ซ่อนอัตโนมัติเมื่อหน้าโหลดเสร็จ
    interceptLinks: true                      // Intercept internal links สำหรับ page transition
});
```

### Options ทั้งหมด

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `videoSrc` | String | `'../assets/images/loadd.mp4'` | ที่อยู่ไฟล์วีดีโอ animation |
| `minDisplayTime` | Number | `1500` | เวลาแสดง loading ขั้นต่ำ (ms) |
| `showProgress` | Boolean | `true` | แสดงข้อความ "กำลังโหลด..." |
| `autoHide` | Boolean | `true` | ซ่อนอัตโนมัติเมื่อ `window.onload` |
| `interceptLinks` | Boolean | `true` | Intercept ลิงก์ภายในสำหรับ smooth page transition |

---

## การปรับแต่ง CSS

### เปลี่ยนขนาดวีดีโอ

```css
.loading-video {
    max-width: 800px;  /* ขนาดกว้างสูงสุด */
    max-height: 800px; /* ขนาดสูงสูงสุด */
}
```

### เปลี่ยนสีพื้นหลัง

```css
.loading-screen {
    background-color: #1a1a1a; /* เปลี่ยนจากสีดำ */
}
```

### เปลี่ยนเวลา Fade Out

```css
.loading-screen {
    transition: opacity 1s ease-out; /* เปลี่ยนจาก 0.5s เป็น 1s */
}
```

### ปรับแต่งข้อความ Loading

```css
.loading-progress {
    font-size: 24px;
    color: #8b5cf6;
    font-weight: 600;
}
```

---

## ตัวอย่างการใช้งานจริง

### 1. หน้า 12 Zodiac (12zodiac.html)
Loading screen แสดงอัตโนมัติเมื่อเปิดหน้า และซ่อนเมื่อโหลดเสร็จ

### 2. Demo Page (loading-demo.html)
หน้าทดสอบที่มีปุ่มควบคุม loading และตัวอย่างโค้ด

---

## คุณสมบัติ

✨ **คุณสมบัติหลัก**
- 🎥 แสดงวีดีโอ animation แบบ loop
- ⚡ Auto-show เมื่อเปิดหน้า
- 🔄 **Auto-show เมื่อเปลี่ยนหน้า (Page Navigation)**
- 🎯 Auto-hide เมื่อหน้าโหลดเสร็จ
- 🕐 กำหนดเวลาแสดงขั้นต่ำได้
- 🔒 ป้องกันการ scroll ขณะแสดง loading
- 📱 Responsive - รองรับทุกขนาดหน้าจอ
- 🎨 Smooth fade in/out animation
- 🎮 API ควบคุมผ่าน JavaScript
- ⏮️ **รองรับปุ่ม Back/Forward ของ Browser**

🎨 **Visual Effects**
- Fade in/out transition
- Loading text with animated dots
- Centered video animation
- Full-screen overlay

🔗 **Page Navigation Features**
- Intercept internal links อัตโนมัติ
- Smooth transition ระหว่างหน้า
- ป้องกัน double-click ระหว่าง navigation
- รองรับ Browser history (back/forward)
- ไม่ intercept ลิงก์ภายนอกหรือ `target="_blank"`

📱 **Responsive Design**
- Desktop: วีดีโอขนาด 600x600px
- Tablet (≤768px): วีดีโอขนาด 400x400px  
- Mobile (≤480px): วีดีโอขนาด 300x300px

---

## API Methods

### `LoadingScreen.init(options)`
สร้าง instance ใหม่ของ LoadingScreen

```javascript
const loading = LoadingScreen.init({
    minDisplayTime: 2000
});
```

### `show()`
แสดง loading screen

```javascript
window.loadingScreen.show();
```

### `hide()`
ซ่อน loading screen พร้อม fade out animation

```javascript
window.loadingScreen.hide();
```

---

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Tips

💡 **Best Practices**

1. **ใช้ minDisplayTime อย่างเหมาะสม**
   - เร็วเกินไป (< 1000ms): อาจดูกระตุก
   - ช้าเกินไป (> 3000ms): ผู้ใช้รอนาน
   - แนะนำ: 1500-2000ms

2. **ใช้กับหน้าที่มีเนื้อหาเยอะ**
   - หน้าแรก (index.html)
   - หน้าที่โหลดข้อมูลจาก API
   - หน้าที่มีรูปภาพหรือวีดีโอเยอะ

3. **Preload วีดีโอ**
   - วีดีโอควรมีขนาดไม่เกิน 1-2 MB
   - ใช้ format MP4 เพื่อ compatibility

4. **ทดสอบบน Mobile**
   - ตรวจสอบขนาดวีดีโอบนหน้าจอเล็ก
   - ทดสอบการ autoplay (บาง browser อาจบล็อก)

---

## Troubleshooting

### วีดีโอไม่เล่น
- ตรวจสอบ path ของ `videoSrc`
- ตรวจสอบว่าไฟล์ `loadd.mp4` มีอยู่จริง
- บาง browser บล็อก autoplay → เพิ่ม `muted` attribute

### Loading ไม่ซ่อน
- ตรวจสอบว่ามี error ใน console หรือไม่
- ตรวจสอบว่า `autoHide: true` ใน options
- ลอง call `window.loadingScreen.hide()` manually

### Loading แสดงช้า
- ลด `minDisplayTime` value
- ตรวจสอบขนาดไฟล์วีดีโอ
- ใช้ `preload="auto"` attribute

---

## เพิ่มเติม

🔗 **Related Files**
- Common CSS animations: `/css/common.css`
- Cursor trail: `/js/cursor-trail.js`

📝 **License**
Part of Luckkana Star project

---

## ตัวอย่างโค้ดเต็ม

```html
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <link rel="stylesheet" href="../css/loading.css">
</head>
<body>
    <h1>Welcome to my page</h1>
    
    <button onclick="loadSomething()">Load Data</button>
    
    <script src="../js/components/loading.js"></script>
    <script>
        async function loadSomething() {
            window.loadingScreen.show();
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            window.loadingScreen.hide();
            alert('Done!');
        }
    </script>
</body>
</html>
```

---

สร้างโดย Luckkana Star Team ⭐
