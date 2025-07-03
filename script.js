// document content ready
const headings = document.querySelectorAll('h1');

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
