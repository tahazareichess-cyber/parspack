document.addEventListener("DOMContentLoaded", () => {

    const viewport = document.querySelector(".popular-viewport");
    const track = document.querySelector(".popular-grid");
    const prevBtn = document.querySelector(".popular-btn.prev");
    const nextBtn = document.querySelector(".popular-btn.next");

    if (!viewport || !track || !prevBtn || !nextBtn) return;

    const originalCards = [...track.children];

    let cardWidth = 0;
    let cloneCount = 0;
    let currentIndex = 0;

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let previousTranslate = 0;

    function getGap() {
        return parseFloat(getComputedStyle(track).gap) || 0;
    }

    function updateCardWidth() {
        const card = track.querySelector(".popular-card");

        if (!card) return;

        cardWidth = card.offsetWidth + getGap();
    }

    function buildSlider() {

        track.innerHTML = "";

        originalCards.forEach(card => {
            track.appendChild(card.cloneNode(true));
        });

        updateCardWidth();

        cloneCount = Math.ceil(viewport.offsetWidth / cardWidth);

        const cards = [...track.children];

        // clones at beginning
        cards.slice(-cloneCount).forEach(card => {
            track.insertBefore(card.cloneNode(true), track.firstChild);
        });

        // clones at end
        cards.slice(0, cloneCount).forEach(card => {
            track.appendChild(card.cloneNode(true));
        });

        currentIndex = cloneCount;

        jump(false);
    }

    function jump(animate = true) {

        currentTranslate = -(currentIndex * cardWidth);

        track.style.transition = animate ? "transform .4s ease" : "none";

        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    nextBtn.addEventListener("click", () => {

        currentIndex++;

        jump();

    });

    prevBtn.addEventListener("click", () => {

        currentIndex--;

        jump();

    });

    track.addEventListener("transitionend", () => {

        const total = originalCards.length;

        if (currentIndex >= total + cloneCount) {

            currentIndex = cloneCount;

            jump(false);

        }

        if (currentIndex < cloneCount) {

            currentIndex = total + cloneCount - 1;

            jump(false);

        }

    });

    function pointerDown(e) {

        isDragging = true;

        startX = e.clientX;

        previousTranslate = currentTranslate;

        track.style.transition = "none";

        track.classList.add("dragging");

    }

    function pointerMove(e) {

        if (!isDragging) return;

        const delta = e.clientX - startX;

        currentTranslate = previousTranslate + delta;

        track.style.transform = `translateX(${currentTranslate}px)`;

    }

    function pointerUp() {

        if (!isDragging) return;

        isDragging = false;

        track.classList.remove("dragging");

        const moved = currentTranslate - previousTranslate;

        if (moved < -80) {

            currentIndex++;

        } else if (moved > 80) {

            currentIndex--;

        }

        jump();

    }

    viewport.addEventListener("pointerdown", pointerDown);

    window.addEventListener("pointermove", pointerMove);

    window.addEventListener("pointerup", pointerUp);

    window.addEventListener("pointercancel", pointerUp);

    let resizeTimer;

    window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            buildSlider();

        }, 100);

    });

    buildSlider();

});