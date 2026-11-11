// Progressive enhancements. Every page works without JavaScript: links open
// the full-size images, the menu is a plain row and the form composes an email.

const root = document.documentElement;
root.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------------
   Header: glass background once scrolled, mobile menu toggle
   ------------------------------------------------------------------------ */

const header = document.getElementById('site-header');
const toggle = header?.querySelector('.nav-toggle');

if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (header && toggle) {
  toggle.hidden = false;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ------------------------------------------------------------------------
   Scroll reveal for gallery tiles and content blocks
   ------------------------------------------------------------------------ */

const revealTargets = document.querySelectorAll(
  '.tile, .portrait, .work__intro, .meet__story, .section-head, .contact__details p, .contact__form, .document__page, .legal > ol > li'
);

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );

  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    // Small stagger inside each group so rows cascade in.
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    observer.observe(el);
  });
}

/* ------------------------------------------------------------------------
   My Works: highlight the category pill for the section in view
   ------------------------------------------------------------------------ */

const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];

if (tocLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map(tocLinks.map((a) => [a.hash.slice(1), a]));
  const setActive = (id) => {
    tocLinks.forEach((a) => a.classList.toggle('is-active', a.hash === `#${id}`));
    const link = byId.get(id);
    link?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id);
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

/* ------------------------------------------------------------------------
   Lightbox: groups by data-gallery, keyboard + swipe navigation
   ------------------------------------------------------------------------ */

const galleryLinks = [...document.querySelectorAll('a[data-gallery]')];

if (galleryLinks.length && typeof HTMLDialogElement === 'function') {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.innerHTML = `
    <div class="lightbox__top">
      <span class="lightbox__count" aria-live="polite"></span>
      <button class="lb-btn lb-close" type="button" aria-label="Close viewer">&times;</button>
    </div>
    <div class="lightbox__stage">
      <button class="lb-btn lb-prev" type="button" aria-label="Previous image">&larr;</button>
      <img class="lightbox__img" alt="" />
      <button class="lb-btn lb-next" type="button" aria-label="Next image">&rarr;</button>
    </div>
    <div class="lightbox__caption"></div>`;
  document.body.append(dialog);

  const img = dialog.querySelector('.lightbox__img');
  const count = dialog.querySelector('.lightbox__count');
  const caption = dialog.querySelector('.lightbox__caption');
  const prev = dialog.querySelector('.lb-prev');
  const next = dialog.querySelector('.lb-next');

  let group = [];
  let index = 0;

  const show = (i) => {
    index = (i + group.length) % group.length;
    const link = group[index];
    const thumb = link.querySelector('img');
    const text = link.dataset.caption || '';
    const [title, ...rest] = text.split(' — ');

    img.classList.add('is-loading');
    img.onload = () => img.classList.remove('is-loading');
    img.src = link.href;
    img.alt = thumb?.alt || text || 'Project photo';

    caption.replaceChildren();
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      caption.append(strong);
      if (rest.length) caption.append(rest.join(' — '));
    }

    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(group.length).padStart(2, '0')}`;
    prev.hidden = next.hidden = group.length < 2;

    // Warm the cache for the neighbours.
    [index + 1, index - 1].forEach((n) => {
      const l = group[(n + group.length) % group.length];
      if (l) new Image().src = l.href;
    });
  };

  const open = (link) => {
    group = galleryLinks.filter((l) => l.dataset.gallery === link.dataset.gallery);
    show(group.indexOf(link));
    document.body.classList.add('lb-open');
    dialog.showModal();
  };

  dialog.addEventListener('close', () => {
    document.body.classList.remove('lb-open');
    img.removeAttribute('src');
  });

  galleryLinks.forEach((link) =>
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      open(link);
    })
  );

  dialog.querySelector('.lb-close').addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));

  dialog.addEventListener('click', (event) => {
    if (event.target.classList.contains('lightbox__stage')) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });

  let touchX = null;
  dialog.addEventListener('touchstart', (e) => (touchX = e.touches[0].clientX), { passive: true });
  dialog.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50 && group.length > 1) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}

/* ------------------------------------------------------------------------
   Contact form: compose the message in the visitor's email app, so the form
   works on static hosting with no backend
   ------------------------------------------------------------------------ */

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);

    if (data.get('bot-field')) {
      status.classList.remove('is-error');
      status.textContent = 'Thank you.';
      form.reset();
      return;
    }

    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject_line') || '').trim() || `Website enquiry from ${name}`;
    const message = String(data.get('message') || '').trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    status.classList.remove('is-error');
    status.textContent =
      'Opening your email app with your message ready to send. If nothing opens, write to mihusnoo@gmail.com directly.';

    window.location.href = `mailto:mihusnoo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
