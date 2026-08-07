function initLastreport() {
    const wrapper = document.querySelector('.last-report-carousel-wrapper');
    const track = document.querySelector('.last-report-cards');
    const cards = document.querySelectorAll('.last-report-card');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!wrapper || !track || cards.length === 0) return;

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let startTranslate = 0;
    let currentTranslate = 0;

    function isMobile() {
        return window.innerWidth <= 1024;
    }

    function getGap() {
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.gap || styles.columnGap || '0');
        return isNaN(gap) ? 0 : gap;
    }

    function getStepWidth() {
        const card = cards[0];
        if (!card) return 0;
        return card.getBoundingClientRect().width + getGap();
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function applyTranslate(animate = true) {
        if (!isMobile()) return;

        const step = getStepWidth();
        const maxIndex = cards.length - 1;

        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        currentTranslate = -currentIndex * step;

        track.style.transition = animate
            ? 'transform 0.35s ease'
            : 'none';

        track.style.transform = `translateX(${currentTranslate}px)`;
        updateDots();
    }

    function setCarouselState() {
        if (isMobile()) {
            wrapper.style.overflow = 'hidden';
            track.style.cursor = 'grab';
            track.style.direction = 'rtl';
            track.style.flexDirection = 'row-reverse';
            applyTranslate(false);

            const dotsWrap = document.querySelector('.carousel-dots');
            if (dotsWrap) dotsWrap.style.display = 'flex';
        } else {
            track.style.transform = 'translateX(0)';
            track.style.transition = 'none';

            const dotsWrap = document.querySelector('.carousel-dots');
            if (dotsWrap) dotsWrap.style.display = 'none';
        }
    }

    function onDragStart(clientX) {
        if (!isMobile()) return;

        isDragging = true;
        startX = clientX;
        currentX = clientX;
        startTranslate = currentTranslate;
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    }

    function onDragMove(clientX) {
        if (!isDragging || !isMobile()) return;

        currentX = clientX;
        const delta = currentX - startX;
        const step = getStepWidth();

        const maxTranslate = 0;
        const minTranslate = -(cards.length - 1) * step;

        let nextTranslate = startTranslate + delta;

        if (nextTranslate > maxTranslate) {
            nextTranslate = maxTranslate + (nextTranslate - maxTranslate) * 0.25;
        }

        if (nextTranslate < minTranslate) {
            nextTranslate = minTranslate + (nextTranslate - minTranslate) * 0.25;
        }

        currentTranslate = nextTranslate;
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function onDragEnd() {
        if (!isDragging || !isMobile()) return;

        isDragging = false;
        track.style.cursor = 'grab';

        const movedBy = currentX - startX;
        const threshold = Math.max(50, getStepWidth() * 0.18);

        if (movedBy < -threshold) {
            currentIndex += 1;
        } else if (movedBy > threshold) {
            currentIndex -= 1;
        }

        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > cards.length - 1) currentIndex = cards.length - 1;

        applyTranslate(true);
    }

    track.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        onDragStart(e.touches[0].clientX);
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        if (e.touches.length !== 1) return;
        e.preventDefault();
        onDragMove(e.touches[0].clientX);
    }, { passive: false });

    track.addEventListener('touchend', onDragEnd);

    track.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        onDragStart(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        onDragMove(e.clientX);
    });

    document.addEventListener('mouseup', onDragEnd);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            applyTranslate(true);
        });
    });

    window.addEventListener('resize', () => {
        setCarouselState();
    });

    setCarouselState();
}

window.initLastreport = initLastreport;