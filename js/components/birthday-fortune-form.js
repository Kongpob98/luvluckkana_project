// Birthday Fortune Form Component
(function() {
    // State
    let selectedDate = {
        year: 2025,
        month: 2, // February (0-indexed)
        day: 9
    };

    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    const monthNamesThai = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    // Gemini API Configuration (same as chatbot)
    const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const USE_SERVERLESS = IS_PRODUCTION;
    const GEMINI_API_KEY = window.CONFIG?.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';
    const SERVERLESS_API_URL = '/api/gemini';

    // Initialize
    function init() {
        console.log('🔮 Birthday Fortune Form initialized');
        
        // Set default date to today
        const today = new Date();
        selectedDate = {
            year: today.getFullYear(),
            month: today.getMonth(),
            day: today.getDate()
        };

        renderCalendar();
        updateDateDisplay();
        populateYearDropdown();
        populateMonthDropdown();
        attachEventListeners();
    }

    // Render Circular Calendar
    function renderCalendar() {
        renderDateSlider();
    }

    // Render Date Slider
    function renderDateSlider() {
        const dateSliderContainer = document.getElementById('dateSlider');
        if (!dateSliderContainer) return;

        const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);
        dateSliderContainer.innerHTML = '';

        // Create date items for all days in the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateItem = document.createElement('button');
            dateItem.className = 'date-item';
            dateItem.textContent = day;
            dateItem.dataset.day = day;

            // Mark selected date
            if (day === selectedDate.day) {
                dateItem.classList.add('selected');
            }

            // Click handler
            dateItem.addEventListener('click', () => {
                selectDate(day);
            });

            dateSliderContainer.appendChild(dateItem);
        }
        
        // Scroll selected item to center
        const selected = dateSliderContainer.querySelector('.date-item.selected');
        if (selected) {
            setTimeout(() => {
                selected.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }, 100);
        }
    }

    // Get days in month
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Select date
    function selectDate(day) {
        selectedDate.day = day;
        updateDateDisplay();
        renderCalendar();
        console.log('📅 Selected date:', selectedDate);
    }

    // Update date display
    function updateDateDisplay() {
        const yearText = document.querySelector('.year-text');
        const monthText = document.querySelector('.month-text');
        const dayDisplay = document.getElementById('dayDisplay');

        if (yearText) {
            yearText.textContent = selectedDate.year;
        }

        if (monthText) {
            monthText.textContent = monthNames[selectedDate.month];
        }

        if (dayDisplay) {
            dayDisplay.textContent = String(selectedDate.day).padStart(2, '0');
        }
    }

    // Populate Year Dropdown
    function populateYearDropdown() {
        const yearDropdown = document.getElementById('yearDropdown');
        if (!yearDropdown) return;

        const dropdownScroll = yearDropdown.querySelector('.dropdown-scroll');
        if (!dropdownScroll) return;

        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 100;
        const endYear = currentYear + 50;

        dropdownScroll.innerHTML = '';
        for (let year = endYear; year >= startYear; year--) {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            if (year === selectedDate.year) {
                item.classList.add('active');
            }
            item.textContent = year;
            item.addEventListener('click', () => selectYear(year));
            dropdownScroll.appendChild(item);
        }
    }

    // Populate Month Dropdown
    function populateMonthDropdown() {
        const monthDropdown = document.getElementById('monthDropdown');
        if (!monthDropdown) return;

        const dropdownScroll = monthDropdown.querySelector('.dropdown-scroll');
        if (!dropdownScroll) return;

        dropdownScroll.innerHTML = '';
        monthNames.forEach((monthName, index) => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            if (index === selectedDate.month) {
                item.classList.add('active');
            }
            item.textContent = monthName;
            item.addEventListener('click', () => selectMonth(index));
            dropdownScroll.appendChild(item);
        });
    }

    // Select Year
    function selectYear(year) {
        selectedDate.year = year;
        updateDateDisplay();
        renderCalendar();
        populateYearDropdown();
        closeAllDropdowns();
    }

    // Select Month
    function selectMonth(month) {
        selectedDate.month = month;
        updateDateDisplay();
        renderCalendar();
        populateMonthDropdown();
        closeAllDropdowns();
    }

    // Close all dropdowns
    function closeAllDropdowns() {
        const yearDropdown = document.getElementById('yearDropdown');
        const monthDropdown = document.getElementById('monthDropdown');
        const birthTimeDropdown = document.getElementById('birthTimeDropdown');
        
        if (yearDropdown) yearDropdown.classList.remove('show');
        if (monthDropdown) monthDropdown.classList.remove('show');
        if (birthTimeDropdown) birthTimeDropdown.classList.remove('show');
    }

    // Position dropdown under button
    function positionDropdownUnderButton(button, dropdown) {
        if (!button || !dropdown) return;
        
        const buttonRect = button.getBoundingClientRect();
        const dateSelector = document.querySelector('.date-selector');
        if (!dateSelector) return;
        
        const selectorRect = dateSelector.getBoundingClientRect();
        
        // Calculate position relative to date-selector
        const leftOffset = buttonRect.left + (buttonRect.width / 2) - (selectorRect.left + selectorRect.width / 2);
        
        dropdown.style.left = `calc(50% + ${leftOffset}px)`;
    }

    // Attach event listeners
    function attachEventListeners() {
        // Tab switching (Monthly/Year)
        const monthlyTab = document.getElementById('monthlyTab');
        const yearTab = document.getElementById('yearTab');

        if (monthlyTab) {
            monthlyTab.addEventListener('click', (e) => {
                switchTab('monthly');
                // Open only month dropdown when clicking Monthly tab
                const yearDropdown = document.getElementById('yearDropdown');
                const monthDropdown = document.getElementById('monthDropdown');
                
                if (monthDropdown) {
                    const isVisible = monthDropdown.classList.contains('show');
                    
                    // Close year dropdown
                    if (yearDropdown) {
                        yearDropdown.classList.remove('show');
                    }
                    
                    if (isVisible) {
                        monthDropdown.classList.remove('show');
                    } else {
                        // Position dropdown under the button
                        positionDropdownUnderButton(monthlyTab, monthDropdown);
                        monthDropdown.classList.add('show');
                        
                        // Scroll to active item
                        setTimeout(() => {
                            const activeMonth = monthDropdown.querySelector('.dropdown-item.active');
                            if (activeMonth) activeMonth.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        }, 100);
                    }
                }
            });
        }

        if (yearTab) {
            yearTab.addEventListener('click', (e) => {
                switchTab('year');
                // Open only year dropdown when clicking Year tab
                const yearDropdown = document.getElementById('yearDropdown');
                const monthDropdown = document.getElementById('monthDropdown');
                
                if (yearDropdown) {
                    const isVisible = yearDropdown.classList.contains('show');
                    
                    // Close month dropdown
                    if (monthDropdown) {
                        monthDropdown.classList.remove('show');
                    }
                    
                    if (isVisible) {
                        yearDropdown.classList.remove('show');
                    } else {
                        // Position dropdown under the button
                        positionDropdownUnderButton(yearTab, yearDropdown);
                        yearDropdown.classList.add('show');
                        
                        // Scroll to active item
                        setTimeout(() => {
                            const activeYear = yearDropdown.querySelector('.dropdown-item.active');
                            if (activeYear) activeYear.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        }, 100);
                    }
                }
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            const yearDropdown = document.getElementById('yearDropdown');
            const monthDropdown = document.getElementById('monthDropdown');
            const dateSelector = document.querySelector('.date-selector');

            if (dateSelector && !dateSelector.contains(e.target)) {
                if (yearDropdown) yearDropdown.classList.remove('show');
                if (monthDropdown) monthDropdown.classList.remove('show');
            }
        });

        // Weekday selection
        const weekdayBtns = document.querySelectorAll('.weekday');
        weekdayBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const dayOfWeek = parseInt(this.dataset.day);
                selectByWeekday(dayOfWeek);
                
                // Highlight selected weekday
                weekdayBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Submit button
        const submitBtn = document.getElementById('fortuneSubmitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', handleSubmit);
        }

        // Birth time dropdown
        const birthTimeDisplay = document.getElementById('birthTimeDisplay');
        const birthTimeDropdown = document.getElementById('birthTimeDropdown');
        
        if (birthTimeDisplay) {
            birthTimeDisplay.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = birthTimeDropdown.classList.contains('show');
                
                if (isVisible) {
                    birthTimeDropdown.classList.remove('show');
                } else {
                    birthTimeDropdown.classList.add('show');
                    
                    // Scroll to active item
                    setTimeout(() => {
                        const activeItem = birthTimeDropdown.querySelector('.dropdown-item.active');
                        if (activeItem) {
                            activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        }
                    }, 100);
                }
            });
        }

        // Birth time dropdown items
        if (birthTimeDropdown) {
            const dropdownItems = birthTimeDropdown.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', () => {
                    const value = item.dataset.value;
                    const text = item.textContent;
                    
                    // Update display
                    const birthTimeText = document.getElementById('birthTimeText');
                    if (birthTimeText) {
                        birthTimeText.textContent = text;
                    }
                    
                    // Update active state
                    dropdownItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    
                    // Close dropdown
                    birthTimeDropdown.classList.remove('show');
                });
            });
        }

        // Close birth time dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const birthTimeSelector = document.querySelector('.birth-time-selector');
            const birthTimeDropdown = document.getElementById('birthTimeDropdown');
            
            if (birthTimeSelector && birthTimeDropdown && !birthTimeSelector.contains(e.target)) {
                birthTimeDropdown.classList.remove('show');
            }
        });
    }

    // Switch tab
    function switchTab(type) {
        const monthlyTab = document.getElementById('monthlyTab');
        const yearTab = document.getElementById('yearTab');

        if (type === 'monthly') {
            monthlyTab?.classList.add('active');
            yearTab?.classList.remove('active');
        } else {
            monthlyTab?.classList.remove('active');
            yearTab?.classList.add('active');
        }
    }

    // Select date by weekday
    function selectByWeekday(dayOfWeek) {
        // Find the next occurrence of this weekday in current month
        const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);
        const currentDay = selectedDate.day;
        
        // Start from current day and find next matching weekday
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedDate.year, selectedDate.month, day);
            if (date.getDay() === dayOfWeek) {
                // Found a match
                if (day >= currentDay || currentDay > daysInMonth) {
                    selectDate(day);
                    return;
                }
            }
        }
        
        // If not found after current day, get first occurrence
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedDate.year, selectedDate.month, day);
            if (date.getDay() === dayOfWeek) {
                selectDate(day);
                return;
            }
        }
    }

    // Handle form submit
    async function handleSubmit(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstNameInput')?.value.trim();
        const lastName = document.getElementById('lastNameInput')?.value.trim();
        const fullName = `${firstName} ${lastName}`.trim();
        const birthTime = document.getElementById('birthTimeText')?.textContent;

        // Validation
        if (!firstName) {
            alert('กรุณากรอกชื่อจริง');
            document.getElementById('firstNameInput')?.focus();
            return;
        }

        if (!lastName) {
            alert('กรุณากรอกนามสกุล');
            document.getElementById('lastNameInput')?.focus();
            return;
        }

        if (!birthTime) {
            alert('กรุณาเลือกเวลาเกิด');
            return;
        }

        // Format date for display
        const formattedDate = `${selectedDate.day} ${monthNamesThai[selectedDate.month]} ${selectedDate.year + 543}`; // Convert to Buddhist year
        const birthData = {
            fullName,
            birthDate: {
                day: selectedDate.day,
                month: selectedDate.month + 1,
                year: selectedDate.year,
                formatted: formattedDate
            },
            birthTime
        };

        console.log('📋 Birth data:', birthData);

        // Show loading state
        const submitBtn = document.getElementById('fortuneSubmitBtn');
        const originalText = submitBtn?.querySelector('.btn-text')?.textContent;
        if (submitBtn) {
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('.btn-text');
            if (btnText) btnText.textContent = '⏳ กำลังคำนวณ...';
        }

        try {
            // Get fortune prediction from Gemini
            const fortune = await getFortunePrediction(birthData);
            
            // Store data in localStorage for result page
            localStorage.setItem('fortuneData', JSON.stringify({
                ...birthData,
                fortune,
                timestamp: new Date().toISOString()
            }));

            // Navigate to result page (you might want to create this)
            console.log('✅ Fortune prediction:', fortune);
            alert(`🔮 ดวงชะตาของคุณ ${fullName}\n\nเกิดวันที่: ${formattedDate}\nเวลา: ${birthTime}\n\n${fortune}`);
            
            // TODO: Navigate to result page
            // window.location.href = '/pages/birthday-fortune-result.html';

        } catch (error) {
            console.error('❌ Error:', error);
            alert('เกิดข้อผิดพลาดในการคำนวณดวงชะตา กรุณาลองใหม่อีกครั้ง');
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                const btnText = submitBtn.querySelector('.btn-text');
                if (btnText) btnText.textContent = originalText;
            }
        }
    }

    // Get fortune prediction from Gemini API
    async function getFortunePrediction(birthData) {
        const { fullName, birthDate, birthTime } = birthData;
        
        // Create prompt for Gemini
        const prompt = `คุณคือหมอดูมืออาชีพที่มีความเชี่ยวชาญด้านโหราศาสตร์และดวงชะตา

กรุณาทำนายดวงชะตาของบุคคลที่มีข้อมูลดังนี้:
- ชื่อ: ${fullName}
- วันเกิด: ${birthDate.day} ${monthNamesThai[birthDate.month - 1]} ${birthDate.year + 543} (${birthDate.day}/${birthDate.month}/${birthDate.year})
- เวลาเกิด: ${birthTime}

โปรดวิเคราะห์และทำนายดวงชะตาในด้านต่อไปนี้:
1. 💕 ความรัก - เรื่องราวความรัก คู่ครอง เนื้อคู่
2. 💰 การเงิน - โชคลาภ ความมั่งคั่ง การเงิน
3. 💼 การงาน - อาชีพการงาน ความก้าวหน้า
4. 🏥 สุขภาพ - สุขภาพร่างกายและจิตใจ
5. 🌟 โชคลาภ - ดวงดาว โชคชะตา

รูปแบบการตอบ:
- ใช้ภาษาไทยที่สวยงาม น่าเชื่อถือ และให้กำลังใจ
- แบ่งเป็นหัวข้อชัดเจน ใช้ emoji ประกอบ
- ความยาวประมาณ 300-400 คำ
- ให้คำทำนายที่มีเหตุผลและสร้างแรงบันดาลใจ
- หลีกเลี่ยงการพูดแบบลบหรือน่ากลัวมากเกินไป

กรุณาเริ่มทำนายดวงชะตาเลยค่ะ:`;

        try {
            let response;

            if (USE_SERVERLESS) {
                // Use Vercel Serverless Function
                response = await fetch(SERVERLESS_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: prompt }]
                            }
                        ]
                    })
                });
            } else {
                // Use direct API call (development)
                response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: prompt }]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024
                        }
                    })
                });
            }

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const fortuneText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'ไม่สามารถทำนายดวงได้ในขณะนี้';

            return fortuneText;

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
