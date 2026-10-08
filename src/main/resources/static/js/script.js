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
//Kачена снимка
const imageUploadInput = document.getElementById('image-upload');
const fileSuccessMessage = document.getElementById('file-success-message');

if (imageUploadInput) {
    imageUploadInput.addEventListener('change', function() {
        if (imageUploadInput.files && imageUploadInput.files[0]) {
            const fileName = imageUploadInput.files[0].name;
            fileSuccessMessage.textContent = `${fileName} успешно качена`;
        } else {
            fileSuccessMessage.textContent = '';
        }
    });
}

//Успешно изпратен въпрос
const qaForm = document.querySelector('.qa-form');
const successMsg = document.getElementById('form-success-msg');

if (qaForm) {
    qaForm.addEventListener('submit', function(e) {
        successMsg.style.display = 'block';

        setTimeout(() => {
            successMsg.style.display = 'none';
            qaForm.reset();
            const fileSuccessMsg = document.getElementById('file-success-message');
            if(fileSuccessMsg) fileSuccessMsg.textContent = '';
        }, 4000);
    });
}


