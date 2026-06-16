// Script para manejar navegación y eventos
document.addEventListener('DOMContentLoaded', function() {
    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.btn-enviar');
            btn.textContent = 'Mensaje enviado correctamente';
            btn.disabled = true;
            btn.style.background = '#48CAE4';
            btn.style.color = '#002554';
        });
    }
});

// Script para llamar header/footer en cada pagina

//header
fetch('/Apex/pages/Header.html')
  .then(response => response.text())
  .then(data => {
    const header = document.getElementById('header-container');
    if (header) {
      header.innerHTML = data;
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

        e.preventDefault();
        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = href;
        }, 300);
    });
});