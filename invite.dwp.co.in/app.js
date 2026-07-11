/* ═══════════════════════════════════════
   ANTIGRAVITY DIGITAL INVITATION ENGINE
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Element References ── */
  const cv          = document.getElementById('bg');
  const cx          = cv.getContext('2d');
  const invitation  = document.getElementById('invitation');
  const floatActions = document.getElementById('float-actions');
  const langBtn     = document.getElementById('btn-lang');
  const audioBtn    = document.getElementById('btn-audio');
  const heroImg     = document.getElementById('hero-img');
  const ganeshaSplash = document.getElementById('ganesha-splash');

  let W, H;
  let stars = [], fireflies = [], petals = [], shoots = [], confetti = [];
  let activeLanguage = localStorage.getItem('invitation_lang') || 'te';

  /* ═══════════════════════════════════════
     GANESHA SPLASH → REVEAL INVITATION
     Ganesha shown for 2.5s, fades out over 1.5s,
     then the main invitation fades in.
     ═══════════════════════════════════════ */
  // Start: invitation hidden
  invitation.style.opacity = '0';
  invitation.style.display = 'block';

  const enterBtn = document.getElementById('btn-enter-invitation');

  // Fade in the enter button after Ganesha has been viewed
  setTimeout(() => {
    if (enterBtn) enterBtn.classList.add('show');
  }, 1800);

  function revealInvitation() {
    // Begin Ganesha fade-out
    ganeshaSplash.classList.add('fade-out');

    // Play the music (authorized by the user gesture click on this button)
    playAudio();

    // Trigger visual celebration burst
    triggerConfetti();

    setTimeout(() => {
      // Ganesha fully gone → reveal invitation
      ganeshaSplash.style.display = 'none';
      invitation.style.transition = 'opacity 1.2s ease';
      invitation.style.opacity = '1';
      invitation.classList.add('visible');
      floatActions.classList.add('show');

      // Kick off timers & behaviours
      startCountdownTimer();
      initializeScrollReveal();
      spawnShootingStars();

      // Trigger in-viewport reveal items immediately
      setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 1.1) el.classList.add('in');
        });
      }, 300);
    }, 1500); // matches CSS fade-out duration
  }

  function triggerConfetti() {
    const colors = [
      'hsla(45, 90%, 60%, OP)',   // gold
      'hsla(340, 85%, 50%, OP)',  // crimson
      'hsla(320, 90%, 70%, OP)',  // pink
      'hsla(40, 100%, 75%, OP)',  // light gold
      'hsla(180, 70%, 55%, OP)',  // teal accent
      'hsla(25, 95%, 55%, OP)'    // saffron
    ];
    const shapes = ['rect', 'circle', 'triangle'];

    // Spawn 70 particles from bottom-left corner shooting up-right
    for (let i = 0; i < 70; i++) {
      confetti.push({
        x: 0,
        y: H,
        vx: Math.random() * 16 + 8,
        vy: -(Math.random() * 20 + 12),
        gravity: Math.random() * 0.15 + 0.25,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.12 + 0.04,
        op: 1.0
      });
    }

    // Spawn 70 particles from bottom-right corner shooting up-left
    for (let i = 0; i < 70; i++) {
      confetti.push({
        x: W,
        y: H,
        vx: -(Math.random() * 16 + 8),
        vy: -(Math.random() * 20 + 12),
        gravity: Math.random() * 0.15 + 0.25,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.12 + 0.04,
        op: 1.0
      });
    }
  }

  let entered = false;
  function handleEnter(e) {
    if (entered) return;
    entered = true;
    revealInvitation();
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', handleEnter);
    enterBtn.addEventListener('touchend', handleEnter);
  } else {
    // Fallback if button is not present
    setTimeout(revealInvitation, 3500);
  }

  // ── Apple Calendar (iCal) Event Download ──────────
  function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadICSForReception() {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Antigravity//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      'UID:reception-mohan-vamsi-hansika-2026',
      'DTSTAMP:20260625T000000Z',
      'DTSTART:20260822T133000Z',
      'DTEND:20260822T173000Z',
      'SUMMARY:Mohan Vamsi & Hansika Wedding Reception',
      'DESCRIPTION:Wedding Reception dinner ceremony to celebrate the union of Mohan Vamsi & Hansika, accompanied by music and blessings. Venue: Sivam Function Hall, Srikalahasti.',
      'LOCATION:Sivam Function Hall, Srikalahasti',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    downloadFile(icsData, 'reception.ics', 'text/calendar');
  }

  function downloadICSForMuhurtham() {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Antigravity//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      'UID:muhurtham-mohan-vamsi-hansika-2026',
      'DTSTAMP:20260625T000000Z',
      'DTSTART:20260822T220000Z',
      'DTEND:20260822T233000Z',
      'SUMMARY:Mohan Vamsi & Hansika Wedding Muhurtham',
      'DESCRIPTION:Auspicious Muhurtham of Mohan Vamsi & Hansika. In the auspicious Mithuna Lagnam, the sacred threads will be tied to bind their souls forever. Venue: Sivam Function Hall, Srikalahasti.',
      'LOCATION:Sivam Function Hall, Srikalahasti',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    downloadFile(icsData, 'muhurtham.ics', 'text/calendar');
  }

  const icalRecBtn = document.getElementById('btn-ical-reception');
  const icalMuhBtn = document.getElementById('btn-ical-muhurtham');

  if (icalRecBtn) icalRecBtn.addEventListener('click', downloadICSForReception);
  if (icalMuhBtn) icalMuhBtn.addEventListener('click', downloadICSForMuhurtham);

  /* ═══════════════════════════════════════
     CANVAS PARTICLE ENGINE
     ═══════════════════════════════════════ */
  function resizeCanvas() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function initParticles() {
    stars = []; fireflies = []; petals = [];

    // Twinkling stars
    const starCount = Math.min(140, Math.floor((W * H) / 8000));
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.2,
        op: Math.random() * 0.6 + 0.15,
        speed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2,
        isGold: Math.random() < 0.3
      });
    }

    // Glowing fireflies
    const flyCount = Math.min(22, Math.floor((W * H) / 38000));
    for (let i = 0; i < flyCount; i++) {
      fireflies.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.5 + 1,
        op: 0,
        speed: Math.random() * 0.01 + 0.005,
        phase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3
      });
    }

    // Falling petals
    const petalCount = Math.min(28, Math.floor(W / 40));
    for (let i = 0; i < petalCount; i++) spawnPetal(true);
  }

  function spawnPetal(randomY = false) {
    const isMarigold = Math.random() < 0.38;
    petals.push({
      x: Math.random() * W,
      y: randomY ? Math.random() * H : -20,
      size: Math.random() * 11 + 6,
      color: isMarigold
        ? `hsla(${Math.random() * 15 + 35}, 95%, ${Math.random() * 15 + 50}%, ${Math.random() * 0.4 + 0.55})`
        : `hsla(${Math.random() * 10 + 345}, 85%, ${Math.random() * 15 + 35}%, ${Math.random() * 0.35 + 0.6})`,
      vx: (Math.random() - 0.3) * 0.8,
      vy: Math.random() * 0.9 + 0.5,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.5,
      oscSpeed: Math.random() * 0.02 + 0.005,
      oscPhase: Math.random() * Math.PI * 2,
      oscAmp: Math.random() * 1.5 + 0.5
    });
  }

  function spawnShootingStars() {
    setInterval(() => {
      if (Math.random() < 0.4) {
        shoots.push({
          x: Math.random() * W * 0.7,
          y: Math.random() * H * 0.35,
          len: Math.random() * 130 + 80,
          angle: Math.PI / 6 + Math.random() * 0.25,
          speed: Math.random() * 8 + 12,
          op: 1, progress: 0
        });
      }
    }, 4000);
  }

  function drawFrame() {
    cx.clearRect(0, 0, W, H);

    // Shooting stars
    shoots = shoots.filter(s => {
      s.progress += s.speed;
      const curX = s.x + Math.cos(s.angle) * s.progress;
      const curY = s.y + Math.sin(s.angle) * s.progress;
      const prevX = curX - Math.cos(s.angle) * s.len;
      const prevY = curY - Math.sin(s.angle) * s.len;
      s.op = Math.max(0, 1 - s.progress / (W * 0.45));
      if (s.op > 0.02 && curX < W + 20 && curY < H + 20) {
        const grad = cx.createLinearGradient(prevX, prevY, curX, curY);
        grad.addColorStop(0, 'rgba(212,175,55,0)');
        grad.addColorStop(1, `rgba(252,246,186,${s.op})`);
        cx.beginPath(); cx.moveTo(prevX, prevY); cx.lineTo(curX, curY);
        cx.strokeStyle = grad; cx.lineWidth = 2; cx.stroke();
        return true;
      }
      return false;
    });

    // Stars
    stars.forEach(s => {
      s.phase += s.speed;
      const twinkle = s.op * (Math.sin(s.phase) * 0.4 + 0.6);
      cx.beginPath();
      cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      cx.fillStyle = s.isGold ? `rgba(212,175,55,${twinkle})` : `rgba(252,249,242,${twinkle * 0.75})`;
      cx.fill();
    });

    // Fireflies
    fireflies.forEach(f => {
      f.phase += f.speed;
      f.op = (Math.sin(f.phase) * 0.5 + 0.5) * 0.65;
      f.x += f.vx + Math.sin(f.phase * 0.5) * 0.25;
      f.y += f.vy + Math.cos(f.phase * 0.6) * 0.2;
      if (f.x < -10) f.x = W + 10;
      if (f.x > W + 10) f.x = -10;
      if (f.y < -10) f.y = H + 10;
      if (f.y > H + 10) f.y = -10;
      const grad = cx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
      grad.addColorStop(0, `rgba(252,246,186,${f.op})`);
      grad.addColorStop(0.3, `rgba(212,175,55,${f.op * 0.3})`);
      grad.addColorStop(1, 'rgba(212,175,55,0)');
      cx.beginPath(); cx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2);
      cx.fillStyle = grad; cx.fill();
    });

    // Petals
    petals.forEach((p, idx) => {
      p.y += p.vy;
      p.oscPhase += p.oscSpeed;
      p.x += p.vx + Math.sin(p.oscPhase) * p.oscAmp;
      p.rot += p.rotSpeed;
      if (p.y > H + 20 || p.x < -25 || p.x > W + 25) {
        petals.splice(idx, 1);
        spawnPetal(false);
        return;
      }
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate((p.rot * Math.PI) / 180);
      cx.beginPath();
      cx.fillStyle = p.color;
      cx.moveTo(0, -p.size / 2);
      cx.quadraticCurveTo(p.size * 0.8, -p.size * 0.3, p.size * 0.2, p.size / 2);
      cx.quadraticCurveTo(-p.size * 0.1, p.size * 0.7, -p.size * 0.2, p.size / 2);
      cx.quadraticCurveTo(-p.size * 0.8, -p.size * 0.3, 0, -p.size / 2);
      cx.fill();
      cx.restore();
    });

    // Confetti
    confetti = confetti.filter(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= 0.98;
      c.vy *= 0.98;
      c.rot += c.rotSpeed;
      c.wobble += c.wobbleSpeed;

      // Fade out as it starts falling down
      if (c.vy > 0) {
        c.op -= 0.012;
      }

      if (c.y > H + 20 || c.x < -20 || c.x > W + 20 || c.op <= 0) {
        return false;
      }

      cx.save();
      cx.translate(c.x, c.y);
      cx.rotate((c.rot * Math.PI) / 180);

      // 3D flipping simulation using Math.sin(wobble)
      const scaleX = Math.sin(c.wobble);
      cx.scale(scaleX, 1);

      cx.fillStyle = c.color.replace('OP', c.op);

      cx.beginPath();
      if (c.shape === 'circle') {
        cx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
      } else if (c.shape === 'triangle') {
        cx.moveTo(0, -c.size / 2);
        cx.lineTo(c.size / 2, c.size / 2);
        cx.lineTo(-c.size / 2, c.size / 2);
        cx.closePath();
      } else {
        // rectangle
        cx.rect(-c.size / 2, -c.size / 2, c.size, c.size);
      }
      cx.fill();
      cx.restore();
      return true;
    });

    requestAnimationFrame(drawFrame);
  }

  initParticles();
  drawFrame();

  /* ═══════════════════════════════════════
     HERO IMAGE PARALLAX
     ═══════════════════════════════════════ */
  if (heroImg) {
    heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
    if (heroImg.complete) heroImg.classList.add('loaded');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 1.5) {
        heroImg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════
     BILINGUAL TRANSLATION ENGINE
     ═══════════════════════════════════════ */
  function applyLanguage(lang) {
    activeLanguage = lang;
    localStorage.setItem('invitation_lang', lang);
    langBtn.textContent = lang === 'en' ? 'తెలుగు' : 'English';
    langBtn.setAttribute('title', lang === 'en' ? 'తెలుగు భాషలోకి మార్చండి' : 'Switch to English');

    document.querySelectorAll('[data-en][data-te]').forEach(el => {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', el.getAttribute(`data-${lang}`));
      } else {
        el.innerHTML = el.getAttribute(`data-${lang}`);
      }
    });
  }

  langBtn.addEventListener('click', () => {
    const nextLang = activeLanguage === 'en' ? 'te' : 'en';
    document.body.style.opacity = '0.75';
    document.body.style.transition = 'opacity 0.2s ease';
    setTimeout(() => {
      applyLanguage(nextLang);
      document.body.style.opacity = '1';
    }, 200);
  });

  applyLanguage(activeLanguage);

  /* ═══════════════════════════════════════
     COUNTDOWN TIMER
     ═══════════════════════════════════════ */
  function startCountdownTimer() {
    const targetDate = new Date('2026-08-23T03:30:00+05:30');
    const daysEl  = document.getElementById('cd-d');
    const hoursEl = document.getElementById('cd-h');
    const minsEl  = document.getElementById('cd-m');
    const secsEl  = document.getElementById('cd-s');

    function pad(n) { return String(n).padStart(2, '0'); }

    function animateVal(el, val) {
      if (!el || el.textContent === val) return;
      el.style.transform = 'scale(0.75)';
      el.style.opacity = '0.4';
      setTimeout(() => {
        el.textContent = val;
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
      }, 130);
    }

    function tick() {
      const diff = targetDate - new Date();
      if (diff <= 0) {
        [daysEl, hoursEl, minsEl, secsEl].forEach(el => { if (el) el.textContent = '00'; });
        clearInterval(timer);
        return;
      }
      animateVal(daysEl,  pad(Math.floor(diff / 86400000)));
      animateVal(hoursEl, pad(Math.floor((diff % 86400000) / 3600000)));
      animateVal(minsEl,  pad(Math.floor((diff % 3600000) / 60000)));
      animateVal(secsEl,  pad(Math.floor((diff % 60000) / 1000)));
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ═══════════════════════════════════════
     SCROLL REVEAL
     ═══════════════════════════════════════ */
  function initializeScrollReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ═══════════════════════════════════════
     AUDIO PLAYER — Mobile-First Implementation
     iOS Safari & Android Chrome require audio
     to be started synchronously inside a user
     gesture handler.
     ═══════════════════════════════════════ */
  let isMusicPlaying = false;

  // List of all available tracks (will be versioned dynamically by deploy.sh)
  const AVAILABLE_SONGS = [
    'music/wedding_1783664312.m4a',
    'music/1_1783664312.mp3',
    'music/2_1783664312.mp3',
    'music/3_1783664312.mp3',
    'music/4_1783664312.mp3'
  ];

  const bgAudio = document.getElementById('bg-audio');
  if (bgAudio) {
    // Select one random song on page load/refresh
    const randomSong = AVAILABLE_SONGS[Math.floor(Math.random() * AVAILABLE_SONGS.length)];
    bgAudio.src = randomSong;
    bgAudio.volume = 0;          // start silent, fade in
  }

  // ── Playback Controls ─────────────────────────
  function playAudio() {
    if (!bgAudio || isMusicPlaying) return;

    try {
      bgAudio.load();
    } catch (e) {}

    bgAudio.volume = 0;
    const playPromise = bgAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          audioBtn.classList.add('playing');
          fadeInAudio(bgAudio);
        })
        .catch(err => {
          console.warn('Playback blocked.', err);
        });
    } else {
      isMusicPlaying = true;
      audioBtn.classList.add('playing');
      fadeInAudio(bgAudio);
    }
  }

  function pauseAudio() {
    if (!bgAudio || !isMusicPlaying) return;
    isMusicPlaying = false;
    audioBtn.classList.remove('playing');
    bgAudio.pause();
  }

  function toggleAudio() { isMusicPlaying ? pauseAudio() : playAudio(); }

  let lastToggleTime = 0;
  function handleAudioToggle(e) {
    const now = Date.now();
    if (now - lastToggleTime < 400) {
      if (e) e.preventDefault();
      return;
    }
    lastToggleTime = now;
    if (e) {
      e.stopPropagation();
    }
    toggleAudio();
  }
  audioBtn.addEventListener('click', handleAudioToggle);
  audioBtn.addEventListener('touchend', handleAudioToggle);

  function fadeInAudio(obj) {
    obj.volume = 0;
    const t = setInterval(() => {
      if (obj.volume < 0.45) obj.volume = Math.min(0.45, obj.volume + 0.03);
      else clearInterval(t);
    }, 100);
  }

  /* ═══════════════════════════════════════
     AUTO-ALTERNATING NAMES (TELUGU / ENGLISH)
     ═══════════════════════════════════════ */
  const nameTelugu = document.getElementById('hero-name-telugu');
  const nameEnglish = document.getElementById('hero-name-english');
  if (nameTelugu && nameEnglish) {
    let showTelugu = true;
    setInterval(() => {
      showTelugu = !showTelugu;
      if (showTelugu) {
        nameEnglish.classList.remove('active');
        setTimeout(() => {
          nameTelugu.classList.add('active');
        }, 800);
      } else {
        nameTelugu.classList.remove('active');
        setTimeout(() => {
           nameEnglish.classList.add('active');
        }, 800);
      }
    }, 5000);
  }

  /* ═══════════════════════════════════════
     HALL SLIDESHOW (Venue Card)
     ═══════════════════════════════════════ */
  (function initHallSlideshow() {
    const slides = document.querySelectorAll('.hall-slide');
    const dots   = document.querySelectorAll('.hall-dot');
    if (!slides.length) return;

    let current = 0;
    let timer;

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(next, 4000);
    }

    // Dot click → jump to slide and restart timer
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(Number(dot.dataset.idx));
        startAuto();
      });
    });

    startAuto();
  })();

  /* ═══════════════════════════════════════
     RSVP — WhatsApp Confirmation + Share
     ═══════════════════════════════════════ */
  (function initRSVP() {
    const WHATSAPP_NUMBER = '918500181891'; // +91 85001 81891
    const nameInput    = document.getElementById('rsvp-name');
    const countDisplay = document.getElementById('rsvp-count-display');
    const minusBtn     = document.getElementById('rsvp-minus');
    const plusBtn      = document.getElementById('rsvp-plus');
    const waBtn        = document.getElementById('rsvp-whatsapp-btn');
    const shareBtn     = document.getElementById('rsvp-share-btn');
    const rsvpForm     = document.getElementById('rsvpForm');
    const rsvpSuccess  = document.getElementById('rsvpSuccess');
    const rsvpReset    = document.getElementById('rsvpReset');

    if (!nameInput) return;

    let guestCount = 1;

    // ── Guest counter ──────────────────────────
    minusBtn.addEventListener('click', () => {
      if (guestCount > 1) { guestCount--; countDisplay.textContent = guestCount; }
    });
    plusBtn.addEventListener('click', () => {
      if (guestCount < 20) { guestCount++; countDisplay.textContent = guestCount; }
    });

    // ── WhatsApp button ────────────────────────
    waBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        nameInput.style.borderColor = 'rgba(255, 100, 100, 0.7)';
        nameInput.style.boxShadow   = '0 0 0 3px rgba(255,100,100,0.15)';
        setTimeout(() => {
          nameInput.style.borderColor = '';
          nameInput.style.boxShadow   = '';
        }, 2000);
        return;
      }

      const plural = guestCount === 1 ? 'person' : 'people';
      const msg = encodeURIComponent(
        `*Wedding RSVP Confirmation* 🎊\n\n` +
        `Namaskaram Vamsi garu & Hansika garu! 🙏\n\n` +
        `I am confirming my attendance for your wedding celebration.\n\n` +
        `*Name:* ${name}\n` +
        `*Attending:* ${guestCount} ${plural}\n` +
        `*Date:* August 22-23, 2026\n` +
        `*Venue:* Sivam Function Hall, Srikalahasti\n\n` +
        `Looking forward to celebrating with you! 🙏`
      );

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');

      // Show success state
      rsvpForm.style.display = 'none';
      rsvpSuccess.style.display = 'block';
    });

    // ── Reset (send for another guest) ─────────
    rsvpReset.addEventListener('click', () => {
      nameInput.value = '';
      guestCount = 1;
      countDisplay.textContent = '1';
      rsvpSuccess.style.display = 'none';
      rsvpForm.style.display = 'block';
      nameInput.focus();
    });

    // ── Share button ───────────────────────────
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Mohan Vamsi & Hansika · Wedding Invitation',
        text:  '🎊 You are cordially invited to the wedding of Mohan Vamsi & Hansika on August 22–23, 2026 at Sivam Function Hall, Srikalahasti. Open the invitation:',
        url:   window.location.href
      };

      if (navigator.share) {
        // Native mobile share sheet (iOS + Android)
        try { await navigator.share(shareData); } catch (e) {}
      } else {
        // Desktop fallback — copy link to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          const span = shareBtn.querySelector('span');
          const orig = span.textContent;
          span.textContent = '✓ Link Copied!';
          shareBtn.style.borderColor = 'rgba(212,175,55,0.6)';
          shareBtn.style.color = 'var(--gold-solid)';
          setTimeout(() => {
            span.textContent = orig;
            shareBtn.style.borderColor = '';
            shareBtn.style.color = '';
          }, 2500);
        } catch (e) {}
      }
    });
  })();

});
