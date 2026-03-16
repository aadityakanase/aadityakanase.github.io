/* ═══════════════════════════════════════════════════════════════
   main.js — Portfolio interactions & PCB canvas animation
═══════════════════════════════════════════════════════════════ */

// ── PCB BACKGROUND CANVAS ──────────────────────────────────────
(function initPCB() {
  const canvas = document.getElementById("pcb-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const GREEN = "rgba(77, 255, 145,";
  const GRID = 40;

  let W,
    H,
    traces = [],
    vias = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildLayout();
  }

  function buildLayout() {
    traces = [];
    vias = [];

    const cols = Math.ceil(W / GRID) + 1;
    const rows = Math.ceil(H / GRID) + 1;

    // Horizontal traces — sparse, randomized
    for (let r = 0; r < rows; r++) {
      if (Math.random() < 0.35) continue;
      const y = r * GRID;
      const x0 = Math.floor(Math.random() * cols * 0.4) * GRID;
      const len = Math.floor(2 + Math.random() * 8) * GRID;
      const x1 = Math.min(x0 + len, W);
      const op = 0.06 + Math.random() * 0.12;
      traces.push({ x0, y, x1, y1: y, op });

      // Maybe a 90° turn going down
      if (Math.random() < 0.4) {
        const tx = x0 + Math.floor(Math.random() * ((x1 - x0) / GRID)) * GRID;
        const tlen = Math.floor(1 + Math.random() * 4) * GRID;
        traces.push({ x0: tx, y: y, x1: tx, y1: Math.min(y + tlen, H), op });
        vias.push({ x: tx, y, op });
      }
    }

    // A few vertical backbone traces
    for (let c = 0; c < cols; c++) {
      if (Math.random() < 0.7) continue;
      const x = c * GRID;
      const y0 = Math.floor(Math.random() * rows * 0.3) * GRID;
      const len = Math.floor(3 + Math.random() * 8) * GRID;
      const y1 = Math.min(y0 + len, H);
      traces.push({ x0: x, y: y0, x1: x, y1, op: 0.05 + Math.random() * 0.1 });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Subtle grid dots
    ctx.fillStyle = `${GREEN} 0.06)`;
    for (let x = 0; x <= W; x += GRID) {
      for (let y = 0; y <= H; y += GRID) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Traces
    for (const t of traces) {
      ctx.strokeStyle = `${GREEN} ${t.op})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(t.x0, t.y);
      ctx.lineTo(t.x1, t.y1);
      ctx.stroke();
    }

    // Vias (pads at junctions)
    for (const v of vias) {
      ctx.strokeStyle = `${GREEN} ${v.op * 1.8})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(v.x, v.y, 3.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(v.x, v.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `${GREEN} ${v.op * 2})`;
      ctx.fill();
    }
  }

  window.addEventListener("resize", () => {
    resize();
    draw();
  });
  resize();
  draw();
})();

// ── SCROLL REVEAL ──────────────────────────────────────────────
(function initReveal() {
  const items = document.querySelectorAll(
    ".project-card, .timeline-item, .skill-group, .edu-card, .contact-card",
  );
  items.forEach((el) => el.classList.add("reveal"));

  const fills = document.querySelectorAll(".skill-fill");

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          if (e.target.classList.contains("skill-fill")) {
            e.target.style.animationPlayState = "running";
          }
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  items.forEach((el) => io.observe(el));
  fills.forEach((el) => io.observe(el));
})();

// ── NAVBAR SCROLL BEHAVIOR ──────────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById("navbar");
  let lastY = 0;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > 80) {
        nav.style.transform = y > lastY ? "translateY(-100%)" : "translateY(0)";
      } else {
        nav.style.transform = "translateY(0)";
      }
      lastY = y;
    },
    { passive: true },
  );

  // Active link highlight
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a, .mobile-menu a");

  const sio = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const id = e.target.id;
          links.forEach((a) => {
            a.style.color =
              a.getAttribute("href") === `#${id}` ? "var(--green)" : "";
          });
        }
      }
    },
    { threshold: 0.4 },
  );

  sections.forEach((s) => sio.observe(s));
})();

// Navbar transition
document.getElementById("navbar").style.transition = "transform 0.3s ease";

// ── MOBILE MENU ─────────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

function closeMobile() {
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("open");
}

// ── BOOT SCREEN → MAIN ──────────────────────────────────────────
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("boot-screen").style.display = "none";
  }, 3800);
});

// ── SMOOTH SECTION STAGGER ─────────────────────────────────────
(function staggerChildren() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const children = e.target.querySelectorAll(".reveal");
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 80}ms`;
            child.classList.add("visible");
          });
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.05 },
  );

  document
    .querySelectorAll(".projects-grid, .timeline, .skills-grid, .contact-links")
    .forEach((el) => io.observe(el));
})();

// ── CURSOR GLOW EFFECT (subtle) ─────────────────────────────────
(function cursorGlow() {
  const glow = document.createElement("div");
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(77,255,145,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener(
    "mousemove",
    (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    },
    { passive: true },
  );
})();
