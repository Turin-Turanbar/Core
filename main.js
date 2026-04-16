/* ============================================================
   CORE Design System Docs — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     Sidebar · Mobile toggle
  ────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger?.addEventListener('click', () => {
    sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay?.addEventListener('click', closeSidebar);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  // Close sidebar when clicking a nav link (mobile)
  sidebar?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) closeSidebar();
    });
  });


  /* ──────────────────────────────────────────
     Sidebar · Collapsible sections
  ────────────────────────────────────────── */
  document.querySelectorAll('.nav-section-btn').forEach(btn => {
    const targetId = btn.dataset.section;
    const list = document.getElementById(`nav-${targetId}`);
    if (!list) return;

    // Set initial explicit height so CSS transition can work
    list.style.maxHeight = list.scrollHeight + 'px';
    list.style.overflow = 'hidden';
    list.style.transition = 'max-height 240ms ease';

    btn.addEventListener('click', () => {
      const isOpen = !btn.classList.contains('collapsed');

      if (isOpen) {
        // Collapse: first lock to exact px, then animate to 0
        list.style.maxHeight = list.scrollHeight + 'px';
        requestAnimationFrame(() => {
          list.style.maxHeight = '0';
        });
        btn.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        // Expand: animate to scrollHeight
        list.style.maxHeight = list.scrollHeight + 'px';
        btn.classList.remove('collapsed');
        btn.setAttribute('aria-expanded', 'true');

        // After transition, allow height to grow if content changes
        list.addEventListener('transitionend', () => {
          if (!btn.classList.contains('collapsed')) {
            list.style.maxHeight = 'none';
          }
        }, { once: true });
      }
    });

    btn.setAttribute('aria-expanded', 'true');
  });


  /* ──────────────────────────────────────────
     ComponentPreview · Tab switching
  ────────────────────────────────────────── */
  document.querySelectorAll('.component-preview').forEach(preview => {
    const tabs   = preview.querySelectorAll('.cp-tab');
    const panels = preview.querySelectorAll('.cp-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('hidden', '');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const panel = preview.querySelector(`[data-panel="${target}"]`);
        if (panel) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        }
      });
    });
  });


  /* ──────────────────────────────────────────
     Copy button
  ────────────────────────────────────────── */
  const copyIcon = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
    <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;

  const checkIcon = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M2.5 8.5l4 4 7-8" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = btn.closest('.cp-code')?.querySelector('code');
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code.innerText);
        btn.innerHTML = `${checkIcon} Copied!`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `${copyIcon} Copy`;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.innerHTML = 'Failed';
        setTimeout(() => {
          btn.innerHTML = `${copyIcon} Copy`;
        }, 1500);
      }
    });
  });


  /* ──────────────────────────────────────────
     TOC · Active section tracking
  ────────────────────────────────────────── */
  const tocLinks  = document.querySelectorAll('.toc-link');
  const sections  = document.querySelectorAll('section[id], h2[id], h3[id]');

  if (tocLinks.length && sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      rootMargin: '-10% 0% -75% 0%',
      threshold: 0,
    });

    sections.forEach(s => observer.observe(s));
  }

});
