/* ===========================================================
   her world — interactions
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sound effects (synthesized, no audio files) ---------- */
  let audioCtx = null;
  let soundOn = localStorage.getItem('herworld-sound') === 'on';

  function getCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type = 'sine', gain = 0.06) {
    if (!soundOn) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    amp.gain.setValueAtTime(0.0001, ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(amp).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  }

  function playSweep(startFreq, endFreq, duration, type = 'sine', gain = 0.07) {
    if (!soundOn) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
    amp.gain.setValueAtTime(0.0001, ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(amp).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  }

  function playThud(gain = 0.09) {
    if (!soundOn) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 280;
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(gain, ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
    noise.connect(filter).connect(amp).connect(ctx.destination);
    noise.start();
  }

  const sfx = {
    tap: () => playTone(720, 0.12, 'sine', 0.05),
    pop: () => playTone(540, 0.16, 'triangle', 0.06),
    chime: () => { playTone(880, 0.25, 'sine', 0.05); setTimeout(() => playTone(1180, 0.3, 'sine', 0.04), 90); },
    open: () => { playTone(420, 0.1, 'sine', 0.05); setTimeout(() => playTone(640, 0.18, 'sine', 0.05), 70); },
    type: () => playTone(1000 + Math.random() * 300, 0.045, 'square', 0.015),
    // tactile sounds for the collection / customizer
    plushPat: () => { playThud(0.1); playTone(180, 0.1, 'sine', 0.03); },
    squishBoing: () => playSweep(260, 90, 0.26, 'sine', 0.08),
    keychainJingle: () => {
      const notes = [1600, 1900, 1500, 2100];
      notes.forEach((f, i) => setTimeout(() => playTone(f + Math.random() * 80, 0.14, 'triangle', 0.035), i * 55));
    },
  };

  const soundBtn = document.getElementById('soundBtn');
  const iconSoundOn = document.getElementById('iconSoundOn');
  const iconSoundOff = document.getElementById('iconSoundOff');
  function reflectSound() {
    if (iconSoundOn) iconSoundOn.style.display = soundOn ? 'block' : 'none';
    if (iconSoundOff) iconSoundOff.style.display = soundOn ? 'none' : 'block';
  }
  reflectSound();
  soundBtn?.addEventListener('click', () => {
    soundOn = !soundOn;
    localStorage.setItem('herworld-sound', soundOn ? 'on' : 'off');
    reflectSound();
    if (soundOn) { getCtx(); sfx.chime(); }
  });

  // light tap sound on every glass button / icon button
  document.querySelectorAll('.btn-glass, .btn-icon').forEach(btn => {
    btn.addEventListener('click', () => sfx.tap());
  });

  /* ---------- Toast helper ---------- */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  /* ---------- Mobile drawer nav ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const drawer = document.getElementById('drawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerClose');

  const openDrawer = () => {
    drawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* ---------- Dark mode toggle ---------- */
  const themeBtn = document.getElementById('themeBtn');
  const root = document.documentElement;
  const sunIcon = document.getElementById('iconSun');
  const moonIcon = document.getElementById('iconMoon');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      root.removeAttribute('data-theme');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  };

  const savedTheme = localStorage.getItem('herworld-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  themeBtn?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('herworld-theme', next); } catch (e) {}
  });

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scrollProgress');
  const toTopBtn = document.getElementById('toTopBtn');

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    if (toTopBtn) toTopBtn.classList.toggle('show', scrollTop > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Staggered reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('in'), Number(delay));
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // stagger children automatically within any [data-stagger] group
  document.querySelectorAll('[data-stagger]').forEach(group => {
    const step = Number(group.dataset.stagger) || 80;
    Array.from(group.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.dataset.delay = i * step;
      io.observe(child);
    });
  });

  /* ---------- Touch sounds (plushies / squishes / keychains / customizer) ---------- */
  function playForSound(kind) {
    if (kind === 'plush') sfx.plushPat();
    else if (kind === 'squish') sfx.squishBoing();
    else if (kind === 'keychain') sfx.keychainJingle();
    else sfx.pop();
  }

  document.querySelectorAll('.collect-icon-wrap[data-sound]').forEach(el => {
    el.addEventListener('click', () => {
      el.style.transform = el.classList.contains('keychain-wrap') ? 'rotate(14deg) scale(0.9)' : 'scale(0.84)';
      playForSound(el.dataset.sound);
      setTimeout(() => { el.style.transform = ''; }, 220);
    });
  });

  /* ---------- Parallax blobs on scroll (subtle, single orchestrated effect) ---------- */
  const blobs = document.querySelectorAll('.blob');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      blobs.forEach((b, i) => {
        const speed = 0.04 + i * 0.015;
        b.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
  }, { passive: true });

  /* ---------- Confetti burst (hearts) ---------- */
  function confettiBurst() {
    const colors = ['#f43f6e', '#fb7199', '#fda4bb', '#ffe4ec'];
    for (let i = 0; i < 26; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 6 + Math.random() * 6;
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      const dur = 2.2 + Math.random() * 1.6;
      piece.style.animationDuration = dur + 's';
      piece.style.animationDelay = (Math.random() * 0.4) + 's';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), (dur + 0.6) * 1000);
    }
  }

  /* ---------- Math proof slideshow ---------- */
  const slides = Array.from(document.querySelectorAll('.proof-slide'));
  const dots = Array.from(document.querySelectorAll('.proof-dot'));
  let proofIndex = 0;
  let proofTimer = null;

  function showProof(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    proofIndex = i;
  }
  function nextProof() {
    showProof((proofIndex + 1) % slides.length);
  }
  function startProofAuto() {
    clearInterval(proofTimer);
    proofTimer = setInterval(nextProof, 4200);
  }

  if (slides.length) {
    showProof(0);
    startProofAuto();
    dots.forEach((dot, i) => dot.addEventListener('click', () => { showProof(i); startProofAuto(); sfx.tap(); }));
  }

  /* ---------- Letter: "open here" pixel typewriter ---------- */
  const letterBtn = document.getElementById('letterBtn');
  const letterOverlay = document.getElementById('letterOverlay');
  const letterClose = document.getElementById('letterClose');
  const letterBody = document.getElementById('letterBody');
  const letterReplay = document.getElementById('letterReplay');

  // The letter — edit the text between the backticks to change what gets typed out.
  const LETTER_TEXT =
`Dear Reine,

It’s honestly crazy to think that we only met on October 17, because even though it hasn’t been that long, you’ve already become someone who means a lot to me. I didn’t expect to get this attached to someone so quickly, but I’m genuinely glad I met you. I love how easy it is to talk to you, how even the most random conversations can make my day better, and how you’ve slowly become someone I look forward to hearing from. I know we’re still getting to know each other, but I really hope we get to make a lot more memories together, share more laughs, and have plenty of conversations about absolutely nothing. I hope you know that I appreciate you more than I probably show, and I’m really happy that you’re in my life. You have a way of making people care about you without even trying, and I guess I’m proof of that. I hope we stay close for a long time, because honestly, I’d hate for someone as special as you to become just another person I used to know. And don't let this get to your head, but I'm really glad October 17 happened, because it gave me the chance to meet you. You're genuinely one of the sweetest surprises I've had in a while, and I hope I get to know you more and more as time goes on. I'm glad it's you, Reine.`;

  let typing = false;
  let runId = 0;        // bumps on every new run / close so old timers stop themselves
  let skipTyping = false;
  const letterPaper = document.querySelector('.letter-paper');

  function typeLetter(text) {
    const myRun = ++runId;
    typing = true;
    skipTyping = false;
    letterBody.innerHTML = '';
    if (letterPaper) letterPaper.scrollTop = 0;

    const cursor = document.createElement('span');
    cursor.className = 'letter-cursor';
    letterBody.appendChild(cursor);

    let i = 0;
    let word = null;       // keeps each word together so lines never break mid-word
    const speed = 14;

    let prevNewline = false;
    function addChar(ch) {
      const wasNewline = prevNewline; prevNewline = (ch === '\n');
      if (ch === '\n') {
        word = null;
        const br = document.createElement('span');
        br.className = 'pixel-char';
        br.style.display = 'block';
        if (wasNewline) br.style.height = '1.2em';   // second newline in a row = blank line
        letterBody.insertBefore(br, cursor);
      } else if (ch === ' ') {
        word = null;
        letterBody.insertBefore(document.createTextNode(' '), cursor);
      } else {
        if (!word) {
          word = document.createElement('span');
          word.className = 'pixel-word';
          letterBody.insertBefore(word, cursor);
        }
        const span = document.createElement('span');
        span.className = 'pixel-char';
        span.textContent = ch;
        word.appendChild(span);
      }
    }

    function finish() {
      typing = false;
      cursor.remove();
      confettiBurst();
    }

    function step() {
      if (myRun !== runId) return;               // cancelled (closed or replayed)
      if (skipTyping) {
        while (i < text.length) addChar(text[i++]);
        finish();
        return;
      }
      if (i < text.length) {
        for (let n = 0; n < 4 && i < text.length; n++) addChar(text[i++]);
        if (letterPaper) letterPaper.scrollTop = letterPaper.scrollHeight;
        setTimeout(step, speed);
      } else {
        finish();
      }
    }
    step();
  }

  function openLetter() {
    letterOverlay.classList.add('open');
    letterOverlay.setAttribute('aria-hidden', 'false');
    typeLetter(LETTER_TEXT);
  }
  function closeLetter() {
    runId++; typing = false;                     // stop any typing in progress
    letterOverlay.classList.remove('open');
    letterOverlay.setAttribute('aria-hidden', 'true');
  }

  letterBtn?.addEventListener('click', openLetter);
  letterClose?.addEventListener('click', closeLetter);
  letterOverlay?.addEventListener('click', (e) => { if (e.target === letterOverlay) closeLetter(); });
  letterReplay?.addEventListener('click', () => typeLetter(LETTER_TEXT));
  // tap the letter while it's typing to show the rest right away
  letterBody?.addEventListener('click', () => { if (typing) skipTyping = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLetter(); });

  /* ---------- Info sidebar (artist / drama details) ---------- */
  const infoSidebar = document.getElementById('infoSidebar');
  const infoBackdrop = document.getElementById('infoBackdrop');
  const infoClose = document.getElementById('infoClose');
  const infoPhoto = document.getElementById('infoPhoto');
  const infoIcon = document.getElementById('infoIcon');
  const infoImg = document.getElementById('infoImg');
  const infoTag = document.getElementById('infoTag');
  const infoName = document.getElementById('infoName');
  const infoBio = document.getElementById('infoBio');
  const infoFact = document.getElementById('infoFact');
  const infoFactWrap = document.getElementById('infoFactWrap');

  function openInfo({ tag, name, bio, fact, icon, photo }) {
    infoTag.textContent = tag;
    infoName.textContent = name;
    infoBio.textContent = bio;
    if (fact) { infoFact.textContent = fact; infoFactWrap.style.display = ''; }
    else { infoFactWrap.style.display = 'none'; }

    infoIcon.innerHTML = `<use href="#${icon}"></use>`;
    infoIcon.style.display = 'block';
    infoImg.style.display = 'none';
    infoImg.src = photo;
    infoImg.onload = () => { infoImg.style.display = 'block'; infoIcon.style.display = 'none'; };
    infoImg.onerror = () => { infoImg.style.display = 'none'; infoIcon.style.display = 'block'; };

    infoSidebar.classList.add('open');
    infoBackdrop.classList.add('open');
    infoSidebar.setAttribute('aria-hidden', 'false');
    sfx.tap();
  }
  function closeInfo() {
    infoSidebar.classList.remove('open');
    infoBackdrop.classList.remove('open');
    infoSidebar.setAttribute('aria-hidden', 'true');
  }
  infoClose?.addEventListener('click', closeInfo);
  infoBackdrop?.addEventListener('click', closeInfo);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeInfo(); });

  function openArtistInfo(artist) {
    openInfo({
      tag: 'artist', name: artist.name, bio: artist.bio, fact: artist.fact,
      icon: artist.icon, photo: `assets/artists/${artist.id}.jpg`
    });
  }
  function openDramaInfo(drama) {
    openInfo({
      tag: 'k-drama', name: drama.name, bio: drama.synopsis, fact: drama.fact,
      icon: drama.icon, photo: `assets/dramas/${drama.id}.jpg`
    });
  }

  /* ---------- Render artist grid (music section) from data.js ---------- */
  const artistGrid = document.getElementById('artistGrid');
  if (artistGrid && typeof ARTISTS !== 'undefined') {
    ARTISTS.forEach(artist => {
      const card = document.createElement('div');
      card.className = 'artist-card' + (artist.id === 'rose' ? ' pinned' : '');
      card.innerHTML = `
        <div class="artist-photo"${artist.id === 'rose' ? ' style="background:linear-gradient(135deg, var(--pink-200), var(--pink-100)); color:var(--pink-500);"' : ''}>
          <svg class="icon"><use href="#${artist.icon}"></use></svg>
          <img src="assets/artists/${artist.id}.jpg" alt="" style="display:none" onload="this.style.display='block';this.previousElementSibling.style.display='none';" onerror="this.remove();" />
        </div>
        <p class="name">${artist.name}</p>
        ${artist.id === 'rose' ? '<p class="note">#1 forever</p>' : ''}
      `;
      card.addEventListener('click', () => openArtistInfo(artist));
      artistGrid.appendChild(card);
    });
  }

  /* ---------- Render her own photocards (her photos + hair card) from data.js ---------- */
  const photocardGrid = document.getElementById('photocardGrid');
  if (photocardGrid && typeof HER !== 'undefined') {
    HER.forEach(h => {
      const card = document.createElement('div');
      card.className = 'photocard her-card';
      card.innerHTML = `
        <img src="assets/her/${h.id}.jpg" alt="" style="width:100%; height:100%; object-fit:cover; object-position:${h.pos || 'center'};" />
        <div class="her-caption"><p>${h.caption}</p></div>
      `;
      photocardGrid.appendChild(card);
    });
  }

  /* ---------- Render drama list (k-dramas section) from data.js ---------- */
  const dramaList = document.getElementById('dramaList');
  if (dramaList && typeof DRAMAS !== 'undefined') {
    DRAMAS.forEach(drama => {
      const card = document.createElement('div');
      card.className = 'drama-card soft-card';
      card.innerHTML = `
        <div class="drama-poster" style="background:linear-gradient(160deg, ${drama.color1}, ${drama.color2});">
          <svg class="icon"><use href="#${drama.icon}"></use></svg>
          <img src="assets/dramas/${drama.id}.jpg" alt="" style="display:none" onload="this.style.display='block';this.previousElementSibling.style.display='none';" onerror="this.remove();" />
        </div>
        <div class="drama-body">
          <h3 style="font-weight:700; font-size:1.05rem; color:var(--ink);">${drama.name}</h3>
          <p style="font-size:0.85rem; color:var(--ink-soft);">${drama.synopsis.slice(0, 54)}&hellip;</p>
          ${drama.favorite ? '<span class="drama-favorite"><svg class="icon"><use href="#icon-heart-fill"></use></svg> her favorite</span>' : ''}
        </div>
      `;
      card.addEventListener('click', () => openDramaInfo(drama));
      dramaList.appendChild(card);
    });
  }

  /* ---------- Universe map: generated from ARTISTS + fixed categories ---------- */
  const universe = document.getElementById('universeMap');
  if (universe && typeof ARTISTS !== 'undefined') {
    // named background stars tied to the timeline
    const namedStars = [
      { label: 'first convo', top: '12%', left: '20%' },
      { label: 'pinky day', top: '18%', left: '78%' },
      { label: 'oct 17', top: '82%', left: '16%' },
      { label: 'oct 25', top: '88%', left: '74%' },
    ];
    namedStars.forEach(s => {
      const el = document.createElement('div');
      el.className = 'named-star';
      el.style.top = s.top;
      el.style.left = s.left;
      el.innerHTML = `<span class="star-dot"></span><span class="star-label">${s.label}</span>`;
      universe.appendChild(el);
    });

    // scatter plain background stars
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = Math.random() * 100 + '%';
      star.style.left = Math.random() * 100 + '%';
      star.style.animationDelay = (Math.random() * 2.4) + 's';
      universe.appendChild(star);
    }

    // planet config: every artist (all have photos), grouped into rings
    const artistPlanets = ARTISTS.map(a => ({
      id: a.id, name: a.name, icon: a.icon,
      color: `linear-gradient(135deg, ${a.color}, var(--pink-600))`,
      tip: '', type: 'artist', artist: a
    }));

    // build rings: artists only, ~3 per ring
    const rings = [];
    const perRing = 3;
    for (let i = 0; i < artistPlanets.length; i += perRing) {
      rings.push(artistPlanets.slice(i, i + perRing));
    }

    let roseTaps = 0;
    const confessOverlay = document.getElementById('confessOverlay');
    const confessClose = document.getElementById('confessClose');
    function openConfession() {
      document.querySelectorAll('.planet.tip-visible').forEach(el => el.classList.remove('tip-visible'));
      confessOverlay.classList.add('open');
      confessOverlay.setAttribute('aria-hidden', 'false');
      confettiBurst();
    }
    function closeConfession() {
      confessOverlay.classList.remove('open');
      confessOverlay.setAttribute('aria-hidden', 'true');
    }
    confessClose?.addEventListener('click', closeConfession);
    confessOverlay?.addEventListener('click', (e) => { if (e.target === confessOverlay) closeConfession(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeConfession(); });

    rings.forEach((ringPlanets, ringIndex) => {
      const sizePct = 40 + ringIndex * 15; // orbit diameter as % of universe box
      const duration = 16 + ringIndex * 9;
      const reverse = ringIndex % 2 === 1;

      const orbit = document.createElement('div');
      orbit.className = 'orbit';
      orbit.style.width = sizePct + '%';
      orbit.style.height = sizePct + '%';

      const spin = document.createElement('div');
      spin.className = 'orbit-spin';
      spin.style.animationDuration = duration + 's';
      if (reverse) spin.style.animationDirection = 'reverse';

      ringPlanets.forEach((p, i) => {
        const angle = (360 / ringPlanets.length) * i + ringIndex * 23; // offset per ring so they don't all line up
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 50 * Math.cos(rad);
        const y = 50 + 50 * Math.sin(rad);

        const planet = document.createElement('div');
        planet.className = 'planet' + (p.type === 'artist' ? ' is-artist' : '');
        planet.style.left = x + '%';
        planet.style.top = y + '%';
        planet.style.background = p.color;
        planet.style.animation = `orbit-rotate ${duration}s linear infinite ${reverse ? 'normal' : 'reverse'}`;
        const photoHtml = p.type === 'artist'
          ? `<img src="assets/artists/${p.artist.id}.jpg" alt="" style="display:none; width:100%; height:100%; object-fit:cover; border-radius:50%;" onload="this.style.display='block';this.previousElementSibling.style.display='none';" onerror="this.remove();" />`
          : '';
        planet.innerHTML = `<svg><use href="#${p.icon}"></use></svg>${photoHtml}<div class="planet-tip"><strong>${p.name}</strong>${p.tip}</div>`;

        // tap a planet to reveal its name tooltip only — no longer opens the full info sidebar
        planet.addEventListener('click', (e) => {
          e.stopPropagation();
          if (p.id === 'rose') {
            roseTaps++;
            if (roseTaps >= 5) { roseTaps = 0; openConfession(); }
          } else { roseTaps = 0; }
          const wasOpen = planet.classList.contains('tip-visible');
          document.querySelectorAll('.planet.tip-visible').forEach(el => el.classList.remove('tip-visible'));
          if (!wasOpen) { planet.classList.add('tip-visible'); sfx.tap(); }
        });

        spin.appendChild(planet);
      });

      orbit.appendChild(spin);
      universe.appendChild(orbit);
    });

    // keep the sun on top (re-append so it stays the last/topmost element)
    const sunEl = universe.querySelector('.sun');
    if (sunEl) universe.appendChild(sunEl);

    document.addEventListener('click', () => {
      document.querySelectorAll('.planet.tip-visible').forEach(p => p.classList.remove('tip-visible'));
    });
  }

  /* ---------- Easter egg: tap the infinity icon 3 times ---------- */
  const easterEgg = document.getElementById('easterEgg');
  let eggTaps = 0;
  let eggTimer = null;
  easterEgg?.addEventListener('click', () => {
    eggTaps++;
    clearTimeout(eggTimer);
    eggTimer = setTimeout(() => { eggTaps = 0; }, 1200);
    if (eggTaps >= 3) {
      eggTaps = 0;
      sfx.chime();
      confettiBurst();
      showToast('ily, infinitely');
    } else {
      sfx.tap();
    }
  });

  /* ---------- Customizer: plushie / keychain / squishy ---------- */
  const customizers = document.querySelectorAll('[data-customizer]');
  customizers.forEach(card => {
    const key = card.dataset.customizer;
    const soundKind = card.dataset.sound;
    const stage = card.querySelector('.custom-stage');
    const stageIcon = card.querySelector('.custom-stage svg');
    const photoImg = card.querySelector('.custom-photo');
    const nameEl = card.querySelector('.custom-name');
    const swatches = card.querySelectorAll('.swatch');
    const fileInput = card.querySelector('.upload-input');

    function readState() {
      try { return JSON.parse(localStorage.getItem('herworld-customizer') || '{}'); }
      catch (e) { return {}; }
    }
    function writeState(patch) {
      const state = readState();
      state[key] = Object.assign({}, state[key], patch);
      try { localStorage.setItem('herworld-customizer', JSON.stringify(state)); } catch (e) {}
    }

    function applyColor(hex, label, persist = true) {
      if (stageIcon) stageIcon.style.color = hex;
      if (nameEl) nameEl.textContent = label;
      swatches.forEach(s => s.classList.toggle('active', s.dataset.color === hex));
      if (persist) writeState({ color: hex, label });
    }

    function applyPhoto(dataUrl, persist = true) {
      if (!photoImg) return;
      photoImg.src = dataUrl;
      stage.classList.add('has-photo');
      if (nameEl) nameEl.textContent = 'your own photo';
      if (persist) writeState({ photo: dataUrl });
    }

    swatches.forEach(sw => {
      sw.addEventListener('click', () => {
        stage.classList.remove('has-photo');
        applyColor(sw.dataset.color, sw.dataset.label || 'yours');
        writeState({ photo: null });
        sfx.pop();
      });
    });

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        applyPhoto(ev.target.result);
        sfx.chime();
      };
      reader.readAsDataURL(file);
    });

    stage?.addEventListener('click', () => playForSound(soundKind));

    // restore saved state
    const saved = readState()[key];
    if (saved) {
      if (saved.photo) applyPhoto(saved.photo, false);
      else if (saved.color) applyColor(saved.color, saved.label || 'yours', false);
    }
  });

});
