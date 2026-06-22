// El manejo del formulario de contacto vive en form.js

// ===========================================================
//  Carga el header/footer (archivos .html) en cada página
// ===========================================================

// Ruta base relativa: '../' si estamos dentro de /pages/, si no './'
const BASE = location.pathname.includes('/pages/') ? '../' : './';

// Live Server inyecta su script de auto-recarga dentro de los fragmentos
// (y rompe los SVG/HTML). Como el header y el footer NO llevan <script>,
// quitamos cualquier comentario inyectado y cualquier <script> antes de meterlos.
function prepararParcial(html) {
  return html
    .replace(/<!--\s*Code injected by live-server\s*-->/gi, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')   // scripts completos
    .replace(/<script\b[\s\S]*$/i, '')              // script truncado al final
    .replace(/\{\{base\}\}/g, BASE);
}

// ---- HEADER ----
fetch(BASE + 'pages/Header.html', { cache: 'no-store' })
  .then(response => response.text())
  .then(data => {
    const header = document.getElementById('header-container');
    if (!header) return;
    header.innerHTML = prepararParcial(data);

    // Menú hamburguesa (drawer lateral)
    const menuBtn = header.querySelector('.menu-toggle');
    const nav = header.querySelector('nav');
    const overlay = header.querySelector('#nav-overlay');
    const closeBtn = header.querySelector('.nav-close');
    if (menuBtn && nav) {
      function abrirMenu() {
        nav.classList.add('active');
        if (overlay) overlay.classList.add('active');
        menuBtn.classList.add('active');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
      }
      function cerrarMenu() {
        nav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
      menuBtn.addEventListener('click', function () {
        if (nav.classList.contains('active')) cerrarMenu(); else abrirMenu();
      });
      if (closeBtn) closeBtn.addEventListener('click', cerrarMenu);
      if (overlay) overlay.addEventListener('click', cerrarMenu);
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', cerrarMenu);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') cerrarMenu();
      });
    }

    // Página actual: resaltar enlace activo + breadcrumb
    const NOMBRES = {
      'index.html': 'Inicio',
      'servicios.html': 'Servicios',
      'proceso.html': 'Proceso',
      'cobertura.html': 'Cobertura',
      'sobre-nosotros.html': 'Sobre nosotros',
      'contacto.html': 'Contacto'
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

// ---- FOOTER ----
fetch(BASE + 'pages/footer.html', { cache: 'no-store' })
  .then(response => response.text())
  .then(data => {
    const footer = document.getElementById('footer-container');
    if (footer) footer.innerHTML = prepararParcial(data);
  });

// ---- Scroll suave en anclas + transición fade entre páginas ----
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function (e) {
    const href = this.href;
    if (!href) return;

    const hash = this.getAttribute("href");
    if (hash && hash.startsWith("#")) {
      const destino = document.querySelector(hash);
      if (destino) {
        e.preventDefault();
        destino.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (this.target === "_blank" || /^(mailto:|tel:|https?:\/\/)/.test(hash || "")) {
      return;
    }

    e.preventDefault();
    document.body.classList.add("fade-out");
    setTimeout(() => { window.location.href = href; }, 300);
  });
});
