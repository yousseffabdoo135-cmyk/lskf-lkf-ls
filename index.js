// ///////////////////// side menu (hamburger) /////////////////////

let indexBtn = document.querySelector(".index");
let div2 = document.querySelector(".div2");

function closeSideMenu() {
    div2.classList.remove("open");
    indexBtn.classList.remove("open");
}

function toggleSideMenu() {
    div2.classList.toggle("open");
    indexBtn.classList.toggle("open");
}

indexBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSideMenu();
});

// closing the menu right away lets the browser's own smooth-scroll
// take the user straight to the section they tapped
div2.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        closeSideMenu();
    });
});

// tap anywhere outside the menu to close it
document.addEventListener("click", function (e) {
    if (div2.classList.contains("open") &&
        !div2.contains(e.target) &&
        !indexBtn.contains(e.target)) {
        closeSideMenu();
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeSideMenu();
    }
});

// ///////////////////// scroll reveal for category cards /////////////////////

let catCards = document.querySelectorAll(".cat-card");

catCards.forEach(function (card) {
    card.classList.add("reveal");
});

let revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        entry.target.classList.toggle("visible", entry.isIntersecting);
    });
}, { threshold: 0.2 });

catCards.forEach(function (card) {
    revealObserver.observe(card);
});

// ///////////////////// auto-rotating category carousel /////////////////////
// every 3 seconds, one card lights up / lifts up, then the next one does

if (catCards.length > 0) {

    let currentIndex = 0;

    function highlightNextCard() {
        catCards.forEach(function (card) {
            card.classList.remove("featured");
        });

        catCards[currentIndex].classList.add("featured");
        currentIndex = (currentIndex + 1) % catCards.length;
    }

    highlightNextCard();
    setInterval(highlightNextCard, 3000);
}
