// Load navbar component
document.addEventListener('DOMContentLoaded', async () => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        try {
            const response = await fetch('/components/navbar.html');
            const html = await response.text();
            navbarPlaceholder.innerHTML = html;
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }
});
