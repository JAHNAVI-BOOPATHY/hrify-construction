
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);

        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const message = formData.get("message");

        const subject = encodeURIComponent(
            "New Website Enquiry - HRIFY Constructions"
        );

        const body = encodeURIComponent(
            `Name: ${firstName} ${lastName}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n\n` +
            `Message:\n${message}`
        );

        window.location.href =
            `mailto:jayakrishnan@hrify.co.in?subject=${subject}&body=${body}`;
    });
}

/* HEADER SCROLL EFFECT */

document.addEventListener("DOMContentLoaded", function () {

    const header = document.querySelector(".header");

    if (!header) return;

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    // Check header when scrolling
    window.addEventListener("scroll", updateHeader);

    // Check header when page loads
    updateHeader();

});

document.addEventListener("DOMContentLoaded", function () {

    const header = document.querySelector(".header");
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    // Header scroll effect
    function updateHeader() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }
    }

    window.addEventListener("scroll", updateHeader);
    updateHeader();

    // Mobile navigation
    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", function () {
            navigation.classList.toggle("open");
        });
    }

});
