function showSidebar() {
    document.querySelector('.sidebar').classList.add('active');
    document.addEventListener('click', handleOutsideClick);
}

function hideSidebar() {
    document.querySelector('.sidebar').classList.remove('active');
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

    // timeout = setTimeout(() => {
    //     if (window.scrollY >= 50) hideNav(); // Only hide if not at top
    // }, 1000);
});

const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", navHighlighter);

function navHighlighter() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionId = section.getAttribute("id");

        // Section is considered active if 50% or more of it is in the viewport
        const isHalfVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;

        const navLinks = document.querySelectorAll(`.navigation a[href*="${sectionId}"]`);
        navLinks.forEach(link => {
            if (isHalfVisible) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    });
}

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
    threshold: 0.2
});

cards.forEach(card => observer.observe(card));
