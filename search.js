/* ════════════════════════════════════════════════════════════════════
   SPIO Systems — client-side site search
   ────────────────────────────────────────────────────────────────────
   Pure static, no backend. The index below is maintained by hand:
   when you add a new page or article, add an entry to SEARCH_INDEX.
   Each entry is matched against title + keywords + excerpt.
   ════════════════════════════════════════════════════════════════════ */

const SEARCH_INDEX = [
  /* ── Core pages ── */
  {
    title: 'Home',
    url: 'index.html',
    type: 'Page',
    excerpt: 'Miniaturizing optics, maximizing impact — optical chips for agriculture, medical, wearables and mobile.',
    keywords: 'home spio systems optical chip micro optics polymer photonics spectrometer micro-spectrometer volume production miniaturize optics overview company'
  },
  {
    title: 'Services',
    url: 'services.html',
    type: 'Page',
    excerpt: 'Optical design, prototyping and volume production — turn-key OEM contract manufacturing.',
    keywords: 'services design prototyping volume production manufacturing oem contract micro optics polymer photonics spectrometer micro-spectrometer redesign mastering'
  },
  {
    title: 'Technology',
    url: 'technology.html',
    type: 'Page',
    excerpt: 'Stacked Planar Integrated Optics (SPIO) — nanoimprint lithography, roll-to-plate, wafer-level optics.',
    keywords: 'technology spio stacked planar integrated optics micro optics polymer photonics spectrometer micro-spectrometer volume production nanoimprint lithography roll-to-plate wafer photonics zemax freeform gratings'
  },
  {
    title: 'About Us',
    url: 'about.html',
    type: 'Page',
    excerpt: 'An optics company north of Copenhagen, founded 2020. Engineers and physicists driven by curiosity.',
    keywords: 'about company micro optics polymer photonics spectrometer micro-spectrometer volume production team leadership board farum denmark copenhagen founded history mission vision'
  },
  {
    title: 'Contact',
    url: 'contact.html',
    type: 'Page',
    excerpt: 'Get in touch about optical design, prototyping, or volume production.',
    keywords: 'contact micro optics polymer photonics spectrometer micro-spectrometer volume production email phone address farum location map get in touch inquiry'
  },

  /* ── Products ── */
  {
    title: 'Products Overview',
    url: 'products.html',
    type: 'Page',
    excerpt: 'Our optical chip products — spectrometers, development kits, and funded research.',
    keywords: 'products overview catalog portfolio micro optics polymer photonics spectrometer micro-spectrometer volume production development kit metalens'
  },
  {
    title: 'NIR Spectrometer',
    url: 'product-nir-spectrometer.html',
    type: 'Product',
    excerpt: 'Miniature near-infrared spectrometer on an optical chip for compact spectral sensing.',
    keywords: 'nir near infrared spectrometer micro-spectrometer micro optics polymer photonics volume production spectral sensing miniature chip module agriculture medical wavelength'
  },
  {
    title: 'VIS Spectrometer',
    url: 'product-vis-spectrometer.html',
    type: 'Product',
    excerpt: 'Visible-range spectrometer on an optical chip for colour and spectral analysis.',
    keywords: 'vis visible spectrometer micro-spectrometer micro optics polymer photonics volume production colour color spectral analysis chip module wavelength'
  },
  {
    title: 'Spectrometer Development Kit',
    url: 'product-development-kit.html',
    type: 'Product',
    excerpt: 'Evaluation and development kit for integrating SPIO spectrometer modules into your device.',
    keywords: 'development kit dev kit micro-spectrometer micro optics polymer photonics volume production evaluation eval board sdk integration prototype spectrometer getting started'
  },
  {
    title: 'Nano-Raman Metalens',
    url: 'product-nano-raman-metalens.html',
    type: 'Product',
    excerpt: 'Funded research project: nanostructured metalens for Raman spectroscopy.',
    keywords: 'nano raman metalens micro optics polymer photonics micro-spectrometer metasurface nanostructure funded project research grant spectroscopy flat optics'
  },

  /* ── Insights / Blog ── */
  {
    title: 'Insights',
    url: 'blog.html',
    type: 'Page',
    excerpt: 'Articles and technical insights for optical and photonic engineers.',
    keywords: 'insights blog articles micro optics polymer photonics spectrometer micro-spectrometer volume production news technical photonics optics engineering knowledge'
  },
  {
    title: 'Designing Compact Micro Optics: From Free-Space to Chip',
    url: 'blog-sample-post.html',
    type: 'Article',
    excerpt: 'How a free-space optical setup becomes a compact, wafer-level micro optics module in polymer photonics.',
    keywords: 'micro optics polymer photonics spectrometer micro-spectrometer volume production optical design free-space chip wafer photonic engineer article sample'
  },

  /* ── Q&A ── */
  {
    title: 'Q&A',
    url: 'qa.html',
    type: 'Page',
    excerpt: 'Questions and answers on micro optics, polymer photonics, spectrometers, micro-spectrometers, and volume production.',
    keywords: 'qa q&a faq questions answers micro optics polymer photonics spectrometer micro-spectrometer volume production free-space optics mission foundation foss millpond ibsen photonics per ibsen copenhagen'
  },
];

/* ──────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  let overlay, input, resultsEl, selIndex = -1, current = [];

  /* Build the overlay DOM once and attach to <body> */
  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.innerHTML = `
      <div class="search-box" role="dialog" aria-label="Site search">
        <div class="search-input-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="search-input" placeholder="Search products, pages and insights…" autocomplete="off" spellcheck="false">
          <span class="search-esc">ESC</span>
        </div>
        <div class="search-results" id="search-results"></div>
        <div class="search-hint">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to open</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    input     = overlay.querySelector('#search-input');
    resultsEl = overlay.querySelector('#search-results');

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('.search-esc').addEventListener('click', close);
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', onKeyDown);
  }

  function open() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    input.value = '';
    render('');
    setTimeout(() => input.focus(), 30);
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    selIndex = -1;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(text, q) {
    const safe = escapeHtml(text);
    if (!q) return safe;
    const terms = q.trim().split(/\s+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!terms.length) return safe;
    return safe.replace(new RegExp('(' + terms.join('|') + ')', 'gi'), '<mark>$1</mark>');
  }

  function search(q) {
    const query = q.trim().toLowerCase();
    if (!query) return SEARCH_INDEX.slice();
    const terms = query.split(/\s+/).filter(Boolean);
    return SEARCH_INDEX
      .map(item => {
        const hay = (item.title + ' ' + item.keywords + ' ' + item.excerpt).toLowerCase();
        let score = 0;
        for (const t of terms) {
          if (!hay.includes(t)) return null;          // every term must appear
          if (item.title.toLowerCase().includes(t)) score += 3;
          if (item.keywords.toLowerCase().includes(t)) score += 1;
        }
        return { item, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map(r => r.item);
  }

  function render(q) {
    current  = search(q);
    selIndex = current.length ? 0 : -1;

    if (!current.length) {
      resultsEl.innerHTML = `<div class="search-empty">No results for &ldquo;${escapeHtml(q)}&rdquo;.<br>Try &ldquo;spectrometer&rdquo;, &ldquo;nanoimprint&rdquo;, or &ldquo;development kit&rdquo;.</div>`;
      return;
    }

    resultsEl.innerHTML = current.map((item, i) => `
      <a class="search-result ${i === 0 ? 'sel' : ''}" href="${item.url}" data-i="${i}">
        <span class="search-result-type ${item.type.toLowerCase()}">${item.type}</span>
        <span class="search-result-text">
          <h4>${highlight(item.title, q)}</h4>
          <p>${highlight(item.excerpt, q)}</p>
        </span>
      </a>`).join('');

    resultsEl.querySelectorAll('.search-result').forEach(el => {
      el.addEventListener('mouseenter', () => setSel(+el.dataset.i));
    });
  }

  function setSel(i) {
    const els = resultsEl.querySelectorAll('.search-result');
    if (!els.length) return;
    selIndex = (i + els.length) % els.length;
    els.forEach((el, idx) => el.classList.toggle('sel', idx === selIndex));
    els[selIndex].scrollIntoView({ block: 'nearest' });
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown')      { e.preventDefault(); setSel(selIndex + 1); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setSel(selIndex - 1); }
    else if (e.key === 'Enter')     {
      e.preventDefault();
      const el = resultsEl.querySelectorAll('.search-result')[selIndex];
      if (el) window.location.href = el.getAttribute('href');
    }
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    buildOverlay();

    document.querySelectorAll('#nav-search-btn, .nav-search-btn, [data-search-open]').forEach(btn =>
      btn.addEventListener('click', e => { e.preventDefault(); open(); }));

    document.addEventListener('keydown', e => {
      // "/" or Cmd/Ctrl-K opens search; Esc closes
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (e.key === 'Escape' && overlay.classList.contains('open')) { close(); }
      else if (e.key === '/' && !typing && !overlay.classList.contains('open')) { e.preventDefault(); open(); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    });
  });
})();
