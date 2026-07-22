if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".section-reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  reveals.forEach((section) => observer.observe(section));

  const header = document.querySelector(".site-header");
  if (header) {
    const updateHeaderShadow = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 0);
    };
    updateHeaderShadow();
    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        navLinks.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
});
