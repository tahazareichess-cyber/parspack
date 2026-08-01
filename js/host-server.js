document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".server-host-card");
    if (!slider) return;

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    function hasOverflow() {
        return slider.scrollWidth > slider.clientWidth;
    }

    function enableDragIfNeeded() {
        if (hasOverflow()) {
            slider.style.cursor = "grab";
        } else {
            slider.style.cursor = "default";
            slider.scrollLeft = 0;
        }
    }

    function getX(e) {
        return e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    }

    function dragStart(e) {
        if (!hasOverflow()) return;
        isDragging = true;
        startX = getX(e);
        startScrollLeft = slider.scrollLeft;
        slider.style.cursor = "grabbing";
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = getX(e);
        const walk = x - startX;
        slider.scrollLeft = startScrollLeft - walk;
    }

    function dragEnd() {
        isDragging = false;
        slider.style.cursor = hasOverflow() ? "grab" : "default";
    }

    slider.addEventListener("mousedown", dragStart);
    slider.addEventListener("mousemove", dragMove);
    slider.addEventListener("mouseup", dragEnd);
    slider.addEventListener("mouseleave", dragEnd);

    slider.addEventListener("touchstart", dragStart, { passive: true });
    slider.addEventListener("touchmove", dragMove, { passive: false });
    slider.addEventListener("touchend", dragEnd);

    window.addEventListener("resize", enableDragIfNeeded);
    enableDragIfNeeded();
});