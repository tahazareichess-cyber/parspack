function initfooter(){
    const buttons = document.querySelectorAll(".footer-header-mobile button");

    buttons.forEach((button) => {
        button.type = "button";
        button.setAttribute("aria-expanded", "false");

        button.addEventListener("click", () => {
            const column = button.closest(".footer-column-mobile");

            const isOpen = column.classList.toggle("active");

            button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    });
};