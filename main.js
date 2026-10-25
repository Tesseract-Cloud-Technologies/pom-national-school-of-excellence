/* main.js */
(function() {
  'use strict';

  // --- Demo bar dismiss ---
  const demoBar = document.getElementById('demoBar');
  const dismissBtn = document.getElementById('dismissDemoBar');
  if (dismissBtn && demoBar) {
    if (localStorage.getItem('pnDemoDismissed') === 'true') demoBar.style.display = 'none';
    dismissBtn.addEventListener('click', () => {
      demoBar.style.display = 'none';
      localStorage.setItem('pnDemoDismissed', 'true');
    });
  }

  // --- Floating formula glyphs ---
  const formulaFloat = document.getElementById('formulaFloat');
  if (formulaFloat) {
    const glyphs = ['f(x)', 'π', 'E=mc²', '∑', '√x', '∞', 'Δ', '∫'];
    glyphs.forEach((g, i) => {
      const el = document.createElement('span');
      el.className = 'formula-glyph';
      el.textContent = g;
      el.style.left = (8 + Math.random() * 80) + '%';
      el.style.top = (10 + Math.random() * 70) + '%';
      el.style.fontSize = (1.6 + Math.random() * 2) + 'rem';
      el.style.animationDelay = (Math.random() * 6) + 's';
      el.style.animationDuration = (6 + Math.random() * 6) + 's';
      formulaFloat.appendChild(el);
    });
  }

  // --- Hahenamo countdown ---
  // Sample date: 15 October 2025
  const hahenamoDate = new Date(2025, 9, 15, 9, 0, 0);
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');

  function updateCountdown() {
    const now = new Date();
    let diff = hahenamoDate - now;
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    if (cdDays) cdDays.textContent = days;
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
    if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');
  }
  if (cdDays || cdHours || cdMins || cdSecs) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // --- Event calendar ---
  const sampleEvents = [
    { date: '2025-09-05', title: 'Grade 10 Exam Briefing', cat: 'Academic', desc: 'Sample event: briefing for Grade 10 families.' },
    { date: '2025-09-12', title: 'STEM Innovation Day', cat: 'Academic', desc: 'Sample event: student STEM projects showcase.' },
    { date: '2025-09-20', title: 'Inter-house Sports', cat: 'Sports', desc: 'Sample event: inter-house athletics.' },
    { date: '2025-10-03', title: 'Cultural Dance Rehearsal', cat: 'Cultural', desc: 'Sample event: Hahenamo rehearsal.' },
    { date: '2025-10-15', title: 'Hahenamo Day', cat: 'Cultural', desc: 'Annual cultural show. Sample featured event.' },
    { date: '2025-10-28', title: 'Graduation Ceremony', cat: 'Graduation', desc: 'Sample event: Grade 12 graduation.' },
    { date: '2025-11-07', title: 'Science Fair', cat: 'Academic', desc: 'Sample event: science fair.' },
    { date: '2025-11-15', title: 'Sports Awards', cat: 'Sports', desc: 'Sample event: sports awards evening.' }
  ];

  const calendarGrid = document.getElementById('calendarGrid');
  const calendarMonth = document.getElementById('calendarMonth');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const agendaList = document.getElementById('agendaList');
  const eventDetail = document.getElementById('eventDetail');
  const detailTitle = document.getElementById('detailTitle');
  const detailDate = document.getElementById('detailDate');
  const detailDesc = document.getElementById('detailDesc');
  const addToCalendarBtn = document.getElementById('addToCalendar');
  const filterChips = document.querySelectorAll('#eventFilters .filter-chip');

  let currentYear = 2025;
  let currentMonth = 8; // September (0-indexed)
  let activeCategory = 'all';
  let selectedEvent = null;

  function getEventsForMonth(year, month) {
    return sampleEvents.filter(e => {
      const d = new Date(e.date + 'T00:00:00');
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }

  function renderCalendar() {
    if (!calendarGrid) return;
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    if (calendarMonth) calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const events = getEventsForMonth(currentYear, currentMonth);

    let html = '';
    ['S','M','T','W','T','F','S'].forEach(d => {
      html += `<div class="calendar-weekday">${d}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const visibleEvents = activeCategory === 'all' ? dayEvents : dayEvents.filter(e => e.cat === activeCategory);
      const hasEvent = visibleEvents.length > 0;
      const catClass = hasEvent ? 'cat-' + visibleEvents[0].cat : '';
      html += `<div class="calendar-day ${hasEvent ? 'has-event ' + catClass : ''}" data-date="${dateStr}">
        <span>${d}</span>
        ${hasEvent ? '<span class="dot"></span>' : ''}
      </div>`;
    }

    calendarGrid.innerHTML = html;

    calendarGrid.querySelectorAll('.calendar-day[data-date]').forEach(cell => {
      cell.addEventListener('click', () => {
        const dateStr = cell.dataset.date;
        const dayEvents = events.filter(e => e.date === dateStr);
        const visible = activeCategory === 'all' ? dayEvents : dayEvents.filter(e => e.cat === activeCategory);
        if (visible.length > 0) {
          showEventDetail(visible[0]);
          calendarGrid.querySelectorAll('.calendar-day').forEach(c => c.classList.remove('selected'));
          cell.classList.add('selected');
        }
      });
    });
  }

  function renderAgenda() {
    if (!agendaList) return;
    const events = getEventsForMonth(currentYear, currentMonth);
    const filtered = activeCategory === 'all' ? events : events.filter(e => e.cat === activeCategory);
    if (filtered.length === 0) {
      agendaList.innerHTML = '<p class="text-muted small">No events this month.</p>';
      return;
    }
    agendaList.innerHTML = filtered.map(e => {
      const d = new Date(e.date + 'T00:00:00');
      const dateLabel = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      return `<div class="agenda-item" data-date="${e.date}">
        <span class="agenda-date">${dateLabel}</span>
        <div class="flex-grow-1">
          <div class="agenda-title">${e.title}</div>
          <div class="agenda-cat">${e.cat}</div>
        </div>
      </div>`;
    }).join('');
    agendaList.querySelectorAll('.agenda-item').forEach(item => {
      item.addEventListener('click', () => {
        const ev = filtered.find(e => e.date === item.dataset.date);
        if (ev) showEventDetail(ev);
      });
    });
  }

  function showEventDetail(ev) {
    selectedEvent = ev;
    if (eventDetail) eventDetail.classList.remove('d-none');
    if (detailTitle) detailTitle.textContent = ev.title;
    if (detailDate) {
      const d = new Date(ev.date + 'T00:00:00');
      detailDate.textContent = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + ev.cat;
    }
    if (detailDesc) detailDesc.textContent = ev.desc;
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar();
      renderAgenda();
    });
  }
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar();
      renderAgenda();
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.cat;
      renderCalendar();
      renderAgenda();
    });
  });

  if (calendarGrid || agendaList) {
    renderCalendar();
    renderAgenda();
  }

  // Add to calendar
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      if (!selectedEvent) return;
      const d = new Date(selectedEvent.date + 'T09:00:00');
      const end = new Date(d.getTime() + 2 * 60 * 60 * 1000);
      const pad = n => String(n).padStart(2, '0');
      const fmt = dt => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//POMNATHS//Demo//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@pomnaths.demo`,
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART:${fmt(d)}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:${selectedEvent.title}`,
        `DESCRIPTION:${selectedEvent.desc}`,
        'LOCATION:POMNATHS, Goro-Kaeaga Road, Gerehu',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pomnaths-event.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // --- Alumni directory ---
  const alumniData = [
    { name: 'Maria K.', year: '2015', field: 'Engineering', initials: 'MK' },
    { name: 'John T.', year: '2010', field: 'Medicine', initials: 'JT' },
    { name: 'Grace A.', year: '2020', field: 'Law', initials: 'GA' },
    { name: 'Peter N.', year: '2005', field: 'Education', initials: 'PN' },
    { name: 'Sarah W.', year: '2024', field: 'Business', initials: 'SW' },
    { name: 'David M.', year: '2000', field: 'Engineering', initials: 'DM' }
  ];

  const alumniGrid = document.getElementById('alumniGrid');
  const dirYearFilter = document.getElementById('dirYearFilter');
  const dirFieldFilter = document.getElementById('dirFieldFilter');

  function renderAlumni() {
    if (!alumniGrid) return;
    let filtered = alumniData;
    if (dirYearFilter && dirYearFilter.value !== 'all') {
      filtered = filtered.filter(a => a.year === dirYearFilter.value);
    }
    if (dirFieldFilter && dirFieldFilter.value !== 'all') {
      filtered = filtered.filter(a => a.field === dirFieldFilter.value);
    }
    if (filtered.length === 0) {
      alumniGrid.innerHTML = '<div class="col-12"><p class="text-muted small">No alumni match these filters.</p></div>';
      return;
    }
    alumniGrid.innerHTML = filtered.map(a => `
      <div class="col-md-4">
        <div class="alumni-card">
          <div class="alumni-avatar">${a.initials}</div>
          <h3 class="h6 mb-1">${a.name}</h3>
          <p class="small text-muted mb-0">Class of ${a.year} · ${a.field}</p>
        </div>
      </div>
    `).join('');
  }

  if (dirYearFilter) dirYearFilter.addEventListener('change', renderAlumni);
  if (dirFieldFilter) dirFieldFilter.addEventListener('change', renderAlumni);
  if (alumniGrid) renderAlumni();

  // --- Alumni demo forms ---
  const demoLoginForm = document.getElementById('demoLoginForm');
  const demoLoginMsg = document.getElementById('demoLoginMsg');
  if (demoLoginForm) {
    demoLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (demoLoginMsg) demoLoginMsg.classList.remove('d-none');
    });
  }

  const registerForm = document.getElementById('registerForm');
  const registerMsg = document.getElementById('registerMsg');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!registerForm.checkValidity()) {
        registerForm.classList.add('was-validated');
        return;
      }
      if (registerMsg) registerMsg.classList.remove('d-none');
      registerForm.reset();
    });
  }

  const mentorshipForm = document.getElementById('mentorshipForm');
  const mentorMsg = document.getElementById('mentorMsg');
  if (mentorshipForm) {
    mentorshipForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!mentorshipForm.checkValidity()) {
        mentorshipForm.classList.add('was-validated');
        return;
      }
      if (mentorMsg) mentorMsg.classList.remove('d-none');
      mentorshipForm.reset();
    });
  }

  // --- Admissions form ---
  const admissionsForm = document.getElementById('admissionsForm');
  const admMsg = document.getElementById('admMsg');
  if (admissionsForm) {
    admissionsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!admissionsForm.checkValidity()) {
        admissionsForm.classList.add('was-validated');
        return;
      }
      if (admMsg) admMsg.classList.remove('d-none');
      admissionsForm.reset();
    });
  }

  // --- Contact form ---
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const contactWhatsapp = document.getElementById('contactWhatsapp');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }
      const name = document.getElementById('contactName')?.value || 'Friend';
      const email = document.getElementById('contactEmail')?.value || '';
      const message = document.getElementById('contactMessage')?.value || '';
      const text = `Hello POMNATHS! My name is ${name}. Email: ${email}. Message: ${message} (Demo)`;
      if (contactWhatsapp) contactWhatsapp.href = `https://wa.me/67512345678?text=${encodeURIComponent(text)}`;
      contactForm.classList.add('d-none');
      if (contactSuccess) contactSuccess.classList.remove('d-none');
    });
  }

})();