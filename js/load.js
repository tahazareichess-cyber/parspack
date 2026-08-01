async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        const html = await response.text();
        document.getElementById(id).innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

async function loadPage() {
    // Load all components
    await loadComponent("navbar", "html/navbar.html");
    await loadComponent("hero", "hero/hero.html");
    await loadComponent("popular", "html/popular.html");
    await loadComponent("host-server", "html/host-server.html");
    await loadComponent("banner-cdn", "html/banner-cdn.html");
    await loadComponent("locations","html/locations.html");

    // Initialize JavaScript after everything is loaded
    if (typeof initNavbar === "function") initNavbar();
    if (typeof initHeroCarousel === "function") initHeroCarousel();
    if (typeof initPopularSlider === "function") initPopularSlider();
    if (typeof initServerHostSlider === "function") initServerHostSlider();
    if (typeof initBannerCdn === "function") initBannerCdn();

    initLocationsCarousel();
    
}

// Start the page
loadPage();
