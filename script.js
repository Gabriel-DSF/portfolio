const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Réseau de nœuds animé (hero) ---------- */
(function network() {
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
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 1,
    }));
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const D = 140, M = 190;
    for (const n of nodes) {
      if (!reduceMotion) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < D) {
          ctx.strokeStyle = `rgba(${LINK}, ${(1 - d / D) * 0.32})`;
          ctx.lineWidth = 1;
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

  function loop() {
    if (running) draw();
    requestAnimationFrame(loop);
  }

  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  window.addEventListener("resize", resize);
  new IntersectionObserver(([e]) => { running = e.isIntersecting; }).observe(hero);

  resize();
  if (!reduceMotion) loop();
})();

/* ---------- Terminal : saisie des commandes (une seule fois) ---------- */
(async function typeTerminal() {
  const body = document.querySelector(".hero .term-body");
  if (!body || reduceMotion) return;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rows = [...body.children];
  const cmds = rows.map((row) => row.querySelector(".cmd"));
  const texts = cmds.map((c) => c && c.textContent);

  rows.forEach((row, i) => { row.classList.add("pending"); if (cmds[i]) cmds[i].textContent = ""; });
  await wait(900);

  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.remove("pending");
    if (cmds[i]) {
      cmds[i].classList.add("typing");
      for (const ch of texts[i]) { cmds[i].textContent += ch; await wait(55); }
      cmds[i].classList.remove("typing");
      await wait(250);
    } else {
      await wait(350);
    }
  }
})();
