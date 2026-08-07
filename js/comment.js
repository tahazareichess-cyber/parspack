function initCommentCarousel() {
    'use strict';

    // Select by the classes that actually exist in the markup.
    const container = document.querySelector('.comment-slides');
    const track = document.querySelector('.comment-track');
    const dotsWrap = document.querySelector('.comments-dots');

    if (!container || !track || !dotsWrap) return;

    const originalSlides = Array.from(track.children);
    const totalSlides = originalSlides.length;
    if (totalSlides === 0) return;

    // ---- build the infinite-loop DOM: [lastClone, ...originals, firstClone] ----
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[totalSlides - 1].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');

    track.innerHTML = '';
    track.appendChild(lastClone);
    originalSlides.forEach((slide) => track.appendChild(slide));
    track.appendChild(firstClone);

    const totalTrack = track.children.length; // totalSlides + 2

    // Detect RTL
    const isRTL = getComputedStyle(container).direction === 'rtl';
    const sign = isRTL ? 1 : -1;

    let currentIndex = 1; // track-index of the first real slide
    let isAnimating = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let autoTimer = null;
    let isSwiping = false;

    const AUTO_MS = 5000;
    const DURATION = 450;

    // ---------------- dots ----------------
    dotsWrap.innerHTML = '';
    const dots = originalSlides.map((_, i) => {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            stopAuto();
            goTo(i + 1);
            startAuto();
        });
        dotsWrap.appendChild(dot);
        return dot;
    });

    function setActiveDot(realIndex) {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === realIndex));
    }

    function toRealIndex(trackIndex) {
        if (trackIndex === 0) return totalSlides - 1;
        if (trackIndex === totalTrack - 1) return 0;
        return trackIndex - 1;
    }

    // ---------------- transform helpers ----------------
    function slideWidth() {
        return container.getBoundingClientRect().width;
    }

    function transformFor(index) {
        return `translateX(${sign * index * 100}%)`;
    }

    function jumpTo(index) {
        track.style.transition = 'none';
        track.style.transform = transformFor(index);
        void track.offsetHeight;
        track.style.transition = `transform ${DURATION}ms ease`;
    }

    function goTo(index) {
        if (isAnimating) return;
        isAnimating = true;

        track.style.transition = `transform ${DURATION}ms ease`;
        track.style.transform = transformFor(index);
        setActiveDot(toRealIndex(index));

        let done = false;
        const finish = (e) => {
            if (e && e.propertyName !== 'transform') return;
            if (done) return;
            done = true;
            track.removeEventListener('transitionend', finish);

            if (index === 0) {
                currentIndex = totalSlides;
                jumpTo(currentIndex);
            } else if (index === totalTrack - 1) {
                currentIndex = 1;
                jumpTo(currentIndex);
            } else {
                currentIndex = index;
            }
            isAnimating = false;
        };

        track.addEventListener('transitionend', finish);
        setTimeout(finish, DURATION + 60);
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    // ---------------- autoplay ----------------
    function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => { if (!isDragging) next(); }, AUTO_MS);
    }
    function stopAuto() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
    }

    // ---------------- drag (unified with touch + mouse) ----------------
    function getClientX(e) {
        if (e.touches && e.touches.length > 0) {
            return e.touches[0].clientX;
        }
        if (e.changedTouches && e.changedTouches.length > 0) {
            return e.changedTouches[0].clientX;
        }
        return e.clientX;
    }

    function getClientY(e) {
        if (e.touches && e.touches.length > 0) {
            return e.touches[0].clientY;
        }
        if (e.changedTouches && e.changedTouches.length > 0) {
            return e.changedTouches[0].clientY;
        }
        return e.clientY;
    }

    function onDragStart(e) {
        if (isAnimating) return;
        
        // For touch events, prevent default to avoid scrolling
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        
        const clientX = getClientX(e);
        const clientY = getClientY(e);
        
        dragStartX = clientX;
        dragStartY = clientY;
        isDragging = true;
        isSwiping = false;
        
        track.classList.add('dragging');
        track.style.transition = 'none';
        stopAuto();
    }

    function getTargetIndex(clientX) {
        const deltaPct = ((clientX - dragStartX) / slideWidth()) * 100;
        const idx = currentIndex + (sign * deltaPct) / 100;
        return Math.max(0, Math.min(totalTrack - 1, idx));
    }

    function onDragMove(e) {
        if (!isDragging) return;
        
        // Prevent default to avoid scrolling while dragging
        e.preventDefault();
        
        const clientX = getClientX(e);
        const clientY = getClientY(e);
        
        // Determine if this is a horizontal swipe
        const deltaX = Math.abs(clientX - dragStartX);
        const deltaY = Math.abs(clientY - dragStartY);
        
        if (!isSwiping && (deltaX > 5 || deltaY > 5)) {
            isSwiping = deltaX > deltaY;
        }
        
        if (!isSwiping) return;
        
        const target = getTargetIndex(clientX);
        track.style.transform = transformFor(target);
    }

    function onDragEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        track.classList.remove('dragging');
        
        const clientX = getClientX(e);
        const target = Math.round(getTargetIndex(clientX));
        goTo(target);
        startAuto();
    }

    // Mouse events
    container.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    // Touch events
    container.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd, { passive: false });
    document.addEventListener('touchcancel', onDragEnd, { passive: false });

    // Prevent context menu on long press
    container.addEventListener('contextmenu', (e) => e.preventDefault());

    // Prevent default touch behaviors
    container.addEventListener('touchstart', (e) => {
        if (isDragging) e.preventDefault();
    }, { passive: false });

    // ---------------- keyboard ----------------
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { prev(); stopAuto(); startAuto(); }
        else if (e.key === 'ArrowLeft') { next(); stopAuto(); startAuto(); }
    });

    // ---------------- resize ----------------
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isAnimating && !isDragging) jumpTo(currentIndex);
        }, 150);
    });

    // ---------------- init ----------------
    jumpTo(currentIndex);
    setActiveDot(0);
    startAuto();

    window.__carousel = { next, prev, goTo };
};