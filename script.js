// for contact button
function scrollToSection(section) {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
}

const headings = document.querySelectorAll('.section-heading');
const h1Observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            h1Observer.unobserve(entry.target); // only once
        }
    });
}, {
    threshold: 1
});
headings.forEach(h1 => h1Observer.observe(h1));

function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('active');
    sidebar.classList.add('sidebar-shadow'); // Add shadow
    document.addEventListener('click', handleOutsideClick);
}
function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('active');
    sidebar.classList.remove('sidebar-shadow'); // Remove shadow
    document.removeEventListener('click', handleOutsideClick);
}

// Close on link click inside sidebar
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', hideSidebar);
});

// Close when clicked outside sidebar
function handleOutsideClick(e) {
    const sidebar = document.querySelector('.sidebar');
    const menuBtn = document.querySelector('.menu-button'); // to avoid closing when menu button clicked
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        hideSidebar();
    }
}

let lastScrollY = window.scrollY;
let timeout = null;
const nav = document.querySelector("nav");

function hideNav() {
    nav.style.transform = "translateY(-100%)";
}

function showNav() {
    nav.style.transform = "translateY(0)";
}

window.addEventListener("scroll", () => {
    clearTimeout(timeout);

    if (window.scrollY <= 50) {
        showNav(); // If at top, always show nav
    } else if (window.scrollY > lastScrollY) {
        hideNav(); // Scrolling down
    } else {
        showNav(); // Scrolling up
    }

    lastScrollY = window.scrollY;
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navigation a");

window.addEventListener("scroll", () => {
    let activeClass = null;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isHalfVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;

        if (isHalfVisible) {
            // Use the first class as identifier (e.g., "about", "projects", etc.)
            activeClass = section.classList[0];
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href) {
            const cleanHref = href.replace("#", "");
            if (cleanHref === activeClass) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        }
    });
});

const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate');
            }, index * 200);
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});
cards.forEach(card => observer.observe(card));

const skills = document.querySelectorAll('.skill-level');
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skill = entry.target;
            const target = parseInt(skill.dataset.skill);
            skill.style.width = target + '%';

            // Count-up percentage animation
            let current = 0;
            const speed = 15;

            const counter = setInterval(() => {
                if (current >= target) {
                    clearInterval(counter);
                    skill.textContent = target + '%';
                } else {
                    current++;
                    skill.textContent = current + '%';
                }
            }, speed);

            skillObserver.unobserve(skill);
        }
    });
}, {
    threshold: 0.5
});
skills.forEach(skill => {
    skillObserver.observe(skill);
});


const items = document.querySelectorAll('.education-item');

const educationObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.classList.add('animate');  // custom trigger
            educationObserver.unobserve(entry.target); // Animate only once
        }
    });
}, {
    threshold: 0.5 // 50% visible
});
items.forEach(item => educationObserver.observe(item));

const socialLinks = document.querySelectorAll('.contact-options .social-links a');

const aObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            aObserver.unobserve(entry.target); // only once
        }
    });
}, {
    threshold: 1
});

socialLinks.forEach(a => aObserver.observe(a));

// ############################################################
// carousel Source code

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

const carouObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                entry.target.classList.add("visible");
                carouObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.6,
    }
);
carouItems.forEach(item => carouObserver.observe(item));

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
    intervalId = setInterval(nextSlide, 3000);
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
