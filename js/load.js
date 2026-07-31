async function loadComponent(id, file) {
    const response = await fetch(file);

    if (!response.ok) {
        console.error(`Couldn't load ${file}`);
        return;
    }

    const html = await response.text();

    document.getElementById(id).innerHTML = html;
}

loadComponent("navbar", "components/navbar.html");
loadComponent("hero", "components/hero.html");