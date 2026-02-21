(function () {
  'use strict';

  let currentLang = localStorage.getItem('portfolio-lang') || 'en';
  let translations = {};

  // DOM
  const langToggle = document.getElementById('langToggle');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const projectsContainer = document.getElementById('projectsContainer');
  const marqueeWords = document.getElementById('marqueeWords');
  const marqueeWordsDup = document.getElementById('marqueeWordsDup');
  const yearEl = document.getElementById('year');

  async function init() {
    yearEl.textContent = new Date().getFullYear();
    await loadTranslations();
    applyAll();
    setupLangToggle();
    setupBurger();
    duplicateTechTrain();  
    setupScrollReveal();
    setupBlockReveal();
    setupSmoothScroll();
  }

  function duplicateTechTrain() {
    const track = document.querySelector('.tech-train-track');
    const group = document.getElementById('techTrain1');

    if (!track || !group) return;

    // Clona el grupo original múltiples veces 
    for (let i = 0; i < 3; i++) {
      const clone = group.cloneNode(true);
      clone.removeAttribute('id'); 
      track.appendChild(clone);
    }
  }

  // Translationsd
  async function loadTranslations() {
    try {
      const [en, es] = await Promise.all([
        fetch('data/en.json').then(r => r.json()),
        fetch('data/es.json').then(r => r.json())
      ]);
      translations = { en, es };
    } catch (e) {
      console.error('Failed to load translations:', e);
    }
  }

  function get(obj, path) {
    return path.split('.').reduce((a, k) => (a && a[k] != null ? a[k] : null), obj);
  }

  function applyAll() {
    const lang = translations[currentLang];
    if (!lang) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = get(lang, el.getAttribute('data-i18n'));
      if (val) el.textContent = val;
    });

    // Update lang switch toggle
    if (currentLang === 'es') {
      langToggle.classList.add('es-active');
    } else {
      langToggle.classList.remove('es-active');
    }
    document.documentElement.lang = currentLang;
    renderMarquee(lang);
    renderProjects(lang);
  }

  function setupLangToggle() {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'es' : 'en';
      localStorage.setItem('portfolio-lang', currentLang);
      applyAll();
    });
  }

  // Burger
  function setupBurger() {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- MARQUEE WORDS ----
  function renderMarquee(lang) {
    const words = lang.marqueeWords || [];
    const html = words.map(w => `<span>${w}</span>`).join('');
    marqueeWords.innerHTML = html;
    marqueeWordsDup.innerHTML = html;
  }

  // Proyectos
  const projectColors = ['magenta', 'teal', 'tangerine'];

  function renderProjects(lang) {
    const items = lang.projects.items;
    projectsContainer.innerHTML = items.map((p, i) => {
      const tags = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
      const links = p.repos.map(r => `
        <a href="${r.url}" target="_blank" rel="noopener" class="project-link">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          ${r.label}
        </a>
      `).join('');

      const liveDemoBtn = p.liveDemo ? `
        <a href="${p.liveDemo}" target="_blank" rel="noopener" class="project-link project-link-demo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>
          ${currentLang === 'en' ? 'Live Demo' : 'Demo en Vivo'}
        </a>
      ` : '';

      const showcase = p.featured ? `
        <div class="project-showcase">
          <div class="project-preview">
            <div class="project-preview-header">
              <div class="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="preview-url">${p.liveDemo}</span>
            </div>
            <div class="project-preview-body">
              <img src="${p.screenshot || 'https://via.placeholder.com/800x500/0a0a0a/CCFF00?text=UFC+Picks+Platform'}" alt="${p.title} screenshot" loading="lazy">
              <div class="preview-overlay">
                <a href="${p.liveDemo}" target="_blank" rel="noopener" class="preview-cta">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                  ${currentLang === 'en' ? 'View Live Site' : 'Ver Sitio en Vivo'}
                </a>
              </div>
            </div>
          </div>
        </div>
      ` : '';

      return `
        <div class="project-row ${p.featured ? 'project-featured' : ''}">
          <div class="project-color-bar">
            <span class="project-number">${p.number}</span>
          </div>
          <div class="project-body">
            <p class="project-subtitle">${p.subtitle}</p>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.description}</p>
            <div class="project-tags">${tags}</div>
            <div class="project-links">${liveDemoBtn}${links}</div>
          </div>
          ${showcase}
        </div>
      `;
    }).join('');
  }

  function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });
  }

  function setupBlockReveal() {
    const blocks = document.querySelectorAll('.block');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(blocks).indexOf(entry.target);
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, idx * 120);
        }
      });
    }, { threshold: 0.15 });

    blocks.forEach(block => {
      block.style.opacity = '0';
      block.style.transform = 'translateY(50px)';
      block.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(block);
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
