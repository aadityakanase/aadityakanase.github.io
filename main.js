/* ═══════════════════════════════════════════════════════════
   main.js — Lightweight academic portfolio interactions
═══════════════════════════════════════════════════════════ */

// ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


// ── NAVBAR HIDE ON SCROLL DOWN / SHOW ON SCROLL UP ────────────
(function initNavbar() {
  const nav = document.getElementById("navbar");
  let lastY = 0;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > 80) {
      nav.style.transform = y > lastY ? "translateY(-100%)" : "translateY(0)";
    } else {
      nav.style.transform = "translateY(0)";
    }
    lastY = y;
  }, { passive: true });
})();


// ── ACTIVE NAV LINK HIGHLIGHT ──────────────────────────────────
(function initActiveLinks() {
  const sections = document.querySelectorAll("section[id]");
  const links    = document.querySelectorAll(".nav-links a, .mobile-menu a");

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(a => {
          // exp-pub section maps to the Experience nav link
          const href = a.getAttribute("href");
          a.classList.toggle("active", href === `#${id}`);
        });
      }
    }
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));
})();


// ── MOBILE MENU ────────────────────────────────────────────────
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

function closeMobile() {
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("open");
}



