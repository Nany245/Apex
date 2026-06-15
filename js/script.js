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