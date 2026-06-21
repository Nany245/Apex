// El manejo del formulario de contacto vive en form.js

// Script para llamar header/footer en cada pagina

// Ruta base relativa al proyecto: '../' si estamos dentro de /pages/, si no './'
// Esto hace que el sitio funcione abra donde abra y también en cualquier dominio.
const BASE = location.pathname.includes('/pages/') ? '../' : './';

//header
fetch(BASE + 'pages/Header.html')
  .then(response => response.text())
  .then(data => {
    const header = document.getElementById('header-container');
    if (!header) return;
    header.innerHTML = data.replace(/\{\{base\}\}/g, BASE);

    // Menú hamburguesa (el header se inyecta aquí, por eso va dentro)
    const menuBtn = header.querySelector('.menu-toggle');
    const nav = header.querySelector('nav');
    if (menuBtn && nav) {
      function cerrarMenu() {
        nav.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
      menuBtn.addEventListener('click', function () {
        const abrir = !nav.classList.contains('active');
        nav.classList.toggle('active', abrir);
        menuBtn.classList.toggle('active', abrir);
        menuBtn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', cerrarMenu);
      });
    }

    // Página actual: resaltar enlace activo + breadcrumb
    const NOMBRES = {
      'index.html': 'Inicio',
      'servicios.html': 'Servicios',
      'proceso.html': 'Proceso',
      'cobertura.html': 'Cobertura',
      'sobre-nosotros.html': 'Sobre nosotros',
      'contacto.html': 'Contacto',
      'tienda.html': 'Tienda'
    };
    let archivo = location.pathname.split('/').pop();
    if (!archivo) archivo = 'index.html';

    header.querySelectorAll('nav ul a').forEach(function (a) {
      const href = a.getAttribute('href') || '';
      if (href.endsWith(archivo)) a.classList.add('active');
    });

    const bc = header.querySelector('#breadcrumb');
    const bcCur = header.querySelector('#bc-current');
    if (bc && bcCur && archivo !== 'index.html' && NOMBRES[archivo]) {
      bcCur.textContent = NOMBRES[archivo];
      bc.hidden = false;
    }
  });

//footer
fetch(BASE + 'pages/footer.html')
  .then(response => response.text())
  .then(data => {
    const footer = document.getElementById('footer-container');
    if (footer) {
      footer.innerHTML = data.replace(/\{\{base\}\}/g, BASE);
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
