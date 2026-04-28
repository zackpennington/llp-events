/**
 * Scroll Progress Indicator
 * Shows scroll progress as a visual indicator at the top of the page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    let ticking = false;

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercentage))}%`;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    updateScrollProgress(); // Initial update
});

