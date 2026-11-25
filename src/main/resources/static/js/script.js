/* ИНТРО */
document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add("loading");

    setTimeout(function() {
        const introScreen = document.getElementById("intro-screen");

        introScreen.style.opacity = '0';

        setTimeout(function() {
            introScreen.style.display = 'none';
            document.body.classList.remove("loading");
        }, 600);

    }, 4000);
});

/* --- Функция за показване/скриване на падащото меню в навигационната лента --- */
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById("dropdownContent");
    dropdown.classList.toggle("show");
}

window.addEventListener("click", function() {
    const dropdown = document.getElementById("dropdownContent");
    if (dropdown && dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
    }
});

/* --- Функционалност за Search бутона --- */
/* --- Конфигурация на страниците (лесно се допълва с нови) --- */
const sitePages = [
    {
        title: "Начало",
        url: "/",
        keywords: ["начало", "начлна страница", "запази час", "салон", "красота"]
    },
    {
        title: "Услуги и ценоразпис",
        url: "/general-services",
        keywords: ["услуги", "ценоразпис", "цени", "прайслист", "процедури"]
    },
    {
        title: "Екип / За нас",
        url: "/team",
        keywords: ["за нас", "екип", "специалисти", "история"]
    },
    {
        title: "Продукти",
        url: "/products",
        keywords: ["продукти", "козметика", "грижа", "магазин"]
    },
    {
        title: "Запазване на час",
        url: "/booking",
        keywords: ["запази час", "резервация", "час", "букинг"]
    },
    {
        title: "Обучения",
        url: "/trainings",
        keywords: ["обучения", "курсове", "академия", "сертификат"]
    },
    {
        title: "Често задавани въпроси (FAQs)",
        url: "/faqs",
        keywords: ["въпроси", "faq", "често задавани", "информация"]
    },
    {
        title: "Помощ",
        url: "/help",
        keywords: ["помощ", "контакти", "съдействие", "поддръжка"]
    },
    {
        title: "Поверителност",
        url: "/privacy-policy",
        keywords: ["поверителност", "лични данни", "политика", "gdpr"]
    },
    {
        title: "Вход",
        url: "/login",
        keywords: ["вход", "влез", "профил", "акаунт"]
    },
    {
        title: "Регистрация",
        url: "/register",
        keywords: ["регистрация", "нов профил", "създай акаунт"]
    }
];

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const searchResults = document.querySelector(".search-results");

const searchableElements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, li"
);

function isHomePage() {
    const path = window.location.pathname;
    return path === "/" || path === "/index" || path.endsWith("/index.html");
}

function normalizePath(path) {
    if (!path || path === "/") return "/";
    return path.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
}

searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
        searchResults.innerHTML = "";
        searchResults.classList.remove("active");
        return;
    }

    const combinedResults = [];

    searchableElements.forEach((element) => {
        if (
            element.closest(".search-box-container") ||
            element.closest("header") ||
            element.closest("nav")
        ) {
            return;
        }

        const text = element.textContent.trim().replace(/\s+/g, " ");
        if (!text) return;

        if (text.toLowerCase().includes(query)) {
            if (!combinedResults.some((item) => item.element === element)) {
                combinedResults.push({
                    type: "local",
                    element: element,
                    title: text,
                    badge: isHomePage() ? "Началната страница" : "Текущата страница"
                });
            }
        }
    });

    combinedResults.sort((a, b) => {
        const aIsHeading = /^H[1-6]$/.test(a.element.tagName) ? 0 : 1;
        const bIsHeading = /^H[1-6]$/.test(b.element.tagName) ? 0 : 1;
        return aIsHeading - bIsHeading;
    });

    const currentNormalizedPath = normalizePath(window.location.pathname);

    sitePages.forEach((page) => {
        const pageCleanPath = normalizePath(page.url.split("#")[0]);
        const isSamePage = pageCleanPath === currentNormalizedPath;

        const matchesTitle = page.title.toLowerCase().includes(query);
        const matchesKeywords = page.keywords.some((kw) =>
            kw.toLowerCase().includes(query)
        );

        if (matchesTitle || matchesKeywords) {
            if (isSamePage && !page.url.includes("#") && combinedResults.length > 0) {
                return;
            }

            combinedResults.push({
                type: "page",
                url: page.url,
                title: page.title,
                badge: isSamePage ? "Началната страница" : "Страница"
            });
        }
    });

    const limitedResults = combinedResults.slice(0, 6);

    if (limitedResults.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                Няма намерени резултати
            </div>
        `;
        searchResults.classList.add("active");
        return;
    }

    searchResults.innerHTML = "";

    limitedResults.forEach((item) => {
        const resultElement = document.createElement("div");
        resultElement.classList.add("search-result");

        const shortTitle =
            item.title.length > 75 ? item.title.slice(0, 75) + "…" : item.title;

        resultElement.innerHTML = `
            <div class="search-result-title">
                ${highlightText(shortTitle, query)}
            </div>
            <small class="search-result-badge">${item.badge}</small>
        `;

        resultElement.addEventListener("click", function () {
            searchResults.classList.remove("active");
            searchInput.value = "";

            if (item.type === "page") {
                window.location.href = item.url;
                return;
            }

            item.element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            item.element.classList.add("search-highlight");
            setTimeout(() => {
                item.element.classList.remove("search-highlight");
            }, 2000);
        });

        searchResults.appendChild(resultElement);
    });

    searchResults.classList.add("active");
});

function highlightText(text, query) {
    const regex = new RegExp("(" + escapeRegExp(query) + ")", "gi");
    return text.replace(regex, "<strong>$1</strong>");
}

function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const firstResult = searchResults.querySelector(".search-result");
    if (firstResult) {
        firstResult.click();
    }
});

document.addEventListener("click", function (event) {
    if (
        !searchResults.contains(event.target) &&
        !searchForm.contains(event.target)
    ) {
        searchResults.classList.remove("active");
    }
});

/* --- Функционалност телефон ---*/
const phoneLinks = document.querySelectorAll(".phone-link");

function isMobileDevice() {
    return (
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ) || window.matchMedia("(max-width: 768px)").matches
    );
}

phoneLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
        if (isMobileDevice()) {
            return;
        }

        event.preventDefault();

        const phoneNumber =
            link.getAttribute("data-phone") || link.textContent.trim();

        const toast = link.parentElement.querySelector(".copy-toast");

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(phoneNumber)
                .then(() => showCopyMessage(toast, "Копирано!"))
                .catch(() => fallbackCopy(phoneNumber, toast));
        } else {
            fallbackCopy(phoneNumber, toast);
        }
    });
});

function fallbackCopy(text, toast) {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showCopyMessage(toast, "Копирано!");
}

function showCopyMessage(toast, message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.textContent = "";
        toast.classList.remove("visible");
    }, 2000);
}

/* --- Функционалност форма за въпроси --- */
document.addEventListener("DOMContentLoaded", function () {
    const qaForm = document.querySelector(".qa-form");
    const toastNotification = document.getElementById("toast-notification");
    const fileInput = document.getElementById("image-upload");
    const fileSuccessMessage = document.getElementById("file-success-message");

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const ALLOWED_MIME_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];
    const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    let isSubmitting = false;

    function validateImageFile(file) {
        if (!file) {
            return { valid: true };
        }

        const fileName = file.name.toLowerCase();
        const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
        const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());

        if (!hasValidExtension || !hasValidMime) {
            return {
                valid: false,
                error: "Позволени са само снимки (JPG, JPEG, PNG, WEBP, GIF)."
            };
        }

        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: "Снимката не трябва да надвишава 5 MB."
            };
        }

        return { valid: true };
    }

    function resetFileStatus() {
        if (fileInput) {
            fileInput.value = "";
        }
        if (fileSuccessMessage) {
            fileSuccessMessage.textContent = "";
            fileSuccessMessage.style.color = "#4CAF50";
        }
    }

    if (fileInput && fileSuccessMessage) {
        fileInput.addEventListener("change", function () {
            const file = fileInput.files && fileInput.files[0];
            if (!file) {
                resetFileStatus();
                return;
            }

            const check = validateImageFile(file);
            if (!check.valid) {
                alert(check.error);
                resetFileStatus();
                return;
            }

            fileSuccessMessage.style.color = "#4CAF50";
            fileSuccessMessage.textContent = "Избран файл: " + file.name;
        });
    }

    if (qaForm) {
        qaForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (isSubmitting) return;

            const selectedFile = fileInput && fileInput.files ? fileInput.files[0] : null;
            const check = validateImageFile(selectedFile);

            if (!check.valid) {
                alert(check.error);
                resetFileStatus();
                return;
            }

            const submitBtn = qaForm.querySelector(".btn-submit-qa");
            const originalBtnText = submitBtn ? submitBtn.textContent : "";

            isSubmitting = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "ИЗПРАЩАНЕ...";
            }

            const formData = new FormData(qaForm);

            fetch(qaForm.action, {
                method: "POST",
                body: formData
            })
            .then(async response => {
                if (response.ok) {
                    if (toastNotification) {
                        toastNotification.classList.add("show");
                        setTimeout(() => {
                            toastNotification.classList.remove("show");
                        }, 4000);
                    }

                    qaForm.reset();
                    resetFileStatus();
                } else {
                    const errorMessage = await response.text();
                    alert(errorMessage || "Възникна грешка при изпращането на съобщението.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Грешка при връзката със сървъра.");
            })
            .finally(() => {
                isSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText || "ИЗПРАТИ";
                }
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const aboutItems = document.querySelectorAll("#about .about-image, #about .about-text");
    if (!aboutItems.length) return;

    const aboutObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                } else {
                    entry.target.classList.remove("is-visible");
                }
            });
        },
        {
            threshold: 0.20,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    aboutItems.forEach((item) => aboutObserver.observe(item));
});