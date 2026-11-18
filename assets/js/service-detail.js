document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const nav = document.getElementById("navigation");
  const toggle = document.getElementById("menuToggle");
  const updateHeader = () => header && header.classList.toggle("scrolled", window.scrollY > 60);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }
  const items = document.querySelectorAll(".page-reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add("is-visible"));
});
