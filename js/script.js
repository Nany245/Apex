// El manejo del formulario de contacto vive en form.js

// Script para llamar header/footer en cada pagina

//header
fetch('/Apex/pages/Header.html')
  .then(response => response.text())
  .then(data => {
    const header = document.getElementById('header-container');
    if (header) {
      header.innerHTML = data;

      // Menú hamburguesa (el header se inyecta aquí, por eso va dentro)
      const menuBtn = header.querySelector('.menu-toggle');
      const nav = header.querySelector('nav');
      if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => nav.classList.toggle('active'));
        // cerrar el menú al pulsar un enlace
        nav.querySelectorAll('a').forEach(a =>
          a.addEventListener('click', () => nav.classList.remove('active'))
        );
      }
    }
  });

//footer
fetch('/Apex/pages/footer.html')
  .then(response => response.text())
  .then(data => {
    const footer = document.getElementById('footer-container');
    if (footer) {
      footer.innerHTML = data;
    }
  });

//fade-out
document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function(e) {
        const href = this.href;

        if (!href) return;

        // Enlaces internos de la misma página: scroll suave sin recargar
        const hash = this.getAttribute("href");
        if (hash && hash.startsWith("#")) {
            const destino = document.querySelector(hash);
            if (destino) {
                e.preventDefault();
                destino.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
        }

        // Enlaces externos o que abren en nueva pestaña: no interceptar
        if (this.target === "_blank" || /^(mailto:|tel:|https?:\/\/)/.test(hash || "")) {
            return;
        }

        e.preventDefault();
        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = href;
        }, 300);
    });
});
