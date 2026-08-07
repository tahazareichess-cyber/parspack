function initHeroCarousel() {


const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".carousel-controls span");

let currentIndex = 0;
let isDragging = false;

let startX = 0;
let currentTranslate = 0;
let previousTranslate = 0;

const slideWidth = () => {
    return document.querySelector(".hero-carousel").offsetWidth;
};


// clone first and last slides
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);


const allSlides = document.querySelectorAll(".carousel-slide");

currentIndex = 1;

track.style.transform = 
`translateX(-${slideWidth() * currentIndex}px)`;


function moveCarousel(){

    track.style.transition = "transform .45s ease";

    track.style.transform =
    `translateX(-${slideWidth() * currentIndex}px)`;


    updateDots();
}



function updateDots(){

    let index = currentIndex - 1;

    if(index < 0){
        index = slides.length - 1;
    }

    if(index >= slides.length){
        index = 0;
    }


    dots.forEach(dot=>{
        dot.classList.remove("active");
    });

    dots[index].classList.add("active");
}



// next / previous

function nextSlide(){

    if(currentIndex >= allSlides.length-1) return;

    currentIndex++;

    moveCarousel();
}


function previousSlide(){

    if(currentIndex <=0) return;

    currentIndex--;

    moveCarousel();
}



// infinite reset

track.addEventListener("transitionend",()=>{

    if(currentIndex === allSlides.length-1){

        track.style.transition="none";

        currentIndex=1;

        track.style.transform=
        `translateX(-${slideWidth()*currentIndex}px)`;
    }


    if(currentIndex===0){

        track.style.transition="none";

        currentIndex=slides.length;

        track.style.transform=
        `translateX(-${slideWidth()*currentIndex}px)`;
    }

});



// mouse + touch start

function startDrag(e){

    isDragging=true;

    track.style.transition="none";

    startX =
    e.type.includes("mouse")
    ? e.pageX
    : e.touches[0].clientX;


}


function dragMove(e){

    if(!isDragging) return;


    let currentX =
    e.type.includes("mouse")
    ? e.pageX
    : e.touches[0].clientX;


    let diff=currentX-startX;


    track.style.transform =
    `translateX(${
    -slideWidth()*currentIndex + diff
    }px)`;

}



function endDrag(e){

    if(!isDragging)return;


    isDragging=false;


    let endX =
    e.type.includes("mouse")
    ? e.pageX
    : e.changedTouches[0].clientX;


    let diff=endX-startX;


    if(diff < -80){
        nextSlide();
    }
    else if(diff > 80){
        previousSlide();
    }
    else{
        moveCarousel();
    }

}



// mouse events

track.addEventListener("mousedown",startDrag);
track.addEventListener("mousemove",dragMove);
track.addEventListener("mouseup",endDrag);
track.addEventListener("mouseleave",endDrag);


// touch events

track.addEventListener("touchstart",startDrag);
track.addEventListener("touchmove",dragMove);
track.addEventListener("touchend",endDrag);



// dots click

dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        currentIndex=index+1;

        moveCarousel();

    });

});


// resize fix

window.addEventListener("resize",()=>{

    track.style.transition="none";

    track.style.transform =
    `translateX(-${slideWidth()*currentIndex}px)`;

});
}
initHeroCarousel();