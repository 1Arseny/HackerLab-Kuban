// ==========================
// Main entry for all sections
// ==========================

// Кнопка "наверх"
function initScrollTopButton() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.remove('hidden');
      btn.classList.add('opacity-100');
    } else {
      btn.classList.add('hidden');
      btn.classList.remove('opacity-100');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollTopButton();
});


// ===== Scroll progress bar =====
(function initScrollProgress() {
  const fill = document.getElementById('scrollbar-fill');
  if (!fill) return;

  function update() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const max = (doc.scrollHeight - doc.clientHeight) || 1;
    const p = Math.min(1, Math.max(0, scrollTop / max));
    fill.style.transform = `scaleX(${p})`;
    requestAnimationFrameId = null;
  }

  let requestAnimationFrameId = null;
  function onScroll() {
    if (requestAnimationFrameId == null) {
      requestAnimationFrameId = requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// ===== Smooth anchor scroll with offset (header + sticky activities nav) =====
(function initAnchorScroll() {
  const header = document.querySelector('header');
  const nav = document.getElementById('activities-nav');

  function getOffsetY() {
    let offset = 0;
    if (header) offset += header.getBoundingClientRect().height;
    if (nav && nav.classList.contains('is-fixed')) {
      offset += nav.getBoundingClientRect().height;
    }
    
    return offset + 8;
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const rect = target.getBoundingClientRect();
    const absoluteY = window.pageYOffset + rect.top;
    const y = absoluteY - getOffsetY();

    window.scrollTo({ top: y, behavior: 'smooth' });

    history.replaceState(null, '', `#${id}`);
  }, false);
})();


// Функция безопасного подключения модулей
function loadSection(sectionName) {
  import(`./sections/${sectionName}.js`)
    .then(module => {
      if (typeof module.default === 'function') {
        module.default();
      }
    })
    .catch(err => {
      console.warn(`Не удалось загрузить секцию: ${sectionName}`, err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSection('hero');
  loadSection('about');
  loadSection('activities');
});
