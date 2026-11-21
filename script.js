/* =====================================================================
   script.js : construit le site à partir de data.js
   Un "module" = une fonction dans RENDERERS, reliée à une <section data-render="nom">.
   Pour créer un nouveau module : ajoute une fonction ici, une entrée dans data.js
   et une <section data-render="nom"> dans index.html.
   ===================================================================== */

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Utilitaires ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Texte entre crochets = trou à compléter, mis en évidence
const t = (s) => (SITE.highlightTodos && String(s).trim().startsWith("[") ? `<span class="todo">${esc(s)}</span>` : esc(s));
const each = (arr, fn) => (arr || []).map(fn).join("");
const link = (href, inner, attrs = "") => (href ? `<a href="${esc(href)}" ${attrs}>${inner}</a>` : "");
const external = (href) => (/^https?:/.test(href) ? 'target="_blank" rel="noopener"' : "");
const head = (title, intro) => `<div class="section-head"><h2>${t(title)}</h2>${intro ? `<p>${t(intro)}</p>` : ""}</div>`;

/* ---------- Schéma en étoile généré depuis les compétences ---------- */
function topology(skills, hubLabel) {
  const cx = 300, cy = 210, rx = 215, ry = 150, n = skills.length;
  const pts = skills.map((s, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), name: s.name, w: s.name.length * 8.2 + 34 };
  });
  const ring = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
  return `<svg viewBox="0 0 600 420" role="img" aria-label="Schéma en étoile des domaines de compétences">
    <g class="ring"><path d="${ring}"/></g>
    <g class="spokes">${each(pts, (p) => `<path d="M${cx} ${cy} L${p.x.toFixed(1)} ${p.y.toFixed(1)}"/>`)}</g>
    ${each(pts, (p) => `<g class="pill"><rect x="${(p.x - p.w / 2).toFixed(1)}" y="${(p.y - 18).toFixed(1)}" width="${p.w.toFixed(1)}" height="36" rx="18"/><text x="${p.x.toFixed(1)}" y="${(p.y + 5).toFixed(1)}">${esc(p.name)}</text></g>`)}
    <g class="hub"><circle cx="${cx}" cy="${cy}" r="46"/><text x="${cx}" y="${cy + 5}">${esc(hubLabel)}</text></g>
  </svg>`;
}

/* ---------- Modules ---------- */
const RENDERERS = {
  hero(S) {
    const terminal = each(S.terminal, (l) => `<p class="line"><span class="ps">$</span> <span class="cmd">${esc(l.cmd)}</span></p><p class="out${l.ok ? " ok" : ""}">${esc(l.out)}</p>`);
    return `<canvas id="net" aria-hidden="true"></canvas>
    <div class="hero-inner">
      <div class="hero-text">
        <p class="status"><span class="dot"></span> ${esc(S.status)}</p>
        <h1>${esc(S.name).replace(" ", "<br>")}</h1>
        <p class="role">${esc(S.role)}</p>
        <p class="pitch">${t(S.pitch)}</p>
        <div class="actions">${each(S.buttons, (b) => `<a class="btn btn-${esc(b.style)}" href="${esc(b.href)}">${esc(b.label)}</a>`)}</div>
      </div>
      <div class="hero-visual">
        <figure class="portrait"><img src="${esc(S.photo)}" alt="${esc(S.photoAlt)}" width="640" height="854"></figure>
        <div class="term" role="img" aria-label="Terminal : ${esc(S.role)}">
          <div class="term-bar"><span></span><span></span><span></span><b>${esc(S.handle)}@dev: ~</b></div>
          <div class="term-body">${terminal}</div>
        </div>
      </div>
    </div>`;
  },

  presentation(S) {
    const P = S.presentation;
    return `<div class="about-inner">
      <div class="about-text"><h2>${t(P.title)}</h2>${each(P.paragraphs, (p) => `<p>${t(p)}</p>`)}</div>
      <figure class="topology">${topology(P.skills, S.handle)}<figcaption>${esc(P.diagramCaption)}</figcaption></figure>
    </div>
    <div class="about-extra">
      <ul class="edu">${each(P.formation, (f) => `<li><p class="meta">${t(f.period)}</p><h3>${t(f.title)}</h3><p>${t(f.place)}</p></li>`)}</ul>
      <div class="groups">${each(P.skills, (g) => `<div class="group"><h3>${esc(g.name)}</h3><ul class="tags">${each(g.items, (i) => `<li>${t(i)}</li>`)}</ul></div>`)}</div>
    </div>`;
  },

  experience(S) {
    const E = S.experience;
    return `${head(E.title, E.intro)}
    <ol class="timeline">${each(E.items, (e) => `<li class="tl-item"><span class="tl-dot"></span>
      <div class="tl-card">
        <p class="meta">${t(e.period)}</p>
        <h3>${t(e.role)}</h3>
        <p class="tl-company">${t(e.company)}${e.place ? ` · ${t(e.place)}` : ""}</p>
        ${e.summary ? `<p>${t(e.summary)}</p>` : ""}
        ${e.missions?.length ? `<ul class="tl-list">${each(e.missions, (m) => `<li>${t(m)}</li>`)}</ul>` : ""}
        ${e.tools?.length ? `<ul class="tags">${each(e.tools, (x) => `<li>${t(x)}</li>`)}</ul>` : ""}
      </div></li>`)}</ol>`;
  },

  projets(S) {
    const Pj = S.projets;
    const cats = [...new Set(Pj.items.map((p) => p.category).filter(Boolean))];
    const filters = cats.length > 1
      ? `<div class="filters" role="group" aria-label="Filtrer les projets">${each(["", ...cats], (c, i) => `<button type="button" data-filter="${esc(c)}" aria-pressed="${i === 0}">${esc(c || Pj.allLabel)}</button>`)}</div>`
      : "";
    const cards = each(Pj.items, (p) => {
      const hasSite = (p.links || []).some((l) => l.type === "site" && l.href);
      const links = each(p.links, (l) => link(l.href, `<i class="${ICON[l.type] || ICON.site}"></i> ${esc(l.label)}`, external(l.href)));
      return `<article class="project" data-category="${esc(p.category)}">
        <p class="path"><span class="live${hasSite ? "" : " off"}"></span> ~/projets/${esc(p.slug)}</p>
        <div class="frame${p.image ? "" : " empty"}">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" loading="lazy">` : '<i class="fa-solid fa-diagram-project" aria-hidden="true"></i>'}</div>
        <div class="project-body">
          <h3>${t(p.title)}</h3><p>${t(p.description)}</p>
          <ul class="tags">${each(p.tags, (x) => `<li>${t(x)}</li>`)}</ul>
          ${links ? `<p class="links">${links}</p>` : ""}
        </div></article>`;
    });
    return `${head(Pj.title, Pj.intro)}${filters}<div class="grid">${cards}</div>`;
  },

  veille(S) {
    const V = S.veille;
    const list = (arr) => `<ul class="plain">${each(arr, (x) => `<li>${x.url ? link(x.url, t(x.name), external(x.url)) : t(x.name)}</li>`)}</ul>`;
    return `${head(V.title, V.intro)}
    <div class="veille-inner">
      <aside class="veille-card">
        <p class="meta">${esc(V.subjectLabel)}</p>
        <h3>${t(V.subject)}</h3><p>${t(V.why)}</p>
        <h4>${esc(V.toolsTitle)}</h4>${list(V.tools)}
        <h4>${esc(V.sourcesTitle)}</h4>${list(V.sources)}
      </aside>
      <div class="feed"><h3 class="feed-title">${esc(V.entriesTitle)}</h3>
        ${each(V.entries, (e) => `<article class="entry">
          <p class="meta">${t(e.date)} · ${t(e.source)}</p>
          <h3>${t(e.title)}</h3><p>${t(e.summary)}</p>
          ${e.url ? `<p class="links">${link(e.url, `<i class="${ICON.site}"></i> Lire l’article`, external(e.url))}</p>` : ""}
        </article>`)}
      </div>
    </div>`;
  },

  contact(S) {
    const C = S.contact;
    return `<div class="contact-inner">
      <div><h2>${esc(C.title).replace(/ (?=[^ ]*$)/, "<br>")}</h2><p>${t(C.intro)}</p></div>
      <div class="term term-contact">
        <div class="term-bar"><span></span><span></span><span></span><b>${esc(C.terminalTitle)}</b></div>
        <ul class="term-body">${each(C.links, (l) => (l.href ? `<li><i class="${esc(l.icon)}"></i>${link(l.href, esc(l.label), external(l.href))}</li>` : ""))}</ul>
      </div>
    </div>`;
  },
};

/* ---------- Assemblage de la page ---------- */
function build() {
  document.querySelectorAll("[data-render]").forEach((sec) => {
    const fn = RENDERERS[sec.dataset.render];
    if (fn) sec.innerHTML = fn(SITE);
  });
  // menu
  document.getElementById("brand").innerHTML = `${esc(SITE.handle)}@dev:~$<span class="caret" aria-hidden="true"></span>`;
  document.getElementById("menu").innerHTML = each([...document.querySelectorAll("main section[id]")], (s) =>
    SITE.nav[s.dataset.render] ? `<a href="#${s.id}">/${esc(SITE.nav[s.dataset.render])}</a>` : "");
  document.getElementById("footer").innerHTML = `<p>${esc(SITE.footer)}</p><a href="#top">Retour en haut</a>`;
  // filtres de projets
  const filters = document.querySelector(".filters");
  if (filters) filters.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    document.querySelectorAll(".project").forEach((card) => {
      card.hidden = b.dataset.filter && card.dataset.category !== b.dataset.filter;
    });
  });
}

/* ---------- Réseau de nœuds animé (accueil) ---------- */
function network() {
  const canvas = document.getElementById("net");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const LINK = "143, 227, 180";
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: -9999, y: -9999 };
  let w = 0, h = 0, nodes = [], running = true;

  function resize() {
    const r = hero.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(95, (w * h) / 15000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.4 + 1,
    }));
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const D = 140, M = 190;
    if (!reduceMotion) for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < D) {
          ctx.strokeStyle = `rgba(${LINK}, ${(1 - d / D) * 0.32})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < M) {
        ctx.strokeStyle = `rgba(${LINK}, ${(1 - dm / M) * 0.7})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${LINK}, 0.85)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  const loop = () => { if (running) draw(); requestAnimationFrame(loop); };
  hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  window.addEventListener("resize", resize);
  new IntersectionObserver(([e]) => { running = e.isIntersecting; }).observe(hero);
  resize();
  if (!reduceMotion) loop();
}

/* ---------- Terminal : saisie des commandes (une seule fois) ---------- */
async function typeTerminal() {
  const body = document.querySelector(".hero .term-body");
  if (!body || reduceMotion) return;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rows = [...body.children];
  const cmds = rows.map((r) => r.querySelector(".cmd"));
  const texts = cmds.map((c) => c && c.textContent);
  rows.forEach((r, i) => { r.classList.add("pending"); if (cmds[i]) cmds[i].textContent = ""; });
  await wait(900);
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.remove("pending");
    if (cmds[i]) {
      cmds[i].classList.add("typing");
      for (const ch of texts[i]) { cmds[i].textContent += ch; await wait(55); }
      cmds[i].classList.remove("typing");
      await wait(250);
    } else await wait(350);
  }
}

/* ---------- Veille : articles récupérés automatiquement (veille.json) ---------- */
async function loadFeed() {
  const V = SITE.veille, box = document.querySelector("#veille .feed");
  if (!box || !V.feedsFile || !(V.feeds || []).some((f) => f.url)) return;
  try {
    const res = await fetch(V.feedsFile, { cache: "no-cache" });
    if (!res.ok) return;
    const { updated, items } = await res.json();
    const shown = (items || []).slice(0, V.autoCount || 6);
    if (!shown.length) return;
    const fr = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "");
    box.insertAdjacentHTML("beforeend",
      `<h3 class="feed-title">${esc(V.autoTitle)}${updated ? ` · mis à jour le ${fr(updated)}` : ""}</h3>` +
      each(shown, (e) => `<article class="entry auto">
        <p class="meta">${esc(fr(e.date))} · ${esc(e.source)}</p>
        <h3>${esc(e.title)}</h3>${e.summary ? `<p>${esc(e.summary)}</p>` : ""}
        <p class="links">${link(e.url, `<i class="${ICON.site}"></i> Lire l’article`, external(e.url))}</p>
      </article>`));
  } catch (err) { /* hors ligne ou ouvert en local : on garde les notes manuelles */ }
}

build();
network();
typeTerminal();
loadFeed();
