
const header = document.getElementById("header");
const navigation = document.getElementById("navigation");
const menuToggle = document.getElementById("menuToggle");

// Header transition on scroll
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 60);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Mobile navigation
menuToggle.addEventListener("click", () => {
  navigation.classList.toggle("open");
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
  });
});

// Hero slider
const slides = document.querySelectorAll(".hero-slide");
const slideCount = document.getElementById("slideCount");
let currentSlide = 0;
let sliderTimer;

function showSlide(index) {
  slides[currentSlide].classList.remove("active");

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add("active");

  slideCount.textContent =
    `0${currentSlide + 1} / 0${slides.length}`;
}

function startSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 6000);
}

document.getElementById("nextSlide").addEventListener("click", () => {
  showSlide(currentSlide + 1);
  startSlider();
});

document.getElementById("prevSlide").addEventListener("click", () => {
  showSlide(currentSlide - 1);
  startSlider();
});

startSlider();

/* =================================
   SERVICES CAROUSEL
================================= */

const servicesCarousel =
  document.getElementById("servicesCarousel");

const servicesTrack =
  document.getElementById("servicesTrack");

const servicesPrev =
  document.getElementById("servicesPrev");

const servicesNext =
  document.getElementById("servicesNext");

if (servicesCarousel && servicesTrack) {

  let position = 0;
  let startX = 0;
  let startPosition = 0;
  let isDragging = false;
  let moved = false;
  let maxPosition = 0;

  function getMaxPosition() {
    return Math.max(
      0,
      servicesTrack.scrollWidth - servicesCarousel.clientWidth
    );
  }

  function updateCarousel() {
    maxPosition = getMaxPosition();

    position = Math.max(
      0,
      Math.min(position, maxPosition)
    );

    servicesTrack.style.transform =
      `translate3d(-${position}px, 0, 0)`;

    servicesPrev.disabled = position <= 1;
    servicesNext.disabled = position >= maxPosition - 1;
  }

  function moveCarousel(direction) {
    const card = servicesTrack.querySelector(".service-card");
    if (!card) return;

    const gap = parseFloat(
      getComputedStyle(servicesTrack).gap
    ) || 0;

    const step = card.getBoundingClientRect().width + gap;

    position += direction * step;
    updateCarousel();
  }

  servicesNext.addEventListener("click", () => {
    moveCarousel(1);
  });

  servicesPrev.addEventListener("click", () => {
    moveCarousel(-1);
  });

  // Mouse and touch drag
  servicesCarousel.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDragging = true;
    moved = false;
    startX = e.clientX;
    startPosition = position;

    servicesCarousel.classList.add("dragging");
    servicesCarousel.setPointerCapture(e.pointerId);

    servicesTrack.style.transition = "none";
  });

  servicesCarousel.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const difference = e.clientX - startX;

    if (Math.abs(difference) > 5) {
      moved = true;
    }

    position = Math.max(
      0,
      Math.min(startPosition - difference, getMaxPosition())
    );

    servicesTrack.style.transform =
      `translate3d(-${position}px, 0, 0)`;
  });

  function endDrag() {
    if (!isDragging) return;

    isDragging = false;
    servicesCarousel.classList.remove("dragging");

    servicesTrack.style.transition = "";
    updateCarousel();

    if (moved) {
      servicesCarousel.dataset.dragged = "true";

      setTimeout(() => {
        servicesCarousel.dataset.dragged = "false";
      }, 100);
    }
  }

  servicesCarousel.addEventListener("pointerup", endDrag);
  servicesCarousel.addEventListener("pointercancel", endDrag);

  // Prevent accidental link opening after dragging
  servicesCarousel.querySelectorAll(".service-image").forEach(link => {
    link.addEventListener("click", (e) => {
      if (servicesCarousel.dataset.dragged === "true") {
        e.preventDefault();
      }
    });
  });

  window.addEventListener("resize", updateCarousel);

  updateCarousel();
}

/* =========================================
   DIRECTOR PROFILE SCROLL ANIMATION
========================================= */

const directorSection =
  document.querySelector(".director-section");

if (directorSection) {

  const directorObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          directorSection.classList.add("is-visible");

          // Play the reveal only once
          directorObserver.unobserve(directorSection);
        }

      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  directorObserver.observe(directorSection);
}

/* ==========================================
   HRIFY - OUR PROMISES
   DOWN: 01 -> 02 -> 03 -> 04 -> 05 -> NEXT SECTION
   UP:   PREVIOUS SECTION <- 01 <- 02 <- 03 <- 04 <- 05
========================================== */

(() => {
    const section = document.getElementById("promises");
    const track = document.getElementById("promisesTrack");
    const viewport = document.getElementById("promisesViewport");

    const nextButton = document.getElementById("promiseNext");
    const prevButton = document.getElementById("promisePrev");

    if (!section || !track || !viewport) return;

    const slides = [...track.querySelectorAll(".promise-slide")];
    const totalSlides = slides.length;

    if (!totalSlides) return;

    let currentIndex = 0;
    let isAnimating = false;
    let wheelLocked = false;
    let releaseTimer;

    const ANIMATION_DURATION = 850;
    const WHEEL_DELAY = 950;

    // Update slide position
    function updateSlides(animate = true) {
        track.style.transition = animate
            ? `transform ${ANIMATION_DURATION}ms cubic-bezier(.77,0,.175,1)`
            : "none";

        track.style.transform =
            `translate3d(-${currentIndex * 100}%, 0, 0)`;

        slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === currentIndex);
        });

        if (prevButton) {
            prevButton.disabled = currentIndex === 0;
        }

        if (nextButton) {
            nextButton.disabled = currentIndex === totalSlides - 1;
        }
    }

    // Move to another slide
    function moveSlide(direction) {
        if (isAnimating) return;

        const target = currentIndex + direction;

        if (target < 0 || target >= totalSlides) return;

        currentIndex = target;
        isAnimating = true;

        updateSlides(true);
    }

    // Animation completion
    track.addEventListener("transitionend", (event) => {
        if (event.propertyName === "transform") {
            isAnimating = false;
        }
    });

    // Mouse wheel interaction
    section.addEventListener("wheel", (event) => {

        if (Math.abs(event.deltaY) < 10) return;

        const scrollingDown = event.deltaY > 0;
        const scrollingUp = event.deltaY < 0;

        // Slide 5 + scroll DOWN:
        // Exit to the next page section.
        if (scrollingDown && currentIndex === totalSlides - 1) {
            return;
        }

        // Slide 1 + scroll UP:
        // Exit to the previous page section.
        if (scrollingUp && currentIndex === 0) {
            return;
        }

        // Prevent normal scrolling while changing slides.
        event.preventDefault();

        if (wheelLocked || isAnimating) return;

        wheelLocked = true;

        // DOWN = forward
        // UP = backward
        moveSlide(scrollingDown ? 1 : -1);

        clearTimeout(releaseTimer);

        releaseTimer = setTimeout(() => {
            wheelLocked = false;
        }, WHEEL_DELAY);

    }, { passive: false });

    // Next arrow
    nextButton?.addEventListener("click", () => {
        moveSlide(1);
    });

    // Previous arrow
    prevButton?.addEventListener("click", () => {
        moveSlide(-1);
    });

    // Touch swipe
    let touchStartY = 0;

    viewport.addEventListener("touchstart", (event) => {
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    viewport.addEventListener("touchend", (event) => {

        const difference =
            touchStartY - event.changedTouches[0].clientY;

        if (Math.abs(difference) < 50) return;

        // Swipe up = previous
        // Swipe down = next
        moveSlide(difference > 0 ? -1 : 1);

    }, { passive: true });

    // Initial setup
    updateSlides(false);

    window.addEventListener("resize", () => {
        updateSlides(false);
    });

})();

document.addEventListener("DOMContentLoaded", () => {

    const section = document.getElementById("promises");
    const wrapper = document.querySelector(".promises-scroll-wrapper");
    const track = document.getElementById("promisesTrack");
    const prevButton = document.getElementById("promisePrev");
    const nextButton = document.getElementById("promiseNext");

    if (!section || !wrapper || !track) return;

    const slides = [...track.querySelectorAll(".promise-slide")];
    const total = slides.length;

    if (!total) return;

    let index = 0;
    let locked = false;

    const delay = 900;

    // Five slides need five viewport-height scroll stages.
    function setWrapperHeight() {
        wrapper.style.height = `${total * 100}vh`;
    }

    function showSlide(animate = true) {
        track.style.transition = animate
            ? "transform 850ms cubic-bezier(.77,0,.175,1)"
            : "none";

        track.style.transform =
            `translate3d(-${index * 100}%, 0, 0)`;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        if (prevButton) prevButton.disabled = index === 0;
        if (nextButton) nextButton.disabled = index === total - 1;
    }

    function changeSlide(direction) {
        const nextIndex = index + direction;

        if (nextIndex < 0 || nextIndex >= total) return;

        index = nextIndex;
        showSlide(true);
    }

    function isSectionPinned() {
        const rect = section.getBoundingClientRect();
        return rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
    }

    function handleWheel(event) {
        if (!isSectionPinned()) return;

        const down = event.deltaY > 0;
        const up = event.deltaY < 0;

        if (!down && !up) return;

        // Keep the page pinned until the correct boundary is reached.
        if (down && index < total - 1) {
            event.preventDefault();

            if (!locked) {
                locked = true;
                changeSlide(1);
                setTimeout(() => locked = false, delay);
            }

            return;
        }

        if (up && index > 0) {
            event.preventDefault();

            if (!locked) {
                locked = true;
                changeSlide(-1);
                setTimeout(() => locked = false, delay);
            }

            return;
        }

        // At slide 5 scrolling down or slide 1 scrolling up,
        // allow normal page scrolling to release the pinned section.
    }

    window.addEventListener("wheel", handleWheel, { passive: false });

    nextButton?.addEventListener("click", () => changeSlide(1));
    prevButton?.addEventListener("click", () => changeSlide(-1));

    setWrapperHeight();
    showSlide(false);

    window.addEventListener("resize", setWrapperHeight);

});

document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");

    if (!contactForm || !contactStatus) return;

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        contactStatus.textContent =
            "Thank you! Your enquiry has been received.";

        contactStatus.style.color = "#16804a";

        contactForm.reset();
    });

});

/* =====================================
   HRIFY SCROLL REVEAL
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(
        ".services-section, .director-section, .promises-section, .contact-section, .site-footer"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

});

/* Smooth navigation links */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(event) {

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});
