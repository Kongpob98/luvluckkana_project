// Birthday Fortune Form Component
(function() {
    const BIRTHDAY_FORM_STATE_KEY = 'luckkana-birthday-form-state';

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
        syncWeekdaySelection();
        populateYearDropdown();
        populateMonthDropdown();
        attachEventListeners();
        restoreFormState();

        // Always start at top of page
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function readPersistedFormState() {
        try {
            const rawState = sessionStorage.getItem(BIRTHDAY_FORM_STATE_KEY);
            return rawState ? JSON.parse(rawState) : null;
        } catch (error) {
            console.warn('Unable to parse birthday form state:', error);
            return null;
        }
    }

    function persistFormState(overrides = {}) {
        const firstName = document.getElementById('firstNameInput')?.value ?? '';
        const lastName = document.getElementById('lastNameInput')?.value ?? '';
        const birthTimeText = document.getElementById('birthTimeText')?.textContent?.trim() ?? '00:00 - 00:59';
        const activeBirthTimeItem = document.querySelector('#birthTimeDropdown .dropdown-item.active');
        const activeWeeklyTab = document.querySelector('.weekly-tab.active')?.dataset.target ?? 'weekContent1';

        const existingState = readPersistedFormState() || {};
        const nextState = {
            ...existingState,
            firstName,
            lastName,
            selectedDate,
            birthTimeText,
            birthTimeValue: activeBirthTimeItem?.dataset.value ?? birthTimeText,
            activeWeeklyTab,
            ...overrides
        };

        sessionStorage.setItem(BIRTHDAY_FORM_STATE_KEY, JSON.stringify(nextState));
    }

    function restoreBirthTimeSelection(birthTimeValue, birthTimeText) {
        const display = document.getElementById('birthTimeText');
        const dropdownItems = document.querySelectorAll('#birthTimeDropdown .dropdown-item');

        if (display && birthTimeText) {
            display.textContent = birthTimeText;
        }

        dropdownItems.forEach((item) => {
            const isActive = item.dataset.value === birthTimeValue || item.textContent.trim() === birthTimeText;
            item.classList.toggle('active', isActive);
        });
    }

    function restoreWeeklyTab(targetId) {
        if (!targetId) return;

        const weeklySection = document.getElementById('fortuneWeeklySection');
        if (!weeklySection) return;

        weeklySection.querySelectorAll('.weekly-tab').forEach((tab) => {
            tab.classList.toggle('active', tab.dataset.target === targetId);
        });

        weeklySection.querySelectorAll('.weekly-tab-content').forEach((content) => {
            content.classList.toggle('active', content.id === targetId);
        });
    }

    function restoreFormState() {
        const savedState = readPersistedFormState();
        if (!savedState) return;

        if (savedState.selectedDate && Number.isInteger(savedState.selectedDate.year) && Number.isInteger(savedState.selectedDate.month) && Number.isInteger(savedState.selectedDate.day)) {
            selectedDate = {
                year: savedState.selectedDate.year,
                month: savedState.selectedDate.month,
                day: savedState.selectedDate.day
            };

            normalizeSelectedDate();

            updateDateDisplay();
            renderCalendar();
            syncWeekdaySelection();
            populateYearDropdown();
            populateMonthDropdown();
        }

        const firstNameInput = document.getElementById('firstNameInput');
        const lastNameInput = document.getElementById('lastNameInput');

        if (firstNameInput && typeof savedState.firstName === 'string') {
            firstNameInput.value = savedState.firstName;
        }

        if (lastNameInput && typeof savedState.lastName === 'string') {
            lastNameInput.value = savedState.lastName;
        }

        restoreBirthTimeSelection(savedState.birthTimeValue, savedState.birthTimeText);

        if (savedState.resultName && savedState.fortuneData) {
            showFortuneResult(savedState.resultName, savedState.fortuneData, { scrollToResult: false });
            restoreWeeklyTab(savedState.activeWeeklyTab);
        }
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
        
        // Scroll selected item to center (inline only, don't affect page scroll)
        const selected = dateSliderContainer.querySelector('.date-item.selected');
        if (selected) {
            setTimeout(() => {
                dateSliderContainer.scrollLeft = selected.offsetLeft - dateSliderContainer.offsetWidth / 2 + selected.offsetWidth / 2;
            }, 100);
        }
    }

    // Get days in month
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Keep selected date aligned with real calendar limits
    function normalizeSelectedDate() {
        const maxDays = getDaysInMonth(selectedDate.year, selectedDate.month);
        if (selectedDate.day > maxDays) {
            selectedDate.day = maxDays;
        }
        if (selectedDate.day < 1) {
            selectedDate.day = 1;
        }
    }

    function syncWeekdaySelection() {
        const selectedWeekday = new Date(selectedDate.year, selectedDate.month, selectedDate.day).getDay();
        const weekdayBtns = document.querySelectorAll('.weekday');
        weekdayBtns.forEach((btn) => {
            const dayOfWeek = Number.parseInt(btn.dataset.day, 10);
            btn.classList.toggle('active', dayOfWeek === selectedWeekday);
        });
    }

    // Select date
    function selectDate(day) {
        selectedDate.day = day;
        updateDateDisplay();
        renderCalendar();
        syncWeekdaySelection();
        persistFormState();
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
        normalizeSelectedDate();
        updateDateDisplay();
        renderCalendar();
        syncWeekdaySelection();
        populateYearDropdown();
        closeAllDropdowns();
        persistFormState();
    }

    // Select Month
    function selectMonth(month) {
        selectedDate.month = month;
        normalizeSelectedDate();
        updateDateDisplay();
        renderCalendar();
        syncWeekdaySelection();
        populateMonthDropdown();
        closeAllDropdowns();
        persistFormState();
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

        const firstNameInput = document.getElementById('firstNameInput');
        const lastNameInput = document.getElementById('lastNameInput');

        firstNameInput?.addEventListener('input', () => persistFormState());
        lastNameInput?.addEventListener('input', () => persistFormState());

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

                    persistFormState();
                    
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
        const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);
        const currentDay = selectedDate.day;

        // Collect all dates in the current month that match selected weekday.
        const matchingDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedDate.year, selectedDate.month, day);
            if (date.getDay() === dayOfWeek) {
                matchingDays.push(day);
            }
        }

        if (matchingDays.length === 0) return;

        // Choose the nearest real date to current selection.
        let nearestDay = matchingDays[0];
        let minDistance = Math.abs(nearestDay - currentDay);

        for (let i = 1; i < matchingDays.length; i++) {
            const candidate = matchingDays[i];
            const distance = Math.abs(candidate - currentDay);
            if (distance < minDistance || (distance === minDistance && candidate > nearestDay)) {
                nearestDay = candidate;
                minDistance = distance;
            }
        }

        selectDate(nearestDay);
    }

    function showPrettyAlert(message, options = {}) {
        const {
            type = 'warning',
            autoCloseMs = 2600
        } = options;

        const previousPopup = document.querySelector('.fortune-popup-overlay');
        if (previousPopup) {
            previousPopup.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'fortune-popup-overlay';

        const popup = document.createElement('div');
        popup.className = `fortune-popup fortune-popup-${type}`;
        popup.setAttribute('role', 'alertdialog');
        popup.setAttribute('aria-modal', 'true');

        const icon = document.createElement('div');
        icon.className = 'fortune-popup-icon';
        icon.textContent = type === 'error' ? '!' : '\u26A0';

        const content = document.createElement('div');
        content.className = 'fortune-popup-content';

        const title = document.createElement('h4');
        title.className = 'fortune-popup-title';
        title.textContent = type === 'error' ? 'เกิดข้อผิดพลาด' : 'โปรดตรวจสอบข้อมูล';

        const text = document.createElement('p');
        text.className = 'fortune-popup-text';
        text.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'fortune-popup-close';
        closeBtn.textContent = 'รับทราบ';

        content.appendChild(title);
        content.appendChild(text);
        popup.appendChild(icon);
        popup.appendChild(content);
        popup.appendChild(closeBtn);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        const dismiss = () => {
            overlay.classList.add('closing');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 180);
        };

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) dismiss();
        });
        closeBtn.addEventListener('click', dismiss);

        const onEscape = (event) => {
            if (event.key === 'Escape') {
                dismiss();
                document.removeEventListener('keydown', onEscape);
            }
        };
        document.addEventListener('keydown', onEscape);

        setTimeout(() => {
            if (overlay.parentNode) dismiss();
        }, autoCloseMs);
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
            showPrettyAlert('กรุณากรอกชื่อจริง', { type: 'warning' });
            document.getElementById('firstNameInput')?.focus();
            return;
        }

        if (!lastName) {
            showPrettyAlert('กรุณากรอกนามสกุล', { type: 'warning' });
            document.getElementById('lastNameInput')?.focus();
            return;
        }

        if (!birthTime) {
            showPrettyAlert('กรุณาเลือกเวลาเกิด', { type: 'warning' });
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

            persistFormState({
                resultName: fullName,
                fortuneData: fortune
            });

            console.log('✅ Fortune data:', fortune);
            // Show result section with structured fortune data
            showFortuneResult(fullName, fortune);

        } catch (error) {
            console.error('❌ Error:', error);
            showPrettyAlert('เกิดข้อผิดพลาดในการคำนวณดวงชะตา กรุณาลองใหม่อีกครั้ง', {
                type: 'error',
                autoCloseMs: 4000
            });
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
        const prompt = `คุณคือผู้เชี่ยวชาญด้านโหราศาสตร์และดวงชะตา

ข้อมูลผู้ขอดูดวง:
- ชื่อ: ${fullName}
- วันเกิด: ${birthDate.day} ${monthNamesThai[birthDate.month - 1]} ${birthDate.year + 543} (${birthDate.day}/${birthDate.month}/${birthDate.year})
- เวลาเกิด: ${birthTime}

วิเคราะห์ดวงชะตาและตอบกลับเป็น JSON object เท่านั้น ห้ามมี markdown ห้ามมีข้อความอื่นนอกจาก JSON:
{
  "luckyColors": [
    {"name": "ชื่อสีภาษาไทย", "hex": "#RRGGBB", "meaning": "ความหมายสั้นๆ 2-4 คำ"},
    {"name": "ชื่อสีภาษาไทย", "hex": "#RRGGBB", "meaning": "ความหมายสั้นๆ 2-4 คำ"},
    {"name": "ชื่อสีภาษาไทย", "hex": "#RRGGBB", "meaning": "ความหมายสั้นๆ 2-4 คำ"}
  ],
  "luckyDirection": {
    "name": "ทิศ...",
    "meaning": "คำอธิบาย 1-2 ประโยค"
  },
  "weeklyFortune": {
    "love":   {"points": ["ประโยคทำนาย 3-5 ข้อ","ประโยคทำนาย","ประโยคทำนาย","ประโยคทำนาย"]},
    "money":  {"points": ["ประโยคทำนาย 3-5 ข้อ","ประโยคทำนาย","ประโยคทำนาย","ประโยคทำนาย"]},
    "career": {"points": ["ประโยคทำนาย 3-5 ข้อ","ประโยคทำนาย","ประโยคทำนาย","ประโยคทำนาย"]},
    "health": {"points": ["ประโยคทำนาย 3-5 ข้อ","ประโยคทำนาย","ประโยคทำนาย","ประโยคทำนาย"]}
  },
  "weeklyWarning": [
    "ข้อควรระวัง 1 (ประโยคเต็ม)",
    "ข้อควรระวัง 2",
    "ข้อควรระวัง 3",
    "ข้อควรระวัง 4",
    "ข้อควรระวัง 5"
  ],
  "luckyCalendar": [
    {"day": "จันทร์",   "color": "ชื่อสี", "hex": "#RRGGBB", "action": "สิ่งที่ได้จากสีนี้"},
    {"day": "อังคาร์",  "color": "ชื่อสี", "hex": "#RRGGBB", "action": "สิ่งที่ได้จากสีนี้"},
    {"day": "พุธ",    "color": "ชื่อสี", "hex": "#RRGGBB", "action": "สิ่งที่ได้จากสีนี้"},
    {"day": "พฤหัส",   "color": "ชื่อสี", "hex": "#RRGGBB", "action": "สิ่งที่ได้จากสีนี้"},
    {"day": "ศุกร์",   "color": "ชื่อสี", "hex": "#RRGGBB", "action": "สิ่งที่ได้จากสีนี้"},
    {"day": "เสาร์",   "color": "ชื่อสี", "hex": "#RRGGBB", "action": "สิ่งที่ได้จากสีนี้"},
    {"day": "อาทิตย์",  "color": "ชื่อสี", "hex": "#RRGGBB", "action": "สิ่งที่ได้จากสีนี้"}
  ]
}

กฎสำคัญ:
- luckyColors ต้องมีครบ 3 สี, hex ต้องถูกต้อง
- ชื่อทิศต้องขึ้นต้นด้วยคำว่า "ทิศ"
- weeklyFortune แต่ละด้านต้องมี points อย่างน้อย 3-5 ข้อ เป็นประโยคเต็ม ภาษาไทยสวยงาม
- weeklyWarning ต้องมีอย่างน้อย 4-6 รายการ เป็นประโยคเต็ม
- luckyCalendar ต้องมีครบทุก  7 วัน
- ตอบเป็น JSON เท่านั้น ไม่มีข้อความอื่น`;

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
                        message: prompt,
                        model: 'gemini-2.5-flash-lite'
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
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
            // Strip markdown code fences if Gemini wraps JSON in them
            const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            let fortuneData;
            try {
                fortuneData = JSON.parse(jsonText);
            } catch (parseErr) {
                console.warn('⚠️ JSON parse failed, using fallback data');
                fortuneData = {
                    luckyColors: [
                        { name: 'สีทอง', hex: '#D4AC0D', meaning: 'ความมั่งคั่ง' },
                        { name: 'สีแดง', hex: '#C0392B', meaning: 'ความรัก' },
                        { name: 'สีขาว', hex: '#ECF0F1', meaning: 'โชคลาภ' }
                    ],
                    luckyDirection: {
                        name: 'ทิศตะวันออก',
                        meaning: 'ทิศมงคลสำหรับการงานและความก้าวหน้า เสริมพลังชีวิตให้แก่ผู้ที่หันหน้าไปทางทิศนี้'
                    }
                };
            }
            return fortuneData;

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    // Show fortune result in Section 3
    function showFortuneResult(name, fortuneData, options = {}) {
        const { scrollToResult = true } = options;
        const resultSection = document.getElementById('fortuneResultSection');
        if (!resultSection) return;

        // --- User Name ---
        const userNameEl = document.getElementById('resultUserName');
        if (userNameEl) userNameEl.textContent = name;

        // --- Lucky Colors (3 circles) ---
        const colors = Array.isArray(fortuneData.luckyColors) ? fortuneData.luckyColors : [];
        colors.slice(0, 3).forEach((color, i) => {
            const idx = i + 1;
            const ball    = document.getElementById('colorBall'    + idx);
            const nameEl  = document.getElementById('colorName'    + idx);
            const meanEl  = document.getElementById('colorMeaning' + idx);

            if (ball) {
                ball.style.backgroundColor = color.hex || '#555';
                ball.style.boxShadow =
                    '0 0 28px ' + (color.hex || '#555') + 'aa, ' +
                    '0 0 56px ' + (color.hex || '#555') + '55';
            }
            if (nameEl) nameEl.textContent = color.name    || '—';
            if (meanEl) meanEl.textContent = color.meaning || '—';
        });

        // --- Lucky Direction ---
        const direction   = fortuneData.luckyDirection || {};
        const dirNameEl   = document.getElementById('directionName');
        const dirMeanEl   = document.getElementById('directionMeaning');
        const compassWrap = document.getElementById('compassNeedle');

        if (dirNameEl)  dirNameEl.textContent  = direction.name    || '—';
        if (dirMeanEl)  dirMeanEl.textContent   = direction.meaning || '—';

        // Rotate compass needle to match direction
        if (compassWrap && direction.name) {
            const degreesMap = {
                'ทิศเหนือ': 0,               'เหนือ': 0,
                'ทิศตะวันออกเฉียงเหนือ': 45,  'ตะวันออกเฉียงเหนือ': 45,
                'ทิศตะวันออก': 90,            'ตะวันออก': 90,
                'ทิศตะวันออกเฉียงใต้': 135,   'ตะวันออกเฉียงใต้': 135,
                'ทิศใต้': 180,               'ใต้': 180,
                'ทิศตะวันตกเฉียงใต้': 225,    'ตะวันตกเฉียงใต้': 225,
                'ทิศตะวันตก': 270,            'ตะวันตก': 270,
                'ทิศตะวันตกเฉียงเหนือ': 315,  'ตะวันตกเฉียงเหนือ': 315,
            };
            const deg = degreesMap[direction.name] ?? 0;
            // Delay so the transition is visible after section appears
            setTimeout(function() {
                compassWrap.style.transform = 'rotate(' + deg + 'deg)';
            }, 700);
        }

        // --- Reveal Section 3: remove waiting state ---
        resultSection.classList.remove('waiting');

        if (scrollToResult) {
            // Scroll to result section after short delay
            setTimeout(function() {
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 350);
        }

        // --- Populate & reveal Section 4 ---
        showWeeklySection(fortuneData);
    }

    // Populate Section 4 (week colors)
    function showWeeklySection(fortuneData) {
        const weeklySection = document.getElementById('fortuneWeeklySection');
        if (!weeklySection) return;

        // Helper: populate a bullet-point list
        function fillPoints(listId, points) {
            var el = document.getElementById(listId);
            if (!el || !Array.isArray(points) || points.length === 0) return;
            el.innerHTML = points.map(function(p) {
                return '<li>' + p + '</li>';
            }).join('');
        }

        // --- Tab 1: Weekly Fortune 4 cards ---
        var wf = fortuneData.weeklyFortune || {};
        fillPoints('lovePoints',   (wf.love   || {}).points);
        fillPoints('moneyPoints',  (wf.money  || {}).points);
        fillPoints('careerPoints', (wf.career || {}).points);
        fillPoints('healthPoints', (wf.health || {}).points);

        // --- Tab 2: Weekly Warning ---
        var warnings = fortuneData.weeklyWarning;
        if (Array.isArray(warnings) && warnings.length) {
            var warnList = document.getElementById('weeklyWarningList');
            if (warnList) {
                warnList.innerHTML = warnings.map(function(w) {
                    return '<li>' + w + '</li>';
                }).join('');
            }
        }

        // --- Tab 3: Lucky Calendar ---
        var calendar = fortuneData.luckyCalendar;
        var calGrid = document.getElementById('luckyCalendarGrid');
        if (calGrid && Array.isArray(calendar) && calendar.length) {
            calGrid.innerHTML = calendar.map(function(entry) {
                var hex = entry.hex || '#555';
                var luminance = hexLuminance(hex);
                var textColor = luminance > 0.45 ? '#111111' : '#ffffff';
                return '<div class="cal-day-card" style="background:' + hex + ';color:' + textColor + ';">'
                    + '<span class="cal-day-name">' + (entry.day || '') + '</span>'
                    + '<div class="cal-color-pill" style="background:rgba(255,255,255,0.22);color:inherit;">'
                    +   (entry.color || '') + '</div>'
                    + '<p class="cal-action">' + (entry.action || '') + '</p>'
                    + '</div>';
            }).join('');
        }

        // --- Tab switching logic ---
        if (weeklySection.dataset.tabsBound !== 'true') {
            var tabs = weeklySection.querySelectorAll('.weekly-tab');
            tabs.forEach(function(tab) {
                tab.addEventListener('click', function() {
                    tabs.forEach(function(t) { t.classList.remove('active'); });
                    weeklySection.querySelectorAll('.weekly-tab-content').forEach(function(c) {
                        c.classList.remove('active');
                    });
                    tab.classList.add('active');
                    var target = document.getElementById(tab.dataset.target);
                    if (target) target.classList.add('active');
                    persistFormState({ activeWeeklyTab: tab.dataset.target });
                });
            });
            weeklySection.dataset.tabsBound = 'true';
        }

        // --- Reveal Section 4 ---
        weeklySection.classList.remove('waiting');
    }

    // Calculate relative luminance to decide text color on calendar
    function hexLuminance(hex) {
        var r = parseInt(hex.slice(1,3),16)/255;
        var g = parseInt(hex.slice(3,5),16)/255;
        var b = parseInt(hex.slice(5,7),16)/255;
        r = r <= 0.03928 ? r/12.92 : Math.pow((r+0.055)/1.055,2.4);
        g = g <= 0.03928 ? g/12.92 : Math.pow((g+0.055)/1.055,2.4);
        b = b <= 0.03928 ? b/12.92 : Math.pow((b+0.055)/1.055,2.4);
        return 0.2126*r + 0.7152*g + 0.0722*b;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
