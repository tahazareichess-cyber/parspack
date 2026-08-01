function initLocationsCarousel(){

    const slider = document.querySelector(".location-cards");
    const cards = document.querySelectorAll(".location-card");

    if(!slider || cards.length === 0) return;


    let isDragging = false;

    let startX = 0;

    let scrollLeft = 0;

    let autoTimer;


    // ======================
    // DRAG START
    // ======================

    slider.addEventListener("mousedown", (e)=>{

        isDragging = true;

        startX = e.pageX - slider.offsetLeft;

        scrollLeft = slider.scrollLeft;

        stopAuto();

    });



    slider.addEventListener("mouseleave", ()=>{

        isDragging = false;

        startAuto();

    });



    slider.addEventListener("mouseup", ()=>{

        isDragging = false;

        startAuto();

    });



    slider.addEventListener("mousemove",(e)=>{

        if(!isDragging) return;


        e.preventDefault();


        const x = e.pageX - slider.offsetLeft;


        const walk = (x - startX) * 1.2;


        slider.scrollLeft = scrollLeft - walk;

    });



    // ======================
    // TOUCH SUPPORT
    // ======================


    slider.addEventListener("touchstart",(e)=>{

        isDragging = true;

        startX = e.touches[0].pageX;

        scrollLeft = slider.scrollLeft;

        stopAuto();

    });



    slider.addEventListener("touchmove",(e)=>{

        if(!isDragging) return;


        const x = e.touches[0].pageX;


        const walk = (x - startX) * 1.2;


        slider.scrollLeft = scrollLeft - walk;

    });



    slider.addEventListener("touchend",()=>{

        isDragging = false;

        startAuto();

    });



    // ======================
    // 15 SECOND AUTO MOVE
    // ======================


    function autoSlide(){


        const cardWidth =
        cards[0].offsetWidth + 30;


        const maxScroll =
        slider.scrollWidth - slider.clientWidth;



        if(slider.scrollLeft >= maxScroll){

            // stop at end
            slider.scrollLeft = maxScroll;

            return;

        }



        slider.scrollBy({

            left: cardWidth,

            behavior:"smooth"

        });

    }



    function startAuto(){

        stopAuto();

        autoTimer = setInterval(autoSlide,15000);

    }



    function stopAuto(){

        clearInterval(autoTimer);

    }



    startAuto();

}