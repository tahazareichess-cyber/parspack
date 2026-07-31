document.addEventListener('DOMContentLoaded', () => {

    // ---------- Elements ----------
    const menuBtn     = document.querySelector('.menu-btn');
    const menuBtnIcon = menuBtn ? menuBtn.querySelector('ion-icon') : null;

    const mobileNavbar = document.querySelector('.mobile-navbar');
    const mobileMenu    = document.querySelector('.mobile-menu');
    const overlay       = document.querySelector('.overlay');

    const navbarTitle = document.querySelector('.navbar-title');
    const callBtn      = document.querySelector('.navbar-left .mobile-callus-btn');
    const enterBtn     = document.querySelector('.navbar-left .mobile-enter-btn');

    const menuFooter = document.querySelector('.menu-footer');
    const menuPages  = document.querySelectorAll('.menu-page');

    if (!menuBtn || !mobileMenu) return; // safety guard, nothing to do

    const ROOT_ID = 'main-menu';

    // stack of { id, label } — index 0 is always the root page
    let pageStack = [{ id: ROOT_ID, label: '' }];
    let isMenuOpen = false;

    // ---------- Helpers ----------
    function getPageById(id) {
        return document.getElementById(id);
    }

    // Reads the visible label of whatever was clicked (button/item),
    // ignoring the icon and any description text.
    function getLabel(el) {
        const titleEl = el.querySelector('.title');
        if (titleEl) return titleEl.textContent.trim();

        const clone = el.cloneNode(true);
        clone.querySelectorAll('ion-icon').forEach(icon => icon.remove());
        return clone.textContent.trim();
    }

    function showPage(id) {
        menuPages.forEach(page => page.classList.remove('active'));
        const target = getPageById(id);
        if (target) target.classList.add('active');
    }

    // Updates the menu button icon + the title text next to it,
    // based on whether the menu is open and how deep we are.
    function updateHeader() {
        const depth = pageStack.length - 1; // 0 = root page

        if (!isMenuOpen) {
            if (menuBtnIcon) menuBtnIcon.setAttribute('name', 'menu-outline');
            if (navbarTitle) {
                navbarTitle.style.display = 'none';
                navbarTitle.textContent = '';
            }
            menuBtn.classList.remove('is-back');
            return;
        }

        if (depth === 0) {
            // menu open, on the root page -> hamburger becomes X
            if (menuBtnIcon) menuBtnIcon.setAttribute('name', 'close-outline');
            if (navbarTitle) {
                navbarTitle.style.display = 'none';
                navbarTitle.textContent = '';
            }
            menuBtn.classList.remove('is-back');
        } else {
            // menu open, inside a submenu -> X becomes a back button + label
            if (menuBtnIcon) menuBtnIcon.setAttribute('name', 'chevron-back-outline');
            if (navbarTitle) {
                navbarTitle.textContent = pageStack[pageStack.length - 1].label || '';
                navbarTitle.style.display = 'block';
            }
            menuBtn.classList.add('is-back');
        }
    }

    function updateFooter() {
        if (!menuFooter) return;
        const onRoot = pageStack[pageStack.length - 1].id === ROOT_ID;
        menuFooter.classList.toggle('active', isMenuOpen && onRoot);
    }

    function resetToRoot() {
        pageStack = [{ id: ROOT_ID, label: '' }];
        showPage(ROOT_ID);
    }

    // ---------- Navigation ----------
    function goToPage(id, label) {
        if (!getPageById(id)) return;
        pageStack.push({ id, label });
        showPage(id);
        updateHeader();
        updateFooter();
    }

    function goBack() {
        if (pageStack.length <= 1) return; // already at root
        pageStack.pop();
        const current = pageStack[pageStack.length - 1];
        showPage(current.id);
        updateHeader();
        updateFooter();
    }

    // ---------- Open / Close ----------
    function openMenu() {
        isMenuOpen = true;
        resetToRoot();

        mobileMenu.classList.add('active');
        if (overlay) overlay.classList.add('active');
        if (mobileNavbar) mobileNavbar.classList.add('active'); // navbar slides up
        document.body.classList.add('menu-open');

        if (callBtn) callBtn.classList.add('hidden');
        if (enterBtn) enterBtn.classList.add('hidden');

        updateHeader();
        updateFooter();
    }

    function closeMenu() {
        isMenuOpen = false;

        mobileMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (mobileNavbar) mobileNavbar.classList.remove('active'); // navbar slides down
        document.body.classList.remove('menu-open');

        if (callBtn) callBtn.classList.remove('hidden');
        if (enterBtn) enterBtn.classList.remove('hidden');

        updateHeader();
        if (menuFooter) menuFooter.classList.remove('active');

        resetToRoot();
    }

    // ---------- Events ----------

    // Menu button: opens the menu, acts as a back button once inside a
    // submenu, and closes the menu when pressed again at the root.
    menuBtn.addEventListener('click', () => {
        if (!isMenuOpen) {
            openMenu();
            return;
        }
        if (pageStack.length > 1) {
            goBack();
        } else {
            closeMenu();
        }
    });

    // Clicking the dark overlay always closes the menu completely.
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Any item inside the menu with data-target drills into that page.
    mobileMenu.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-target]');
        if (!trigger) return;

        e.preventDefault();
        const targetId = trigger.getAttribute('data-target');
        const label = getLabel(trigger);
        goToPage(targetId, label);
    });

    // ---------- Initial state ----------
    resetToRoot();
    updateHeader();
});