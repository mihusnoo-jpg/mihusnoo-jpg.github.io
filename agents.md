# Working on this site

Portfolio of M. Iqbal Husnoo (migrated from Wix). Static HTML, one stylesheet
and one small JavaScript file. No build step, no package manager, no framework.

## Where things are

- `index.html` and `<page>/index.html`: Home, My Works, Case Studies, Meet Me,
  Contact Me, Disclaimer, Thank you, Veridia (novel), plus hidden My CV and
  Cover letter pages (noindex). The header, footer and font links are repeated
  in each page; keep   them in sync (every page carries the same six nav links: Home, My Works,
  Case Studies, Meet Me, Veridia, Contact Me).
- `case-studies/index.html`: longer project write-ups (Veridian ERP first).
  Reuses the My Works `.work` / `.work__intro` pattern; fact row is
  `dl.stats.facts`, module lists are `.cap-grid > .cap-card`.
- `veridia/index.html`: the novel *Veridia: The Covenant of the People* —
  synopsis, five-voice cards, fact row, cover gallery, and a free-copy CTA
  linking to `/contact-me/?subject=…` (pre-filled by script.js).
- `styles.css`: all styling. Colours, fonts, radii and widths are custom
  properties in the `:root` block at the top.
- `script.js`: progressive enhancements only (sticky header state, mobile
  menu, scroll reveal, My Works category highlighting, image lightbox,
  contact subject pre-fill, and composing the contact form in the visitor's
  email app). Everything works without JavaScript.
- `assets/img/thumb/` previews and `assets/img/full/` full-size images.
  Gallery links use `data-gallery="<group>"` and `data-caption="Title — detail"`.

## Rules

- The contact form has no backend: with JavaScript it composes a `mailto:`
  message; without it, the form's `action` posts the same way. Keep the field
  names (`name`, `email`, `subject_line`, `message`, `bot-field`) stable, and
  the honeypot field empty-checked (silently accepted when filled).
- Respect `prefers-reduced-motion`; animate only `transform` and `opacity`.
