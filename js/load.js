async function loadComponent(id, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        const html = await response.text();

        const element = document.getElementById(id);

        if (element) {
            element.innerHTML = html;
        }

    } catch (error) {
        console.error(error);
    }
}


async function loadPage() {

    const components = [
        ["navbar", "html/navbar.html"],
        ["hero", "hero/hero.html"],
        ["popular", "html/popular.html"],
        ["host-server", "html/host-server.html"],
        ["banner-cdn", "html/banner-cdn.html"],
        ["locations", "html/locations.html"],
        ["pass-banner", "html/pass-banner.html"],
        ["why", "html/why.html"],
        ["free-banner", "html/free-banner.html"],
        ["backup", "html/backup.html"],
        ["comment", "html/comment.html"],
        ["backup-types", "html/backup-types.html"],
        ["free-server-banner", "html/free-server-banner.html"],
        ["last-report" , "html/last-report.html"],
        ["footer", "html/footer.html"]
    ];


    // Load all html components
    await Promise.all(
        components.map(component =>
            loadComponent(component[0], component[1])
        )
    );


    // Initialize scripts safely

    const functions = [
        "initNavbar",
        "initHeroCarousel",
        "initPopularSlider",
        "initServerHostSlider",
        "initBannerCdn",
        "initLocationsCarousel",
        "initpassbanner",
        "initwhy",
        "initfree",
        "initbackup",
        "initCommentCarousel",
        "initbackupTypes",
        "initfreeServerBanner",
        "initLastreport",
        "initfooter"
    ];


    functions.forEach(func => {

        if (typeof window[func] === "function") {
            window[func]();
        }

    });


}


// Start
loadPage();