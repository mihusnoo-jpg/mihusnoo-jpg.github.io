# Working on this site

Portfolio of M. Iqbal Husnoo (migrated from Wix). Static HTML, one stylesheet
and one small JavaScript file. No build step, no package manager, no framework.

## Where things are

- `index.html` and `<page>/index.html`: Home, My Works, Case Studies, Meet Me,
  Contact Me, Disclaimer, Thank you, plus hidden My CV and Cover letter pages
  (noindex). The header, footer and font links are repeated in each page; keep
  them in sync (every page carries the same five nav links).
- `case-studies/index.html`: longer project write-ups (Veridian ERP first).
  Reuses the My Works `.work` / `.work__intro` pattern; fact row is
  `dl.stats.facts`, module lists are `.cap-grid > .cap-card`.
- `styles.css`: all styling. Colours, fonts, radii and widths are custom
  properties in the `:root` block at the top.
- `script.js`: progressive enhancements only (sticky header state, mobile
  menu, scroll reveal, My Works category highlighting, image lightbox, AJAX
  contact form submit). Everything works without JavaScript.
- `assets/img/thumb/` previews and `assets/img/full/` full-size images.
  Gallery links use `data-gallery="<group>"` and `data-caption="Title — detail"`.

## Rules

- The contact form is a Netlify Form (`data-netlify="true"`, honeypot
  `bot-field`). Keep its `name="contact"` and field names stable.
- Respect `prefers-reduced-motion`; animate only `transform` and `opacity`.
