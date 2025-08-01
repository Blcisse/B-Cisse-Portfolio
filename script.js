function initializeWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const welcomeContent = document.querySelector('.welcome-content');

    if (!welcomeScreen || !welcomeContent) {
        console.warn('Welcome screen elements not found. Selectors: #welcome-screen, .welcome-content');
        return;
    }

    welcomeContent.classList.add('float-up');
    setTimeout(() => {
        welcomeScreen.classList.add('fade-out');
    }, 4000);

    welcomeScreen.addEventListener('transitionend', () => {
        welcomeScreen.style.display = 'none';
        console.log('Welcome screen hidden');
    }, { once: true });
}

function initializeGridSlideshow(gridClass) {
    const track = document.querySelector(`.${gridClass}-track`);
    const prev = document.querySelector(`.${gridClass}-prev`);
    const next = document.querySelector(`.${gridClass}-next`);
    const items = document.querySelectorAll(`.${gridClass}-item`);

    if (!track) {
        console.error(`Track not found for ${gridClass}. Selector: .${gridClass}-track`);
        return;
    }
    if (!prev) {
        console.error(`Prev button not found for ${gridClass}. Selector: .${gridClass}-prev`);
        return;
    }
    if (!next) {
        console.error(`Next button not found for ${gridClass}. Selector: .${gridClass}-next`);
        return;
    }
    if (items.length === 0) {
        console.error(`No items found for ${gridClass}. Selector: .${gridClass}-item`);
        return;
    }

    const total = items.length;
    let idx = 0;
    let intervalId;

    function move() {
        track.style.transform = `translateX(-${idx * 100}vw)`;
        const currentItem = items[idx];
        const subtopSelector = `.${gridClass}-subtop`;
        const subNum = document.querySelector(`${subtopSelector} .sub-num`);
        const subTitle = document.querySelector(`${subtopSelector} .sub-title`);
        const subSubtitle = document.querySelector(`${subtopSelector} .sub-subtitle`);

        if (!subNum || !subTitle || !subSubtitle) {
            console.error(`Subtop elements missing for ${gridClass}. Selectors: ${subtopSelector} .sub-num, .sub-title, .sub-subtitle`);
            return;
        }

        subNum.textContent = currentItem.dataset.num;
        subTitle.textContent = currentItem.dataset.title;
        subSubtitle.textContent = currentItem.dataset.subtitle;
        console.log(`Moved ${gridClass} to item ${idx + 1}: ${currentItem.dataset.title}`);
    }

    function startAutoSlide() {
        intervalId = setInterval(() => {
            idx = (idx + 1) % total;
            move();
            console.log(`Auto-slide ${gridClass}: idx = ${idx}`);
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    startAutoSlide();
    move();

    prev.addEventListener('click', () => {
        idx = (idx - 1 + total) % total;
        move();
        console.log(`Prev clicked for ${gridClass}: idx = ${idx}`);
    });

    next.addEventListener('click', () => {
        idx = (idx + 1) % total;
        move();
        console.log(`Next clicked for ${gridClass}: idx = ${idx}`);
    });

    let startX;
    track.addEventListener('mousedown', e => {
        startX = e.clientX;
        track.style.transition = 'none';
        function onMouseMove(e) {
            const dx = e.clientX - startX;
            track.style.transform = `translateX(calc(-${idx * 100}vw + ${dx}px))`;
        }
        function onMouseUp(e) {
            const dx = e.clientX - startX;
            track.style.transition = '';
            if (dx < -50) idx = (idx + 1) % total;
            if (dx > 50) idx = (idx - 1 + total) % total;
            move();
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            console.log(`Drag ended for ${gridClass}: idx = ${idx}`);
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Add pause on hover for iframes in jsanima sections
    const isJsAnima = gridClass.startsWith('jsanima');
    const pauseSelector = isJsAnima ? `.${gridClass}-item .${gridClass}-left iframe` : `.${gridClass}-item .${gridClass}-right img`;
    const pauseElements = document.querySelectorAll(pauseSelector);

    pauseElements.forEach(el => {
        el.addEventListener('mouseenter', stopAutoSlide);
        el.addEventListener('mouseleave', startAutoSlide);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeWelcomeScreen();

    const indexGrids = ['grid2', 'grid3', 'grid4', 'grid5', 'grid6', 'grid7'];
    indexGrids.forEach(grid => {
        if (document.querySelector(`.${grid}-track`)) {
            console.log(`Initializing ${grid}`);
            initializeGridSlideshow(grid);
        }
    });

    const uxuiGrids = ['griduxui1', 'griduxui2', 'griduxui3'];
    uxuiGrids.forEach(grid => {
        if (document.querySelector(`.${grid}-track`)) {
            console.log(`Initializing ${grid}`);
            initializeGridSlideshow(grid);
        } else {
            console.error(`Grid ${grid} not found in DOM`);
        }
    });

    const jsanimaGrids = ['jsanima1', 'jsanima2', 'jsanima3', 'jsanima4'];
    jsanimaGrids.forEach(grid => {
        if (document.querySelector(`.${grid}-track`)) {
            console.log(`Initializing ${grid}`);
            initializeGridSlideshow(grid);
        } else {
            console.error(`Grid ${grid} not found in DOM`);
        }
    });

    const scrollToTopButton = document.querySelector('.scroll-to-top');
    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const closingSection = document.getElementById('closing-section');
    if (closingSection) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const content = entry.target.querySelector('.closing-content');
                    content.classList.add('float-up');
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(closingSection);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburgerMenu && mobileMenu) {
        hamburgerMenu.addEventListener('click', () => {
            mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
});
