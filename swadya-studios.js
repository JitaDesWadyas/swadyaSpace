(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  const menuButton = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const progress = document.getElementById('readProgress');

  const setMenu = (open) => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.inert = !open;
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', (event) => {
      if (menuButton.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenu(false);
    });
  }

  let scrollScheduled = false;
  const updateScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, window.scrollY / max)) + ')';
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    scrollScheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -35px 0px', threshold: 0.06 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const range = document.getElementById('delayRange');
  const ghost = document.getElementById('diagramGhost');
  const label = document.getElementById('delayLabel');
  if (range && ghost && label) {
    const updateDiagram = () => {
      const intensity = Math.max(0, Math.min(100, Number(range.value) || 0));
      ghost.style.left = (77 - intensity * 0.68) + '%';
      ghost.style.opacity = String(0.5 + intensity * 0.005);
      label.textContent = intensity < 18 ? 'QUASI ALLINEATO' : intensity < 45 ? 'LEGGERO' : intensity < 75 ? 'INTERMEDIO' : 'PROFONDO';
    };
    range.addEventListener('input', updateDiagram);
    updateDiagram();
  }

  const storyLine = document.getElementById('storyLine');
  const storyNext = document.getElementById('storyNext');
  const stories = [
    'La porta si apre. Dietro, qualcuno sta aspettando.',
    'Ma il testimone si rivela essere il colpevole.',
    'All’improvviso, il castello diventa una nave.',
    'Una scoperta cambia ogni cosa. Nessuno si fida più.',
    'Poi arriva un alleato. Ha un piano completamente diverso.',
    'E proprio sul finale, il protagonista cambia idea.'
  ];
  let storyIndex = 0;
  if (storyLine && storyNext) {
    storyNext.addEventListener('click', () => {
      storyIndex = (storyIndex + 1) % stories.length;
      storyLine.textContent = stories[storyIndex];
    });
  }

  const glow = document.getElementById('ambientCursor');
  if (glow && !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -500, mouseY = -500, scheduled = false;
    document.addEventListener('pointermove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          glow.style.left = mouseX + 'px';
          glow.style.top = mouseY + 'px';
          scheduled = false;
        });
      }
    }, { passive: true });
  }
})();
