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
        // --- Projects: book layout ---
    document.querySelectorAll('.project-card').forEach(card => {
        const img = card.querySelector('.project-image');
        const info = card.querySelector('.project-info');
        const tags = card.querySelector('.project-tags');
        const title = info?.querySelector('h3');
        const description = info?.querySelector('ul');
        const links = info?.querySelector('.project-links');
        if (!img || !info || !tags || !title || !description || !links || card.querySelector('.page-left')) return;

        const titleText = title.textContent.trim();
        const editor = document.createElement('div');
        editor.className = 'project-code-editor';
        editor.setAttribute('aria-label', `${titleText} project summary`);

        const editorBar = document.createElement('div');
        editorBar.className = 'ed-bar';
        ['r', 'y', 'g'].forEach(color => {
            const dot = document.createElement('span');
            dot.className = `dot ${color}`;
            editorBar.appendChild(dot);
        });
        const fileName = document.createElement('b');
        fileName.textContent = `${titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project'}.js`;
        editorBar.appendChild(fileName);
        editor.appendChild(editorBar);

        const editorBody = document.createElement('div');
        editorBody.className = 'project-code-body';
        editorBody.setAttribute('role', 'group');
        const accessibleTitle = document.createElement('h3');
        accessibleTitle.className = 'project-code-title';
        accessibleTitle.textContent = titleText;
        editorBody.appendChild(accessibleTitle);

        const addCodeLine = (container, parts, caret = false) => {
            const line = document.createElement('div');
            line.className = 'l';
            const content = document.createElement('span');
            content.className = 'project-code-content';
            parts.forEach(part => {
                if (typeof part === 'string') {
                    content.appendChild(document.createTextNode(part));
                } else if (part instanceof Node) {
                    content.appendChild(part);
                } else {
                    const token = document.createElement('span');
                    token.className = part.className;
                    token.textContent = part.text;
                    content.appendChild(token);
                }
            });
            if (caret) {
                const cursor = document.createElement('span');
                cursor.className = 'caret';
                content.appendChild(cursor);
            }
            line.appendChild(content);
            container.appendChild(line);
        };
        const token = (className, text) => ({ className, text });
        const descriptionItems = [...description.querySelectorAll('li')]
            .map(item => item.textContent.trim().replace(/\s+/g, ' '));

        addCodeLine(editorBody, [token('k', 'const'), ' ', token('p', 'project'), ' = {']);
        addCodeLine(editorBody, ['  ', token('p', 'name'), ': ', token('s', JSON.stringify(titleText)), ',']);
        addCodeLine(editorBody, ['  ', token('p', 'output'), ': [']);
        descriptionItems.forEach((text, index) => {
            addCodeLine(editorBody, ['    ', token('s', JSON.stringify(text)), index < descriptionItems.length - 1 ? ',' : '']);
        });
        addCodeLine(editorBody, ['  ]']);
        addCodeLine(editorBody, ['};'], true);
        editor.appendChild(editorBody);

        const highlightsEditor = document.createElement('div');
        highlightsEditor.className = 'project-highlights-editor';
        highlightsEditor.setAttribute('aria-label', `${titleText} technology highlights`);
        const highlightsBar = editorBar.cloneNode(true);
        highlightsBar.querySelector('b').textContent = 'highlights.js';
        highlightsEditor.appendChild(highlightsBar);

        const highlightsBody = document.createElement('div');
        highlightsBody.className = 'project-code-body project-highlights-body';
        const highlightValues = [...tags.querySelectorAll('span')].map(tag => tag.textContent.trim());
        const highlightParts = [token('k', 'const'), ' ', token('p', 'highlights'), ' = [ '];
        highlightValues.forEach((value, index) => {
            highlightParts.push(token('s project-highlight-value', `${JSON.stringify(value)}${index < highlightValues.length - 1 ? ',' : ''}`));
            if (index < highlightValues.length - 1) highlightParts.push(' ');
        });
        highlightParts.push(' ];');
        addCodeLine(highlightsBody, highlightParts);
        addCodeLine(highlightsBody, ['']);
        addCodeLine(highlightsBody, [token('k', 'const'), ' ', token('p', 'projectLinks'), ' = {']);
        [...links.querySelectorAll('a')].forEach((sourceLink, index, projectLinks) => {
            const link = document.createElement('a');
            link.className = 'project-code-link';
            link.href = sourceLink.href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = JSON.stringify(sourceLink.href);
            addCodeLine(highlightsBody, [
                '  ', token('p', JSON.stringify(sourceLink.textContent.trim())), ': ',
                link, index < projectLinks.length - 1 ? ',' : ''
            ]);
        });
        addCodeLine(highlightsBody, ['};'], true);
        highlightsEditor.appendChild(highlightsBody);

        const left = document.createElement('div');
        left.className = 'project-summary-panel';
        left.appendChild(editor);

        const right = document.createElement('div');
        right.className = 'project-showcase-panel';
        img.querySelector('img').alt = `${titleText} project preview`;
        right.append(img, highlightsEditor);
        info.remove();
        card.append(left, right);
    });
   
           // --- Projects: page turn ---
    const slider = document.getElementById('projects-slider');
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');

    if (slider && prevBtn && nextBtn) {
        const cards = [...slider.querySelectorAll('.project-card')];
        const counter = document.createElement('div');
        counter.className = 'project-counter';
        slider.parentElement.appendChild(counter);

        let cur = 0, busy = false;
        const pad = n => String(n).padStart(2, '0');
        const update = () => {
            counter.textContent = pad(cur + 1) + ' / ' + pad(cards.length);
            prevBtn.style.opacity = cur === 0 ? '.4' : '1';
            nextBtn.style.opacity = cur === cards.length - 1 ? '.4' : '1';
        };
        cards[0].classList.add('is-active');
        update();

                const go = dir => {
            const to = cur + dir;
            if (busy || to < 0 || to >= cards.length) return;
            busy = true;
            const from = cards[cur], next = cards[to];
            next.classList.add('is-under');
            from.classList.add('fade');

            setTimeout(() => {
                from.classList.remove('is-active', 'fade');
                next.classList.remove('is-under');
                next.classList.add('is-active');
                cur = to; busy = false; update();
            }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
        };

        prevBtn.addEventListener('click', () => go(-1));
        nextBtn.addEventListener('click', () => go(1));
    }
});
