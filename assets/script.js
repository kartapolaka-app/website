// Language switching functionality
document.addEventListener("DOMContentLoaded", function () {
    const langButtons = document.querySelectorAll(".lang-btn");
    const langSections = document.querySelectorAll(".lang-section");
    const navLinks = document.querySelectorAll(".nav-link");

    function setLanguage(lang) {
        // Update active button
        langButtons.forEach((btn) => {
            btn.classList.remove("active");
            if (btn.dataset.lang === lang) {
                btn.classList.add("active");
            }
        });

        // Update visible section
        langSections.forEach((section) => {
            section.classList.remove("active");
            if (section.dataset.lang === lang) {
                section.classList.add("active");
            }
        });

        // Update navigation link text
        navLinks.forEach((link) => {
            const text = link.dataset[lang] || link.textContent;
            link.textContent = text;
        });

        // Save preference to localStorage
        localStorage.setItem("preferredLanguage", lang);
        document.documentElement.lang = lang;
    }

    // Event listeners for language buttons
    langButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            setLanguage(btn.dataset.lang);
        });
    });

    // Initialize with saved preference or detect browser language
    function initializeLanguage() {
        const saved = localStorage.getItem("preferredLanguage");
        if (saved) {
            setLanguage(saved);
        } else {
            const browserLang = navigator.language.split("-")[0];
            if (["en", "pl", "ru"].includes(browserLang)) {
                setLanguage(browserLang);
            } else {
                setLanguage("en");
            }
        }
    }

    initializeLanguage();

    // Smooth scroll behavior for navigation links
    document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            // Check if this is a local anchor on current page
            if (href.startsWith("#")) {
                e.preventDefault();
                const activeSection = document.querySelector(
                    ".lang-section.active",
                );
                const target = activeSection
                    ? activeSection.querySelector(href)
                    : document.querySelector(href);
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }, 0);
                }
            }
            // Check if it's a link to another page with an anchor
            else if (href.includes("#")) {
                const [page, anchor] = href.split("#");
                const currentPage =
                    window.location.pathname.split("/").pop() || "index.html";
                const currentPageName =
                    currentPage === "" ? "index.html" : currentPage;

                // Check if linking to index page
                const isLinkingToIndex =
                    page.includes("index.html") ||
                    page === "" ||
                    page === "." ||
                    page === "../index.html";
                const isCurrentIndex =
                    currentPageName === "index.html" || currentPageName === "";

                // If linking to index page from index page, prevent default and scroll
                if (isLinkingToIndex && isCurrentIndex) {
                    e.preventDefault();
                    const activeSection = document.querySelector(
                        ".lang-section.active",
                    );
                    const target = activeSection
                        ? activeSection.querySelector("#" + anchor)
                        : document.querySelector("#" + anchor);
                    if (target) {
                        setTimeout(() => {
                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }, 0);
                    }
                }
                // Otherwise let the default link behavior handle it
            }
        });
    });

    // Add animation on scroll for feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = "slideInUp 0.6s ease forwards";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".feature-card").forEach((card) => {
        card.style.opacity = "0";
        observer.observe(card);
    });
});
