function disableScrollRestoration() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}

function revealIntersectingSections(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("revealed");
    observer.unobserve(entry.target);
  });
}

function initSectionReveal() {
  const sections = document.querySelectorAll(".section-reveal");
  const observer = new IntersectionObserver(revealIntersectingSections, { threshold: 0.15 });
  sections.forEach((section) => observer.observe(section));
}

function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateShadow = () => header.classList.toggle("is-scrolled", window.scrollY > 0);
  updateShadow();
  window.addEventListener("scroll", updateShadow, { passive: true });
}

function initNavToggle() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName !== "A") return;
    navLinks.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
}

disableScrollRestoration();

document.addEventListener("DOMContentLoaded", () => {
  initSectionReveal();
  initHeaderShadow();
  initNavToggle();
});
