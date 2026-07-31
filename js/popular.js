document.addEventListener("DOMContentLoaded", () => {
    const viewport = document.querySelector(".popular-viewport");
    const track = document.querySelector(".popular-grid");
    const prevBtn = document.querySelector(".popular-btn.prev");
    const nextBtn = document.querySelector(".popular-btn.next");

    if (!viewport || !track || !prevBtn || !nextBtn) return;

    const originals = Array.from(track.children).map(card => card.cloneNode(true));

    let cloneCount = 0;
    let currentIndex = 0;
    let step = 0;

    let isDragging = false;
    let startX = 0;
    let dragDistance = 0;
    let baseTranslate = 0;

    function getGap() {
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.gap || styles.columnGap || "0");
        return gap || 0;
    }

    function measureStep() {
        const card = track.querySelector(".popular-card");
        if (!card) return 0;
        return card.getBoundingClientRect().width + getGap();
    }

    function cloneCard(card) {
        const clone = card.cloneNode(true);
        clone.classList.add("is-clone");
        return clone;
    }

    function setPosition(animate = true) {
        step = measureStep();
        track.style.transition = animate ? "transform .45s ease" : "none";
        track.style.transform = `translateX(${-currentIndex * step}px)`;
    }

    function buildCarousel() {
        track.innerHTML = "";

        originals.forEach(card => {
            track.appendChild(card.cloneNode(true));
        });

        step = measureStep();
        if (!step) return;

        cloneCount = Math.max(1, Math.ceil(viewport.clientWidth / step) + 1);

        const realCards = Array.from(track.querySelectorAll(".popular-card"));

        const headClones = realCards.slice(-cloneCount).map(cloneCard).reverse();
        const tailClones = realCards.slice(0, cloneCount).map(cloneCard);

        headClones.forEach(card => track.insertBefore(card, track.firstChild));
        tailClones.forEach(card => track.appendChild(card));

        currentIndex = cloneCount;
        setPosition(false);
    }

    nextBtn.addEventListener("click", () => {
        currentIndex += 1;
        setPosition(true);
    });

    prevBtn.addEventListener("click", () => {
        currentIndex -= 1;
        setPosition(true);
    });

    track.addEventListener("transitionend", () => {
        const totalOriginals = originals.length;

        if (currentIndex >= totalOriginals + cloneCount) {
            currentIndex = cloneCount;
            setPosition(false);
        }

        if (currentIndex < cloneCount) {
            currentIndex = totalOriginals + cloneCount - 1;
            setPosition(false);
        }
    });

    function startDrag(e) {
        if (e.pointerType === "mouse" && e.button !== 0) return;

        isDragging = true;
        dragDistance = 0;
        baseTranslate = -currentIndex * step;

        track.classList.add("dragging");
        track.style.transition = "none";

        startX = e.clientX;

        if (viewport.setPointerCapture) {
            viewport.setPointerCapture(e.pointerId);
        }
    }

    function onDrag(e) {
        if (!isDragging) return;

        dragDistance = e.clientX - startX;
        track.style.transform = `translateX(${baseTranslate + dragDistance}px)`;
    }

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;
        track.classList.remove("dragging");

        const threshold = Math.min(120, step / 4);

        if (dragDistance < -threshold) {
            currentIndex += 1;
        } else if (dragDistance > threshold) {
            currentIndex -= 1;
        }

        setPosition(true);
    }

    viewport.addEventListener("pointerdown", startDrag);
    viewport.addEventListener("pointermove", onDrag);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildCarousel, 100);
    });

    buildCarousel();
});