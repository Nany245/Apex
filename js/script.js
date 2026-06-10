fetch('/pages/Header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
    });

fetch('/pages/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    });

function loadPage(url, pushState = true) {
    const main = document.querySelector('main');

    if (!main) {
        window.location.href = url;
        return;
    }

    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const nextMain = doc.querySelector('main');
            const nextTitle = doc.querySelector('title');

            if (nextMain) {
                main.innerHTML = nextMain.innerHTML;
            }

            if (nextTitle) {
                document.title = nextTitle.textContent;
            }

            if (pushState) {
                window.history.pushState({ url }, '', url);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(() => {
            window.location.href = url;
        });
}

document.addEventListener('click', (event) => {
    const link = event.target.closest('header a[href]');

    if (!link) {
        return;
    }

    const url = new URL(link.href, window.location.href);
    const sameOrigin = url.origin === window.location.origin;

    if (!sameOrigin) {
        return;
    }

    const isFragmentLink = url.pathname === window.location.pathname && url.hash;

    if (isFragmentLink) {
        return;
    }

    event.preventDefault();
    loadPage(url.pathname + url.search + url.hash);
});

window.addEventListener('popstate', () => {
    loadPage(window.location.pathname + window.location.search + window.location.hash, false);
});