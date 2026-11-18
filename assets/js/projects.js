document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const nav = document.getElementById("navigation");
  const toggle = document.getElementById("menuToggle");

  const updateHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 60);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  const filters = document.querySelectorAll(".project-filter");
  const cards = document.querySelectorAll(".project-sector-card");
  const empty = document.querySelector(".project-empty");

  filters.forEach(button => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;
      filters.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      let visible = 0;
      cards.forEach(card => {
        const show = selected === "all" || card.dataset.category === selected;
        card.hidden = !show;
        if (show) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    });
  });

  const revealItems = document.querySelectorAll(".project-reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }
});
const projectContactForm = document.getElementById("projectContactForm");

if (projectContactForm) {
    projectContactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (projectContactForm.checkValidity()) {
            alert("Thank you for contacting HRIFY Constructions!");
            projectContactForm.reset();
        } else {
            projectContactForm.reportValidity();
        }
    });
}