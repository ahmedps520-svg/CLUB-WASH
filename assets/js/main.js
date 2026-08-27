/* ==========================================================
   CLUB WASH | مغسلة كلوب واش
   No dependencies. Arabic ships in the markup; EN is the toggle.
   ========================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var isRtl = function () { return document.documentElement.getAttribute('dir') === 'rtl'; };

  /* Real 5-star Google reviews, verbatim. None of these name an individual
     member of staff — same rule as Alkhayyel, since people move on. */
  var REVIEWS = [
    { n: 'محمد الحُمدي',  t: 'من افضل مغاسل السيارات للغسيل الاتوماتيك وسرعه وطاقم استقبال رائع ومرح' },
    { n: 'ثواب الغامدي',  t: 'أشكر صاحب المغسلة لتواجده وحرصه على خدمة العملاء . غسيل رائع وسريع . جودة مقابل السعر .' },
    { n: 'نصر الحريري',   t: 'الله يبارك لهم في حلالهم شغلهم نضيف يستاهلون الدعم ادعمو ابناء البلد وشجعوهم انصح في زيارتهم' },
    { n: 'ح الشريف',      t: 'الله يعطيهم العافيه ماقصرو نظافه وغسيل واريحيه بالمكان الله يبارك لهم' },
    { n: 'Faisal_JED',    t: 'مغسلة أتوماتيكية جديدة ممتازين ومميزين. شكرا ويعطيكم العافية' },
    { n: 'ماجد الملحف',   t: 'ماشاء الله تبارك الله تعامل راقي على احسن مايكون الله يرزق راعي المحل' },
    { n: 'محمد ابو زيه',  t: 'ماشاءالله غسيلهم روعه وأسلوب راقي جدا' },
    { n: 'Hassan H',      t: 'ماشاءالله الله يرزقهم غسيلهم روووعه ووممتاز الله يوفقهم' },
    { n: 'Asil Fallatah', t: 'افضل مغسله جربتها الين دحين' }
  ];

  /* ---------- 1. INTRO ---------- */
  var intro = $('#intro');
  function dropIntro() {
    if (!intro || intro.classList.contains('gone')) return;
    intro.classList.add('gone');
    setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 800);
  }
  window.addEventListener('load', function () { setTimeout(dropIntro, 1150); });
  setTimeout(dropIntro, 3000);          // never let the intro trap the page

  /* ---------- 2. LANGUAGE ---------- */
  var KEY = 'cw-lang';
  var lngBtn = $('#lngBtn'), lngTx = $('#lngTx');

  var AR_D = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  function arDig(s) { return String(s).replace(/\d/g, function (d) { return AR_D[+d]; }); }

  function paintStats(rate, cnt) {
    var ar = document.documentElement.getAttribute('lang') === 'ar';
    var r = $('#statRate'), c = $('#statRev');
    if (r) r.textContent = ar ? arDig(rate.toFixed(1)).replace('.', '٫') : rate.toFixed(1);
    if (c) c.textContent = ar ? arDig(cnt) : String(cnt);
  }

  function apply(lang) {
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    $$('[data-en]').forEach(function (el) {
      var v = el.getAttribute(lang === 'ar' ? 'data-ar' : 'data-en');
      if (v != null) el.innerHTML = v;
    });
    if (lngTx) lngTx.textContent = lang === 'ar' ? 'EN' : 'ع';
    document.title = lang === 'ar'
      ? 'مغسلة كلوب واش | CLUB WASH — مشرفة، جدة · مفتوح ٢٤ ساعة'
      : 'CLUB WASH | كلوب واش — Mishrifah, Jeddah · Open 24 Hours';
    if (statsState !== 'run') paintStats(4.9, 77);
    splitWords($('#h1a'));
    splitWords($('#h1b'));
    goTo(index, false);                 // re-anchor the carousel after reflow
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'en') apply('en');

  if (lngBtn) lngBtn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('lang') === 'ar' ? 'en' : 'ar';
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });

  /* ---------- 3. HEADLINE ---------- */
  /* Words, never characters. Arabic is cursive — a span per letter breaks the
     joining and the word renders as loose, disconnected glyphs. */
  function splitWords(el) {
    if (!el) return;
    var txt = (el.textContent || '').trim();
    if (!txt) return;
    el.textContent = '';
    txt.split(/\s+/).forEach(function (w, i) {
      var mask = document.createElement('span');
      mask.className = 'wm';
      var inner = document.createElement('i');
      inner.textContent = w;
      inner.style.setProperty('--i', i);
      mask.appendChild(inner);
      el.appendChild(mask);
      el.appendChild(document.createTextNode(' '));
    });
  }
  splitWords($('#h1a'));
  splitWords($('#h1b'));

  /* ---------- 4. HERO IMAGE ---------- */
  var heroImg = $('#heroImg');
  if (heroImg) {
    var show = function () { heroImg.classList.add('seen'); };
    if (heroImg.complete && heroImg.naturalWidth) show();
    else { heroImg.addEventListener('load', show); heroImg.addEventListener('error', show); }
    setTimeout(show, 3000);            // never leave it stranded at opacity 0
  }

  /* ---------- 5. NAV ---------- */
  var nav = $('#nav'), brg = $('#brg'), menu = $('#menu');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    brg.classList.remove('on');
    brg.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('lock');
  }
  if (brg && menu) {
    brg.addEventListener('click', function () {
      nav.classList.remove('slid');       // never open the menu under a hidden bar
      var open = menu.classList.toggle('open');
      brg.classList.toggle('on', open);
      brg.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('lock', open);
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- 6. TICKER ---------- */
  var tickRow = $('#tickRow');
  if (tickRow) tickRow.innerHTML += tickRow.innerHTML;   // duplicate so -50% loops seamlessly

  /* ---------- 7. REVIEW CAROUSEL ---------- */
  /* Native scroll-snap rather than a transform track: real momentum swipe on
     iOS, and the browser handles the RTL scroll origin instead of me. */
  var car = $('#car'), vp = $('#carVp'), track = $('#carTrack'), dotsWrap = $('#carDots');
  var cards = [], index = 0, timer = null, idle = null;
  var AUTO = 5200;

  function buildReviews() {
    if (!car || !track || !REVIEWS.length) return;
    track.innerHTML = '';
    REVIEWS.forEach(function (r) {
      var fig = document.createElement('figure');
      fig.className = 'rev';

      var st = document.createElement('div');
      st.className = 'rev__s';
      st.textContent = '★★★★★';
      st.setAttribute('aria-label', '5 out of 5');

      var q = document.createElement('blockquote');
      q.className = 'rev__t';
      q.textContent = r.t;

      var who = document.createElement('figcaption');
      who.className = 'rev__w';
      var av = document.createElement('span');
      av.className = 'rev__av';
      av.textContent = (r.n || '?').trim().charAt(0);
      var nm = document.createElement('span');
      nm.className = 'rev__n';
      nm.textContent = r.n;
      who.appendChild(av); who.appendChild(nm);

      fig.appendChild(st); fig.appendChild(q); fig.appendChild(who);
      track.appendChild(fig);
    });

    cards = $$('.rev', track);
    dotsWrap.innerHTML = '';
    cards.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to review ' + (i + 1));
      b.addEventListener('click', function () { goTo(i, true); bump(); });
      dotsWrap.appendChild(b);
    });
    paintDots();
    startAuto();
  }

  /* distance from the viewport's inline-start edge to the card's — avoids
     scrollLeft, whose sign convention for RTL differs between engines */
  function offsetOf(card) {
    var v = vp.getBoundingClientRect(), c = card.getBoundingClientRect();
    return isRtl() ? (c.right - v.right) : (c.left - v.left);
  }

  function goTo(i, smooth) {
    if (!cards || !cards.length) return;
    index = (i + cards.length) % cards.length;
    var d = offsetOf(cards[index]);
    if (!d) { paintDots(); return; }
    vp.scrollBy({ left: d, behavior: smooth === false ? 'auto' : 'smooth' });
    paintDots();
  }

  function nearest() {
    if (!cards.length) return 0;
    var best = 0, bestD = Infinity;
    cards.forEach(function (c, i) {
      var d = Math.abs(offsetOf(c));
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function paintDots() {
    $$('button', dotsWrap).forEach(function (b, i) { b.classList.toggle('on', i === index); });
  }

  function startAuto() {
    stopAuto();
    if (cards.length < 2) return;
    timer = setInterval(function () { goTo(index + 1, true); }, AUTO);
  }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

  /* pause while they interact, resume a beat later — never yank it out
     from under a finger */
  function bump() {
    stopAuto();
    if (idle) clearTimeout(idle);
    idle = setTimeout(startAuto, 7000);
  }

  if (vp) {
    var st = null;
    vp.addEventListener('scroll', function () {
      if (st) clearTimeout(st);
      st = setTimeout(function () { index = nearest(); paintDots(); }, 90);
    }, { passive: true });
    vp.addEventListener('pointerdown', bump);
    vp.addEventListener('wheel', bump, { passive: true });
    car.addEventListener('pointerenter', stopAuto);
    car.addEventListener('pointerleave', startAuto);
    car.addEventListener('focusin', stopAuto);
    car.addEventListener('focusout', startAuto);
  }

  var prev = $('#carPrev'), next = $('#carNext');
  if (prev) prev.addEventListener('click', function () { goTo(index - 1, true); bump(); });
  if (next) next.addEventListener('click', function () { goTo(index + 1, true); bump(); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAuto(); else startAuto();
  });

  buildReviews();

  /* ---------- 8. SCROLL ---------- */
  var reveals = $$('.rv');
  var heroMedia = $('.hero__media');
  var progFill = $('#progFill');
  var statsEl = $('.stats');
  var statsState = 'idle';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastY = 0, ticking = false;

  /* time-based, not frame-based: a background tab clamps timers to ~1s ticks
     and a fixed step count would crawl there */
  function runStats() {
    if (statsState !== 'idle') return;
    statsState = 'run';
    var t0 = Date.now();
    var iv = setInterval(function () {
      var p = Math.min(1, (Date.now() - t0) / 1400);
      var e = 1 - Math.pow(1 - p, 3);
      paintStats(4.9 * e, Math.round(77 * e));
      if (p >= 1) { clearInterval(iv); statsState = 'done'; paintStats(4.9, 77); }
    }, 30);
  }

  function onScroll() {
    var vh = window.innerHeight, y = window.scrollY;

    if (progFill) {
      var max = document.documentElement.scrollHeight - vh;
      progFill.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    if (nav) {
      nav.classList.toggle('stuck', y > 30);
      var open = menu && menu.classList.contains('open');
      if (!open) {
        if (y > 400 && y > lastY + 4) nav.classList.add('slid');
        else if (y < lastY - 4 || y <= 400) nav.classList.remove('slid');
      }
    }
    lastY = y;

    if (heroMedia && !reduceMotion && y < vh * 1.3) {
      heroMedia.style.transform = 'translate3d(0,' + (y * 0.15).toFixed(1) + 'px,0)';
    }

    if (statsEl && statsEl.getBoundingClientRect().top < vh * 0.9) runStats();

    /* one-way: once revealed it stays revealed, so an anchor jump can never
       strand a section at opacity 0 */
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      if (el.getBoundingClientRect().top < vh * 0.9) {
        el.classList.add('in');
        reveals.splice(i, 1);
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', function () { onScroll(); goTo(index, false); });
  onScroll();
  setTimeout(onScroll, 300);
})();
