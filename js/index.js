document.addEventListener("DOMContentLoaded", () => {
  const productsLink = document.getElementById("products-link");
  const productsDropdown = document.getElementById("products-dropdown");
  const arrow = document.getElementById("arrow");

  if (!productsLink || !productsDropdown) return;

  const escapeSelector = (value) => {
    if (window.CSS && typeof CSS.escape === "function") return CSS.escape(value);
    return value.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g, "\\$1");
  };

  let closeTimer = null;

  const hideAll = () => {
    productsDropdown.classList.remove("show");
    if (arrow) arrow.classList.remove("rotate");

    productsDropdown.querySelectorAll(".mega-drawer.active").forEach((drawer) => {
      drawer.classList.remove("active");
    });
  };

  const openProducts = () => {
    clearTimeout(closeTimer);
    productsDropdown.classList.add("show");
    if (arrow) arrow.classList.add("rotate");
  };

  const showDrawerFor = (triggerEl) => {
    const targetName = triggerEl.dataset.target;
    if (!targetName) return;

    const scope = triggerEl.closest(".mega-drawer") || productsDropdown;
    const selector = `.${escapeSelector(targetName)}`;

    const targetDrawer =
      scope.querySelector(selector) || productsDropdown.querySelector(selector);

    if (!targetDrawer) return;

    openProducts();

    // Close only drawers inside the current scope, not the scope itself.
    scope.querySelectorAll(".mega-drawer.active").forEach((drawer) => {
      if (drawer !== targetDrawer) drawer.classList.remove("active");
    });

    targetDrawer.classList.add("active");
  };

  // Open / close the main dropdown
  productsLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (productsDropdown.classList.contains("show")) {
      hideAll();
    } else {
      openProducts();
    }
  });

  productsLink.addEventListener("mouseenter", openProducts);
  productsDropdown.addEventListener("mouseenter", openProducts);

  productsDropdown.addEventListener("mouseleave", () => {
    closeTimer = setTimeout(hideAll, 120);
  });

  document.addEventListener("click", (e) => {
    if (
      !productsDropdown.contains(e.target) &&
      !productsLink.contains(e.target)
    ) {
      hideAll();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideAll();
  });

  // Show every drawer with its matching data-target
  const triggers = productsDropdown.querySelectorAll("[data-target]");

  triggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => showDrawerFor(trigger));

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      showDrawerFor(trigger);
    });
  });
});
// Hide .about-server when hovering server categories
const aboutServer = document.querySelector(".about-server");
const buyServer = document.querySelector(".buy-server");

document
  .querySelectorAll(".cloud-server, .online-server, .privite-server")
  .forEach((item) => {
    item.addEventListener("mouseenter", () => {
      aboutServer.style.display = "none";
    });
  });

// Show it again only after leaving the entire "خرید سرور" section
buyServer.addEventListener("mouseleave", () => {
  aboutServer.style.display = "block";
});