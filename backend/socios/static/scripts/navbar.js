document.addEventListener('DOMContentLoaded', function() {
    fetch('{% static "navbar.html" %}')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            highlightActiveLink();
        });
});

function highlightActiveLink() {
    const links = document.querySelectorAll('.navbar-link');
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}