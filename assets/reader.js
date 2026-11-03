// Reader studiemiddag AI Chemie: kopieerknoppen, menu, uitklapblokken en screenshots.
(function () {
  // Kopieerknoppen. De tekst komt uit [data-bron] als die er is, anders uit de <pre>.
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.prompt, .instructie');
      var bron = box && (box.querySelector('[data-bron]') || box.querySelector('pre'));
      if (!bron) return;
      var text = bron.textContent.replace(/^\n+|\s+$/g, '');
      var done = function () {
        btn.textContent = 'Gekopieerd';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Kopieer'; btn.classList.remove('done'); }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
      } else {
        fallback(text); done();
      }
    });
  });
  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // Uitklapblok openen als een link ernaar verwijst
  function openTarget() {
    if (!location.hash) return;
    var el = document.getElementById(location.hash.slice(1));
    if (el && el.tagName === 'DETAILS') { el.open = true; }
  }
  window.addEventListener('hashchange', openTarget);
  openTarget();

  // Menu op mobiel
  var toggle = document.getElementById('menuToggle');
  var sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Sluit' : 'Menu';
    });
    sidebar.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      sidebar.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    });
  }

  // Menu: groepen in- en uitklappen (standaard open)
  document.querySelectorAll('[data-group]').forEach(function (g) {
    var btn = g.querySelector('.nav-caret');
    var list = g.querySelector('.nav-sub');
    if (!btn || !list) return;
    btn.addEventListener('click', function () {
      var open = list.hidden;
      list.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Actief nummer in het menu bij scrollen
  var pairs = Array.prototype.slice.call(document.querySelectorAll('.sidebar .nav-link.sub')).map(function (l) {
    var id = (l.getAttribute('href') || '').split('#')[1];
    var t = id && document.getElementById(id);
    return t ? { link: l, target: t } : null;
  }).filter(Boolean);
  var current = null;
  function spy() {
    var line = window.innerHeight * 0.3;
    var hit = null;
    pairs.forEach(function (p) { if (p.target.getBoundingClientRect().top <= line) { hit = p; } });
    if (hit === current) return;
    current = hit;
    pairs.forEach(function (p) { p.link.classList.remove('active'); p.link.removeAttribute('aria-current'); });
    if (hit) { hit.link.classList.add('active'); hit.link.setAttribute('aria-current', 'location'); }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; spy(); });
  }, { passive: true });
  spy();

  // Screenshots: klik om groot te zien, klik of Escape om te sluiten
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a.shot-link');
    if (!link) return;
    e.preventDefault();
    var box = document.createElement('div');
    box.className = 'shot-zoom';
    var img = document.createElement('img');
    img.src = link.getAttribute('href');
    img.alt = (link.querySelector('img') || {}).alt || '';
    box.appendChild(img);
    function close() { box.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(ev) { if (ev.key === 'Escape') close(); }
    box.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(box);
  });
})();
