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

    // Gemini API Configuration
    const GEMINI_MODEL = 'gemini-2.5-flash';
    const SERVERLESS_API_URL = '/api/gemini';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    function getDirectGeminiApiKey() {
        const apiKey = typeof window.CONFIG?.GEMINI_API_KEY === 'string'
            ? window.CONFIG.GEMINI_API_KEY.trim()
            : '';

        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            return '';
        }

        return apiKey;
    }

    function getServerlessApiCandidates() {
        const configuredUrl = typeof window.CONFIG?.SERVERLESS_API_URL === 'string'
            ? window.CONFIG.SERVERLESS_API_URL.trim()
            : '';

        const candidates = [
            configuredUrl,
            SERVERLESS_API_URL,
            'http://localhost:3000/api/gemini',
            'http://127.0.0.1:3000/api/gemini'
        ].filter(Boolean);

        return [...new Set(candidates)];
    }

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

        if (savedState.resultSource === 'api' && savedState.resultName && savedState.fortuneData) {
            try {
                const normalizedSavedFortune = normalizeFortuneData(savedState.fortuneData);
                showFortuneResult(savedState.resultName, normalizedSavedFortune, { scrollToResult: false });
                restoreWeeklyTab(savedState.activeWeeklyTab);
            } catch (error) {
                console.warn('Skipping invalid saved fortune data:', error);
            }
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
            monthText.textContent = monthNamesThai[selectedDate.month];
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
        monthNamesThai.forEach((monthName, index) => {
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

    function extractJsonObject(text) {
        if (!text || typeof text !== 'string') return null;

        let start = -1;
        let depth = 0;
        let inString = false;
        let isEscaped = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (inString) {
                if (isEscaped) {
                    isEscaped = false;
                    continue;
                }
                if (char === '\\') {
                    isEscaped = true;
                    continue;
                }
                if (char === '"') {
                    inString = false;
                }
                continue;
            }

            if (char === '"') {
                inString = true;
                continue;
            }

            if (char === '{') {
                if (depth === 0) {
                    start = i;
                }
                depth += 1;
                continue;
            }

            if (char === '}') {
                if (depth > 0) {
                    depth -= 1;
                    if (depth === 0 && start !== -1) {
                        return text.slice(start, i + 1);
                    }
                }
            }
        }

        return null;
    }

    function formatFortuneErrorMessage(error) {
        const message = typeof error?.message === 'string' ? error.message : '';
        const lowerMessage = message.toLowerCase();

        if (/API key not configured/i.test(message)) {
            return 'เซิร์ฟเวอร์ยังไม่ตั้งค่า GEMINI_API_KEY กรุณาตั้งค่า Environment Variable แล้วลองใหม่';
        }

        if (/no GEMINI_API_KEY configured in js\/config\.js/i.test(message)) {
            return 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน js/config.js และ API server ก็ยังไม่พร้อมใช้งาน';
        }

        if (/API key not valid|invalid API key|permission denied/i.test(message)) {
            return 'GEMINI_API_KEY ไม่ถูกต้องหรือไม่มีสิทธิ์ใช้งาน กรุณาตรวจสอบ key อีกครั้ง';
        }

        if (
            /status\s*503|api error:\s*503|\b503\b/i.test(message) ||
            lowerMessage.includes('high demand') ||
            lowerMessage.includes('spikes in demand') ||
            lowerMessage.includes('try again later') ||
            lowerMessage.includes('temporarily unavailable')
        ) {
            return 'ขณะนี้มีผู้ใช้งานจำนวนมาก ระบบยังประมวลผลไม่ทัน\nกรุณาลองใหม่อีกครั้ง';
        }

        if (/status\s*429|api error:\s*429|\b429\b|quota|rate limit/i.test(message)) {
            return 'มีคำขอใช้งานจำนวนมากในขณะนี้\nกรุณาลองใหม่อีกครั้ง';
        }

        if (/Failed to fetch|NetworkError|Load failed|endpoint not found|status 404|Cannot reach Gemini API endpoint/i.test(message)) {
            return 'เชื่อมต่อ API ไม่ได้ กรุณาเปิด API server (`npm run dev:api`) แล้วลองใหม่อีกครั้ง';
        }

        if (/invalid json|missing required field/i.test(message)) {
            return 'ระบบได้รับข้อมูลทำนายไม่ถูกต้องจาก API กรุณาลองใหม่อีกครั้ง';
        }

        return 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง';
    }

    async function fetchFortuneViaDirectGemini(prompt, options = {}) {
        const { strictJson = false } = options;
        const apiKey = getDirectGeminiApiKey();
        if (!apiKey) {
            throw new Error('no GEMINI_API_KEY configured in js/config.js');
        }

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            cache: 'no-store',
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
                    temperature: strictJson ? 0.2 : 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json'
                }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.error?.message || data?.error || `Gemini direct API Error: ${response.status}`);
        }

        return data;
    }

    function parseFortuneFromGeminiData(data) {
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const cleanedText = rawText.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
        const extractedJsonText = extractJsonObject(cleanedText) || cleanedText;

        let fortuneData;
        try {
            fortuneData = JSON.parse(extractedJsonText);
        } catch (parseError) {
            const normalizedText = extractedJsonText
                .replace(/[\u201C\u201D]/g, '"')
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/,\s*([}\]])/g, '$1')
                .trim();

            try {
                fortuneData = JSON.parse(normalizedText);
            } catch (secondParseError) {
                throw new Error(`Gemini returned invalid JSON: ${secondParseError.message}`);
            }
        }

        return normalizeFortuneData(fortuneData);
    }

        function buildFortunePrompt(birthData, options = {}) {
                const { strict = false } = options;
                const { fullName, birthDate, birthTime } = birthData;

                const extraStrictRule = strict
                        ? '\n- เขียนสั้น กระชับ ไม่เกิน 90 ตัวอักษรต่อข้อความ และคง JSON ให้สมบูรณ์'
                        : '';

                return `คุณคือผู้เชี่ยวชาญด้านโหราศาสตร์และดวงชะตา

ข้อมูลผู้ขอดูดวง:
- ชื่อ: ${fullName}
- วันเกิด: ${birthDate.day} ${monthNamesThai[birthDate.month - 1]} ${birthDate.year + 543} (${birthDate.day}/${birthDate.month}/${birthDate.year})
- เวลาเกิด: ${birthTime}

ตอบกลับเป็น JSON object เท่านั้น (ห้าม markdown และห้ามมีข้อความอื่น):
{
    "luckyColors": [
        {"name": "ชื่อสีภาษาไทย", "hex": "#RRGGBB", "meaning": "ความหมายสั้นๆ"},
        {"name": "ชื่อสีภาษาไทย", "hex": "#RRGGBB", "meaning": "ความหมายสั้นๆ"},
        {"name": "ชื่อสีภาษาไทย", "hex": "#RRGGBB", "meaning": "ความหมายสั้นๆ"}
    ],
    "luckyDirection": {
        "name": "ทิศ...",
        "meaning": "คำอธิบายสั้น 1 ประโยค"
    },
    "weeklyFortune": {
        "love": {"points": ["...", "...", "..."]},
        "money": {"points": ["...", "...", "..."]},
        "career": {"points": ["...", "...", "..."]},
        "health": {"points": ["...", "...", "..."]}
    },
    "weeklyWarning": ["...", "...", "...", "..."],
    "luckyCalendar": [
        {"day": "จันทร์", "color": "ชื่อสี", "hex": "#RRGGBB", "action": "ผลลัพธ์สั้นๆ"},
        {"day": "อังคาร", "color": "ชื่อสี", "hex": "#RRGGBB", "action": "ผลลัพธ์สั้นๆ"},
        {"day": "พุธ", "color": "ชื่อสี", "hex": "#RRGGBB", "action": "ผลลัพธ์สั้นๆ"},
        {"day": "พฤหัส", "color": "ชื่อสี", "hex": "#RRGGBB", "action": "ผลลัพธ์สั้นๆ"},
        {"day": "ศุกร์", "color": "ชื่อสี", "hex": "#RRGGBB", "action": "ผลลัพธ์สั้นๆ"},
        {"day": "เสาร์", "color": "ชื่อสี", "hex": "#RRGGBB", "action": "ผลลัพธ์สั้นๆ"},
        {"day": "อาทิตย์", "color": "ชื่อสี", "hex": "#RRGGBB", "action": "ผลลัพธ์สั้นๆ"}
    ]
}

กฎสำคัญ:
- luckyColors ต้องมี 3 รายการพอดี และ hex ถูกต้อง
- luckyDirection.name ต้องขึ้นต้นด้วยคำว่า "ทิศ"
- weeklyFortune แต่ละด้านมี points 3 รายการพอดี
- weeklyWarning มี 4 รายการพอดี
- luckyCalendar มีครบ 7 วันพอดี
- ห้าม trailing comma และต้อง parse JSON ได้${extraStrictRule}`;
        }

    function normalizeFortuneData(rawData) {
        const safeData = rawData && typeof rawData === 'object' ? rawData : {};
        const hexPattern = /^#[0-9A-Fa-f]{6}$/;

        function normalizeTextArray(items) {
            return (Array.isArray(items) ? items : [])
                .map((item) => (typeof item === 'string' ? item.trim() : ''))
                .filter(Boolean);
        }

        function ensureMinItems(primaryItems, minCount, fieldName) {
            const result = normalizeTextArray(primaryItems);

            if (result.length < minCount) {
                throw new Error(`API response missing required field: ${fieldName}`);
            }

            return result;
        }

        const luckyColors = (Array.isArray(safeData.luckyColors) ? safeData.luckyColors : [])
            .map((color) => ({
                name: typeof color?.name === 'string' ? color.name.trim() : '',
                hex: typeof color?.hex === 'string' ? color.hex.trim() : '',
                meaning: typeof color?.meaning === 'string' ? color.meaning.trim() : ''
            }))
            .filter((color) => color.name && color.meaning && hexPattern.test(color.hex));

        if (luckyColors.length < 3) {
            throw new Error('API response missing required field: luckyColors');
        }

        const luckyDirection = safeData.luckyDirection && typeof safeData.luckyDirection === 'object'
            ? {
                name: typeof safeData.luckyDirection.name === 'string' ? safeData.luckyDirection.name.trim() : '',
                meaning: typeof safeData.luckyDirection.meaning === 'string' ? safeData.luckyDirection.meaning.trim() : ''
            }
            : { name: '', meaning: '' };

        if (!luckyDirection.name || !luckyDirection.meaning) {
            throw new Error('API response missing required field: luckyDirection');
        }

        const weeklyFortune = safeData.weeklyFortune && typeof safeData.weeklyFortune === 'object'
            ? safeData.weeklyFortune
            : {};

        const normalizedWeeklyFortune = {
            love: {
                points: ensureMinItems(
                    weeklyFortune?.love?.points,
                    3,
                    'weeklyFortune.love.points'
                )
            },
            money: {
                points: ensureMinItems(
                    weeklyFortune?.money?.points,
                    3,
                    'weeklyFortune.money.points'
                )
            },
            career: {
                points: ensureMinItems(
                    weeklyFortune?.career?.points,
                    3,
                    'weeklyFortune.career.points'
                )
            },
            health: {
                points: ensureMinItems(
                    weeklyFortune?.health?.points,
                    3,
                    'weeklyFortune.health.points'
                )
            }
        };

        const weeklyWarning = ensureMinItems(safeData.weeklyWarning, 4, 'weeklyWarning');

        const luckyCalendar = (Array.isArray(safeData.luckyCalendar) ? safeData.luckyCalendar : [])
            .map((entry) => ({
                day: typeof entry?.day === 'string' ? entry.day.trim() : '',
                color: typeof entry?.color === 'string' ? entry.color.trim() : '',
                hex: typeof entry?.hex === 'string' ? entry.hex.trim() : '',
                action: typeof entry?.action === 'string' ? entry.action.trim() : ''
            }))
            .filter((entry) => entry.day && entry.color && entry.action && hexPattern.test(entry.hex));

        if (luckyCalendar.length < 7) {
            throw new Error('API response missing required field: luckyCalendar');
        }

        return {
            luckyColors: luckyColors.slice(0, 3),
            luckyDirection,
            weeklyFortune: normalizedWeeklyFortune,
            weeklyWarning,
            luckyCalendar: luckyCalendar.slice(0, 7)
        };
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
                fortuneData: fortune,
                resultSource: 'api',
                resultTimestamp: new Date().toISOString()
            });

            console.log('✅ Fortune data:', fortune);
            // Show result section with structured fortune data
            showFortuneResult(fullName, fortune);

        } catch (error) {
            console.error('❌ Error:', error);
            showPrettyAlert(formatFortuneErrorMessage(error), {
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
                const prompt = buildFortunePrompt(birthData);

        const hasDirectApiKey = Boolean(getDirectGeminiApiKey());

        if (hasDirectApiKey) {
            try {
                const directData = await fetchFortuneViaDirectGemini(prompt);
                return parseFortuneFromGeminiData(directData);
            } catch (directError) {
                const isInvalidJson = /invalid JSON/i.test(String(directError?.message || ''));
                if (isInvalidJson) {
                    try {
                        const strictPrompt = buildFortunePrompt(birthData, { strict: true });
                        const strictData = await fetchFortuneViaDirectGemini(strictPrompt, { strictJson: true });
                        return parseFortuneFromGeminiData(strictData);
                    } catch (strictError) {
                        directError = strictError;
                    }
                }

                const directMessage = typeof directError?.message === 'string' ? directError.message : '';
                const shouldFallbackToServerless = /Failed to fetch|NetworkError|Load failed|timeout|temporarily unavailable|quota|429|5\d\d/i.test(directMessage);

                if (!shouldFallbackToServerless) {
                    throw directError;
                }

                console.warn('Direct Gemini call failed, trying serverless API endpoints...', directError);
            }
        }

        const apiCandidates = getServerlessApiCandidates();
        let lastError = null;
        let networkFailureCount = 0;

        for (let i = 0; i < apiCandidates.length; i++) {
            const apiUrl = apiCandidates[i];

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: prompt,
                        model: GEMINI_MODEL
                    })
                });

                const contentType = response.headers.get('content-type') || '';
                const isJsonResponse = contentType.includes('application/json');
                const data = isJsonResponse ? await response.json() : null;

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`API endpoint not found at ${apiUrl}`);
                    }
                    throw new Error(data?.error || `API Error: ${response.status}`);
                }

                if (!data || data?.error) {
                    throw new Error(data?.error || 'API returned empty response');
                }

                return parseFortuneFromGeminiData(data);
            } catch (error) {
                lastError = error;
                const errorMessage = typeof error?.message === 'string' ? error.message : '';
                if (/Failed to fetch|NetworkError|Load failed|endpoint not found|status 404/i.test(errorMessage)) {
                    networkFailureCount += 1;
                }
                console.warn(`Gemini API attempt failed via ${apiUrl}:`, error);

                const shouldRetry = i < apiCandidates.length - 1;
                if (!shouldRetry) {
                    break;
                }
            }
        }

        if (networkFailureCount === apiCandidates.length) {
            try {
                console.warn('All serverless API endpoints unreachable, trying direct Gemini API fallback...');
                const directData = await fetchFortuneViaDirectGemini(prompt);
                return parseFortuneFromGeminiData(directData);
            } catch (fallbackError) {
                throw fallbackError;
            }
        }

        console.error('Gemini API Error:', lastError);
        throw lastError || new Error('API request failed');
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
