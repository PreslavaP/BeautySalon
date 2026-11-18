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
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const searchResults = document.querySelector(".search-results");

const searchableElements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, a, li"
);

searchInput.addEventListener("input", function () {

    const query = searchInput.value
        .toLowerCase()
        .trim();

    if (!query) {
        searchResults.innerHTML = "";
        searchResults.classList.remove("active");
        return;
    }

    const results = [];

    searchableElements.forEach(element => {

        if (element.closest(".search-box-container")) {
            return;
        }

        const text = element.textContent
            .trim()
            .replace(/\s+/g, " ");

        const lowerText = text.toLowerCase();

        if (lowerText.includes(query)) {

            if (!results.some(result => result.element === element)) {

                 results.push({
                    element: element,
                    text: text
                 });
            }
        }
    });

    const limitedResults = results.slice(0, 6);

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

    limitedResults.forEach(result => {

        const resultElement = document.createElement("div");

        resultElement.classList.add("search-result");

        resultElement.innerHTML = `
            <div class="search-result-title">
                ${highlightText(result.text, query)}
            </div>
        `;

        resultElement.addEventListener("click", function () {

            result.element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            result.element.classList.add("search-highlight");

            setTimeout(() => {
               result.element.classList.remove("search-highlight");
            }, 2000);

            searchResults.classList.remove("active");

            searchInput.value = "";
        });

        searchResults.appendChild(resultElement);
    });

    searchResults.classList.add("active");
});

function highlightText(text, query) {

   const regex = new RegExp(
       "(" + escapeRegExp(query) + ")",
       "gi"
   );

   return text.replace(
       regex,
       "<strong>$1</strong>"
   );
}

function escapeRegExp(text) {

    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const firstResult =
        searchResults.querySelector(".search-result");

    if (firstResult) {
        firstResult.click();
    }
});

document.addEventListener("click", function(event) {

    if (!searchResults.contains(event.target) &&
        !searchForm.contains(event.target)) {
        searchResults.classList.remove("active");
    }
});

/* --- Функционалност форма за въпроси --- */
document.addEventListener("DOMContentLoaded", function() {
    const qaForm = document.querySelector('.qa-form');
    const toastNotification = document.getElementById('toast-notification');
    const fileInput = document.getElementById('image-upload');
    const fileSuccessMessage = document.getElementById('file-success-message');

    if (fileInput && fileSuccessMessage) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files && fileInput.files[0]) {
                fileSuccessMessage.textContent = "Избран файл: " + fileInput.files[0].name;
            } else {
                fileSuccessMessage.textContent = "";
            }
        });
    }

    if (qaForm) {
        qaForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(qaForm);

            fetch(qaForm.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    if (toastNotification) {
                        toastNotification.classList.add('show');
                        setTimeout(() => {
                            toastNotification.classList.remove('show');
                        }, 4000);
                    }

                    qaForm.reset();
                    if (fileSuccessMessage) {
                        fileSuccessMessage.textContent = '';
                    }
                } else {
                    alert('Вникна грешка при изпращането на съобщението.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Грешка при връзката със сървъра.');
            });
        });
    }
});