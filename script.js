/* ============================================================
   CORAX — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initNav();
  initReveal();
  initCounters();
  initTerminal();
  initQsTabs();
  initHeroThree();
});

/* ── Nav scroll ──────────────────────────────────────────── */
function initNav() {
  // nav is always visible — no extra state needed (already styled in CSS)
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
  }
}

window.closeMobileNav = function () {
  document.getElementById('mobileNav')?.classList.remove('open');
};

/* ── Scroll reveal ───────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── Animated counters ───────────────────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); } }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

function runCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const dur    = 1100;
  const start  = performance.now();
  const step = (ts) => {
    const p = Math.min((ts - start) / dur, 1);
    const v = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(v * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Quick-start tabs ────────────────────────────────────── */
function initQsTabs() {
  // default: first tab active
  showQsTab(0);
}

window.showQsTab = function (idx, btn) {
  document.querySelectorAll('.code-block').forEach((b, i) => b.classList.toggle('active', i === idx));
  document.querySelectorAll('.qs-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else document.querySelectorAll('.qs-btn')[idx]?.classList.add('active');
  lucide.createIcons();
};

/* ── Copy code ───────────────────────────────────────────── */
window.copyCode = function (preId) {
  const el = document.getElementById(preId);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    const btn = el.closest('.code-block')?.querySelector('.copy-btn span');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = 'Скопировано';
      setTimeout(() => { btn.textContent = orig; }, 1800);
    }
  });
};

/* ── Terminal animation ──────────────────────────────────── */
const TERM_LINES = [
  { type: 'cmd', text: 'git clone https://github.com/your/corax.git && cd corax' },
  { type: 'out', text: 'Cloning into \'corax\'... done.' },
  { type: 'cmd', text: 'python -m venv venv && pip install -r requirements.txt' },
  { type: 'out', text: 'Successfully installed fastapi uvicorn sqlalchemy pydantic ...' },
  { type: 'cmd', text: 'python scripts/create_admin.py' },
  { type: 'out', text: '[✓] Admin user created successfully' },
  { type: 'cmd', text: 'python -m uvicorn backend.main:app --port 8010 --reload' },
  { type: 'info', text: 'INFO:     Started server process [8010]' },
  { type: 'info', text: 'INFO:     Uvicorn running on http://127.0.0.1:8010' },
  { type: 'out',  text: 'CORAX ready · AI · Telegram · Compliance ✓' },
];

function initTerminal() {
  const body = document.getElementById('termBody');
  if (!body) return;
  let i = 0;

  function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function next() {
    if (i >= TERM_LINES.length) {
      setTimeout(() => { body.innerHTML = ''; i = 0; next(); }, 3500);
      return;
    }
    const line = TERM_LINES[i++];

    if (line.type === 'cmd') {
      const row = document.createElement('div');
      row.innerHTML = `<span class="t-prompt">$ </span><span class="t-cmd"></span><span class="t-cursor"></span>`;
      body.appendChild(row);
      const cmd    = row.querySelector('.t-cmd');
      const cursor = row.querySelector('.t-cursor');
      let c = 0;
      const type = () => {
        if (c < line.text.length) {
          cmd.textContent += line.text[c++];
          body.scrollTop = body.scrollHeight;
          setTimeout(type, 30 + Math.random() * 35);
        } else {
          cursor.remove();
          setTimeout(next, 160);
        }
      };
      setTimeout(type, 240);
    } else {
      setTimeout(() => {
        const cls = line.type === 'info' ? 't-info' : line.type === 'warn' ? 't-warn' : 't-out';
        const row = document.createElement('div');
        row.innerHTML = `<span class="${cls}">${esc(line.text)}</span>`;
        body.appendChild(row);
        body.scrollTop = body.scrollHeight;
        setTimeout(next, 80);
      }, 90);
    }
  }

  setTimeout(next, 500);
}

/* ── Hero Three.js background ─────────────────────────────── */
function initHeroThree() {
  const wrap = document.getElementById('hero-three-wrap');
  if (!wrap || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  wrap.appendChild(renderer.domElement);

  const material = new THREE.MeshBasicMaterial({
    color: 0xcbd5e1,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });

  const leftGeo = new THREE.OctahedronGeometry(1.2, 0);
  const leftMesh = new THREE.Mesh(leftGeo, material);
  leftMesh.position.set(-4.5, 0.5, -2);
  leftMesh.rotation.set(0.4, 0.2, 0);
  scene.add(leftMesh);

  const rightGeo = new THREE.IcosahedronGeometry(1, 0);
  const rightMesh = new THREE.Mesh(rightGeo, material);
  rightMesh.position.set(4.2, -0.3, -2);
  rightMesh.rotation.set(-0.2, 0.5, 0);
  scene.add(rightMesh);

  const smallLeft = new THREE.Mesh(new THREE.TetrahedronGeometry(0.6, 0), material);
  smallLeft.position.set(-5, -1.2, 0);
  scene.add(smallLeft);

  const smallRight = new THREE.Mesh(new THREE.TetrahedronGeometry(0.5, 0), material);
  smallRight.position.set(4.8, 1, 0);
  scene.add(smallRight);

  function resize() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    renderer.setSize(w, h);
    renderer.domElement.style.width = w + 'px';
    renderer.domElement.style.height = h + 'px';
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;
    leftMesh.rotation.y = t * 0.5;
    rightMesh.rotation.x = t * 0.4;
    smallLeft.rotation.y = t * 0.7;
    smallRight.rotation.x = t * 0.6;
    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();
}
