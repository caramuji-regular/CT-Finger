const elementsToReveal = document.querySelectorAll(
    "main > section, .card, .schedule-card, .contact-card, footer > .redes-sociais"
);

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#menu-principal");

if (menuToggle && mainNav) {
    const closeMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        mainNav.classList.toggle("is-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            closeMenu();
            menuToggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 560) {
            closeMenu();
        }
    });
}

const galleryLightbox = document.querySelector("#gallery-lightbox");
const galleryLightboxImage = galleryLightbox && galleryLightbox.querySelector("img");

if (galleryLightbox && galleryLightboxImage) {
    const closeButton = galleryLightbox.querySelector(".gallery-lightbox__close");

    document.querySelectorAll(".gallery-item").forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            const thumbnail = item.querySelector("img");

            if (!thumbnail) {
                return;
            }

            galleryLightboxImage.src = item.href;
            galleryLightboxImage.alt = thumbnail.alt;
            galleryLightbox.showModal();
        });
    });

    closeButton.addEventListener("click", () => {
        galleryLightbox.close();
    });

    galleryLightbox.addEventListener("click", (event) => {
        if (event.target === galleryLightbox) {
            galleryLightbox.close();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && galleryLightbox.open) {
            event.preventDefault();
            galleryLightbox.close();
        }
    });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    elementsToReveal.forEach((element) => {
        element.classList.add("scroll-reveal");
        revealObserver.observe(element);
    });
}