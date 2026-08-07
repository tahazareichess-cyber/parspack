function initLocationsCarousel() {
    const slider = document.querySelector(".location-cards");
    const cards = document.querySelectorAll(".location-card");

    if (!slider || cards.length === 0) return;

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let autoTimer = null;

    const getStep = () => {
        const card = cards[0];
        const cardStyles = getComputedStyle(card);
        const marginLeft = parseFloat(cardStyles.marginLeft) || 0;
        const marginRight = parseFloat(cardStyles.marginRight) || 0;

        return card.offsetWidth + marginLeft + marginRight;
    };

    const stopAuto = () => {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    };

    const startAuto = () => {
        stopAuto();
        autoTimer = setInterval(() => {
            if (isDragging) return;

            const step = getStep();
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const next = Math.min(slider.scrollLeft + step, maxScroll);

            slider.scrollTo({
                left: next,
                behavior: "smooth"
            });
        }, 15000);
    };

    const endDrag = () => {
        isDragging = false;
        slider.classList.remove("is-dragging");
        startAuto();
    };

    slider.addEventListener("pointerdown", (e) => {
        isDragging = true;
        slider.classList.add("is-dragging");

        startX = e.pageX;
        startScrollLeft = slider.scrollLeft;

        slider.setPointerCapture(e.pointerId);
        stopAuto();
    });

    slider.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        e.preventDefault();

        const walk = (e.pageX - startX) * 1.2;
        slider.scrollLeft = startScrollLeft - walk;
    });

    slider.addEventListener("pointerup", endDrag);
    slider.addEventListener("pointercancel", endDrag);
    slider.addEventListener("pointerleave", () => {
        if (isDragging) endDrag();
    });

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", () => {
        if (!isDragging) startAuto();
    });

    startAuto();
}

document.addEventListener("DOMContentLoaded", initLocationsCarousel);