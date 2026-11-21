/* CT FINGER TEAM — script.js
   Cada recurso é uma função independente (init...). Se um elemento não existir
   na página, a função simplesmente não faz nada. */

const WHATSAPP = "5554993515225";
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MOBILE_MENU_QUERY = window.matchMedia("(max-width: 980px)");

/* Botões com data-wa abrem o WhatsApp já com a mensagem pronta */
function initWhatsApp() {
    document.querySelectorAll("[data-wa]").forEach((link) => {
        link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(link.dataset.wa)}`;
    });
}

/* Header ganha fundo ao rolar a página */
function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
}

/* Menu responsivo (celular e tablet) */
function initMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#menu-principal");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        nav.classList.toggle("is-open", open);
    };
    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

    toggle.addEventListener("click", () => setOpen(!isOpen()));
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("click", (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen()) { setOpen(false); toggle.focus(); }
    });
    MOBILE_MENU_QUERY.addEventListener("change", () => setOpen(false));
}

/* Destaca no menu a seção que está na tela */
function initScrollSpy() {
    const links = [...document.querySelectorAll('#menu-principal a[href^="#"]:not(.btn)')];
    const sections = links.map((a) => document.querySelector(a.hash)).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((a) => {
                if (a.hash === `#${entry.target.id}`) a.setAttribute("aria-current", "true");
                else a.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach((section) => observer.observe(section));
}

/* Galeria: foto ampliada com botões anterior/próxima e teclado */
function initLightbox() {
    const dialog = document.querySelector("#lightbox");
    const items = [...document.querySelectorAll(".gallery__item")];
    if (!dialog || !items.length) return;

    const image = dialog.querySelector("img");
    let current = 0;

    const show = (index) => {
        current = (index + items.length) % items.length;
        const thumb = items[current].querySelector("img");
        image.src = items[current].href;
        image.alt = thumb ? thumb.alt : "";
    };

    items.forEach((item, index) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            show(index);
            dialog.showModal();
        });
    });

    dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());
    dialog.querySelector(".lightbox__prev").addEventListener("click", () => show(current - 1));
    dialog.querySelector(".lightbox__next").addEventListener("click", () => show(current + 1));
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") show(current - 1);
        if (e.key === "ArrowRight") show(current + 1);
    });
}

/* Hero: a foto aparece onde o mouse (ou o dedo) está; clicar numa palavra dá um "soco" */
function initHero() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    hero.addEventListener("pointermove", (e) => {
        const box = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${e.clientX - box.left}px`);
        hero.style.setProperty("--my", `${e.clientY - box.top}px`);
    });
    hero.querySelectorAll("h1 span").forEach((word) => {
        word.addEventListener("pointerdown", () => {
            word.classList.remove("hit");
            void word.offsetWidth; // reinicia a animação
            word.classList.add("hit");
        });
        word.addEventListener("animationend", () => word.classList.remove("hit"));
    });
}

/* Modalidades: a faixa sob o mouse/foco/toque se expande */
function initSlabs() {
    const cards = [...document.querySelectorAll("#modalidades .card")];
    if (!cards.length) return;
    const activate = (card) => cards.forEach((c) => c.classList.toggle("is-active", c === card));
    cards.forEach((card) => {
        card.tabIndex = 0;
        ["pointerenter", "focus", "click"].forEach((type) => card.addEventListener(type, () => activate(card)));
    });
    activate(cards[0]);
}

/* Horários: em dias úteis, marca a aula que está acontecendo ou a próxima do dia */
function initLiveSchedule() {
    const rows = [...document.querySelectorAll(".schedule li[data-start]")];
    const now = new Date();
    if (!rows.length || now.getDay() === 0 || now.getDay() === 6) return;
    const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
    const cur = now.getHours() * 60 + now.getMinutes();
    const live = rows.find((r) => cur >= toMin(r.dataset.start) && cur < toMin(r.dataset.end));
    const next = rows.find((r) => toMin(r.dataset.start) > cur);
    const target = live || next;
    if (!target) return;
    const badge = document.createElement("span");
    badge.className = "schedule__live";
    badge.textContent = live ? "Acontecendo agora" : "Próxima aula hoje";
    target.append(badge);
}

/* Botões principais seguem levemente o mouse (efeito "magnético") */
function initMagnet() {
    if (REDUCED_MOTION || !window.matchMedia("(hover: hover)").matches) return;
    document.querySelectorAll(".btn--primary, .btn--dark").forEach((btn) => {
        btn.addEventListener("pointermove", (e) => {
            const box = btn.getBoundingClientRect();
            btn.style.setProperty("--tx", `${(e.clientX - box.left - box.width / 2) * 0.2}px`);
            btn.style.setProperty("--ty", `${(e.clientY - box.top - box.height / 2) * 0.3}px`);
        });
        btn.addEventListener("pointerleave", () => {
            btn.style.removeProperty("--tx");
            btn.style.removeProperty("--ty");
        });
    });
}

/* Galeria: cada foto flutua em ritmo diferente enquanto você rola */
function initParallax() {
    const gallery = document.querySelector(".gallery");
    const items = [...document.querySelectorAll(".gallery__item")];
    if (REDUCED_MOTION || !gallery || !items.length) return;
    let queued = false;
    const update = () => {
        queued = false;
        const top = gallery.getBoundingClientRect().top;
        items.forEach((el, i) => {
            const centerY = top + el.offsetTop + el.offsetHeight / 2;
            el.style.setProperty("--py", `${(centerY - window.innerHeight / 2) * (i % 2 ? -0.07 : 0.07)}px`);
        });
    };
    window.addEventListener("scroll", () => {
        if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
}

/* Foto de professor ausente: some a imagem quebrada e fica só o monograma */
function initTeacherPhotos() {
    document.querySelectorAll(".teacher__photo img").forEach((img) => {
        const drop = () => img.remove();
        if (img.complete && img.naturalWidth === 0) drop();
        else img.addEventListener("error", drop);
    });
}

initWhatsApp();
initHeader();
initTeacherPhotos();
initHero();
initSlabs();
initLiveSchedule();
initMagnet();
initParallax();
initMenu();
initScrollSpy();
initLightbox();
