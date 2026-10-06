document.addEventListener('DOMContentLoaded', () => {
    
    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only apply custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Adding a slight delay to the outline for a smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effect for interactive elements
        const interactives = document.querySelectorAll('a, button, input, textarea, .logo');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });
    }

    // --- Typewriter Effect ---
    const words = [
        "Modern Web Applications",
        "Scalable MERN Solutions",
        "Robust Python Backends",
        "High-Performance APIs",
        "Seamless User Experiences"
    ];
    let i = 0;
    let timer;
    let isDeleting = false;
    let txt = '';
    const typewriterElement = document.querySelector('.typewriter');
    
    // Initial delay before typing starts
    setTimeout(typeNow, 1000);

    function typeNow() {
        let currentWord = words[i];
        
        if (isDeleting) {
            txt = currentWord.substring(0, txt.length - 1);
        } else {
            txt = currentWord.substring(0, txt.length + 1);
        }

        typewriterElement.textContent = txt;

        let typeSpeed = 100;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }

        if (!isDeleting && txt === currentWord) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && txt === '') {
            isDeleting = false;
            i = (i + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        timer = setTimeout(typeNow, typeSpeed);
    }

    // --- Navbar Scroll Effect ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Animate hamburger to X
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // --- Active Link Switching ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: Stop observing once shown
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class when scrolling up to replay animation
                // entry.target.classList.remove('show');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el, index) => {
        // Add staggered delay for grid items
        if(el.classList.contains('skill-card') || el.classList.contains('project-card')) {
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
        observer.observe(el);
    });

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const countUp = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const suffix = stat.getAttribute('data-suffix');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16);

            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + suffix;
                }
            };
            updateCount();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasCounted) {
            countUp();
            hasCounted = true;
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // --- Projects Carousel Logic ---
        // --- Projects Carousel Logic ---
    const slider = document.getElementById('projects-slider');
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');

    if (slider && prevBtn && nextBtn) {
        const cards = slider.querySelectorAll('.project-card');
        const counter = document.createElement('div');
        counter.className = 'project-counter';
        slider.parentElement.appendChild(counter);

        const pageWidth = () => {
            const gap = parseFloat(getComputedStyle(slider).columnGap) || 32;
            return cards[0].getBoundingClientRect().width + gap;
        };
        const pad = n => String(n).padStart(2, '0');
        const update = () => {
            const i = Math.min(cards.length - 1, Math.round(slider.scrollLeft / pageWidth()));
            counter.textContent = pad(i + 1) + ' / ' + pad(cards.length);
            prevBtn.style.opacity = i === 0 ? '.4' : '1';
            nextBtn.style.opacity = i === cards.length - 1 ? '.4' : '1';
        };

        prevBtn.addEventListener('click', () => slider.scrollBy({ left: -pageWidth(), behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => slider.scrollBy({ left: pageWidth(), behavior: 'smooth' }));
        slider.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    }
});
