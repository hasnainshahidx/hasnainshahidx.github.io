const carouItems = document.querySelectorAll(".carou-item");
const dots = document.querySelectorAll(".dot");
const carousel = document.getElementById("carousel");

let current = 0;
let intervalId;
let touchStartX = 0;

/**
 * Updates carousel UI based on the current index.
 */
function updateCarousel() {
    carouItems.forEach((item, i) => {
        item.classList.remove("active", "left", "right");
        if (i === current) item.classList.add("active");
        else if (i === (current + 1) % carouItems.length) item.classList.add("left");
        else if (i === (current - 1 + carouItems.length) % carouItems.length) item.classList.add("right");
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
    });
}

/**
 * Moves carousel to next slide.
 */
function prevSlide() {
    current = (current + 1) % carouItems.length;
    updateCarousel();
}

/**
 * Moves carousel to previous slide.
 */
function nextSlide() {
    current = (current - 1 + carouItems.length) % carouItems.length;
    updateCarousel();
}

/**
 * Starts the auto-scroll interval.
 */
function startAutoScroll() {
    stopAutoScroll(); // Prevent duplicate intervals
    // intervalId = setInterval(nextSlide, 3000);
}

/**
 * Stops the auto-scroll interval.
 */
function stopAutoScroll() {
    clearInterval(intervalId);
}

// ========== Event Binding ==========

// Dot click → go to specific slide
dots.forEach(dot => {
    dot.addEventListener("click", () => {
        current = parseInt(dot.dataset.index);
        updateCarousel();
    });
});

// Item interactions
carouItems.forEach(item => {
    // Hover pause (desktop)
    item.addEventListener("mouseenter", stopAutoScroll);
    item.addEventListener("mouseleave", startAutoScroll);

    // Touch pause (mobile/tablets)
    item.addEventListener("touchstart", stopAutoScroll, { passive: true });
    item.addEventListener("touchend", startAutoScroll, { passive: true });
    item.addEventListener("touchcancel", startAutoScroll, { passive: true });

    // Click to bring that item to front
    item.addEventListener("click", () => {
        current = Array.from(carouItems).indexOf(item);
        updateCarousel();
    });
});

// Swipe handling (mobile/touch/trackpad)
carousel.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener("touchend", e => {
    const touchEndX = e.changedTouches[0].screenX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX < -50) nextSlide();
    else if (deltaX > 50) prevSlide();
}, { passive: true });

let wheelBlocked = false;

carousel.addEventListener("wheel", e => {
    if (wheelBlocked) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault(); // prevent native horizontal scroll

        if (e.deltaX > 50) nextSlide();
        else if (e.deltaX < -50) prevSlide();

        wheelBlocked = true;
        setTimeout(() => wheelBlocked = false, 500);
    }
}, { passive: false });

// ========== Initialize ==========
updateCarousel();
startAutoScroll();
