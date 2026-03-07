// Chinese Zodiac Flip Cards Data
const zodiacData = {
    rat: {
        nameTh: 'ปีชวด',
        traits: 'ฉลาด มีไหวพริบ มีเสน่ห์ เจ้าชู้',
        strengths: 'หลักแหลม ปรับตัวเก่ง ช่างสังเกต',
        weaknesses: 'ระแวดระวัง ชอบคิดมาก',
        careers: 'นักธุรกิจ นักเขียน ผู้บริหาร'
    },
    ox: {
        nameTh: 'ปีฉลู',
        traits: 'อดทน มั่นคง น่าเชื่อถือ ขยัน',
        strengths: 'มีความรับผิดชอบ มีจิตใจมั่นคง ซื่อสัตย์',
        weaknesses: 'ดื้อรั้น ยึดติดในแบบแผนเก่า',
        careers: 'วิศวกร เกษตรกร ผู้จัดการ'
    },
    tiger: {
        nameTh: 'ปีขาล',
        traits: 'กล้าหาญ มั่นใจ มีความเป็นผู้นำ',
        strengths: 'มีเสน่ห์ดึงดูด กล้าตัดสินใจ ตรงไปตรงมา',
        weaknesses: 'ชอบเสี่ยง ใจร้อน หุนหันพลันแล่น',
        careers: 'ผู้นำ ทหาร นักแสดง'
    },
    rabbit: {
        nameTh: 'ปีเถาะ',
        traits: 'อ่อนโยน นุ่มนวล มีรสนิยม',
        strengths: 'ใจกว้าง เห็นอกเห็นใจ สุภาพเรียบร้อย',
        weaknesses: 'อ่อนไหว หลีกเลี่ยงปัญหา',
        careers: 'ศิลปิน นักออกแบบ ที่ปรึกษา'
    },
    dragon: {
        nameTh: 'ปีมะโรง',
        traits: 'ทรงพลัง มั่นใจ ทะเยอทะยาน',
        strengths: 'มีความสามารถสูง มีเสน่ห์ มีโชคลาภ',
        weaknesses: 'ทะนงตัว ไม่อดทน',
        careers: 'CEO ผู้ประกอบการ นักการเมือง'
    },
    snake: {
        nameTh: 'ปีมะเส็ง',
        traits: 'ฉลาดล้ำลึก ลึกลับ สง่างาม',
        strengths: 'มีปัญญา วางแผนเป็น เชื่อมั่นในตัวเอง',
        weaknesses: 'หวงห้าม หึงหวง ขี้ระแวง',
        careers: 'นักวิจัย นักปรัชญา นักยุทธศาสตร์'
    },
    horse: {
        nameTh: 'ปีมะเมีย',
        traits: 'มีพลัง กระตือรือร้น รักอิสระ',
        strengths: 'กระฉับกระเฉง ตรงไปตรงมา มีพลังบวก',
        weaknesses: 'ใจร้อน ไม่อดทน ขี้ครรหา',
        careers: 'นักกีฬา นักท่องเที่ยว ผู้ประกาศ'
    },
    goat: {
        nameTh: 'ปีมะแม',
        traits: 'อ่อนโยน มีศิลปะ มีจินตนาการ',
        strengths: 'ใจดี มีความคิดสร้างสรรค์ เห็นอกเห็นใจ',
        weaknesses: 'ไร้ระเบียบ ขาดความมั่นใจ',
        careers: 'ศิลปิน นักดนตรี นักเขียน'
    },
    monkey: {
        nameTh: 'ปีวอก',
        traits: 'ฉลาด ซุกซน มีไหวพริบ',
        strengths: 'คิดไว ปรับตัวเก่ง ตลก',
        weaknesses: 'ซุกซน ไว้ใจไม่ได้ ขี้หลอกลวง',
        careers: 'นักประดิษฐ์ นักพูด นักขาย'
    },
    rooster: {
        nameTh: 'ปีระกา',
        traits: 'มั่นใจ สง่างาม ตรงต่อเวลา',
        strengths: 'ซื่อตรง มีมารยาท มีระเบียบวินัย',
        weaknesses: 'ไม่ถนอมน้ำใจ พูดตรงไป วิจารณ์',
        careers: 'ผู้จัดการ นักบัญชี ทันตแพทย์'
    },
    dog: {
        nameTh: 'ปีจอ',
        traits: 'ซื่อสัตย์ จงรักภักดี มีศีลธรรม',
        strengths: 'ซื่อสัตย์ รับผิดชอบ ใจดี',
        weaknesses: 'วิตกกังวล กระรอกจี๊ด ระแวง',
        careers: 'ตำรวจ ทนายความ ครู'
    },
    pig: {
        nameTh: 'ปีกุน',
        traits: 'ใจดี เอื้ออาทร สุภาพเรียบร้อย',
        strengths: 'ใจกว้าง เมตตา เป็นที่พึ่งได้',
        weaknesses: 'ไร้เดียงสา หลอกง่าย ฟุ้งซ่าน',
        careers: 'พ่อครัว เกษตรกร นักสังคมสงเคราะห์'
    }
};

// Initialize flip functionality
function initZodiacFlipCards() {
    const cards = document.querySelectorAll('.zodiac-card');
    
    cards.forEach(card => {
        const zodiacType = card.getAttribute('data-zodiac');
        const data = zodiacData[zodiacType];
        
        if (!data) return;
        
        // Create card structure with flip
        const flipper = document.createElement('div');
        flipper.className = 'zodiac-card-flipper';
        
        // Move existing content to front
        const existingInner = card.querySelector('.zodiac-card-inner');
        if (existingInner) {
            existingInner.classList.add('zodiac-card-front');
            flipper.appendChild(existingInner);
        }
        
        // Create back content
        const back = document.createElement('div');
        back.className = 'zodiac-card-inner zodiac-card-back';
        back.innerHTML = `
            <div class="zodiac-card-back-content">
                <h3 class="zodiac-back-title">${data.nameTh}</h3>
                <div class="zodiac-back-info">
                    <p><strong>ลักษณะนิสัย:</strong> ${data.traits}</p>
                    <p><strong>จุดเด่น:</strong> ${data.strengths}</p>
                    <p><strong>จุดด้อย:</strong> ${data.weaknesses}</p>
                    <p><strong>อาชีพที่เหมาะสม:</strong> ${data.careers}</p>
                </div>
                <button class="flip-back-btn">กลับ</button>
            </div>
        `;
        
        flipper.appendChild(back);
        
        // Clear card and add flipper
        card.innerHTML = '';
        card.appendChild(flipper);
        
        // Add click event to flip
        card.addEventListener('click', (e) => {
            // Don't flip if clicking on back button or its children
            if (e.target.closest('.flip-back-btn')) {
                e.preventDefault();
                e.stopPropagation();
                card.classList.remove('flipped');
                return;
            }
            
            // Don't flip if clicking inside back content (except the button)
            if (e.target.closest('.zodiac-card-back') && card.classList.contains('flipped')) {
                return;
            }
            
            // Only flip active cards
            if (card.classList.contains('active')) {
                card.classList.toggle('flipped');
            }
        });
        
        // Add direct click event to back button as backup
        const backBtn = back.querySelector('.flip-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                card.classList.remove('flipped');
            });
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZodiacFlipCards);
} else {
    initZodiacFlipCards();
}
