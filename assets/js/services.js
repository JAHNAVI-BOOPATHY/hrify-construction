// Services page interactions. Kept separate from main.js because this page
// does not contain the homepage hero slider or homepage-only carousels.
const header = document.getElementById('header');
const navigation = document.getElementById('navigation');
const menuToggle = document.getElementById('menuToggle');

function updateServicesHeader() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateServicesHeader, { passive: true });
updateServicesHeader();

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? '×' : '☰';
  });
  navigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    });
  });
}

const revealItems = document.querySelectorAll('.page-reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}
