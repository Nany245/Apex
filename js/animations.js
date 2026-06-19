/* ===========================================================
   APEX ELECTRÓNICA — Animaciones de entrada
   Revela los elementos con la clase .reveal cuando entran en
   pantalla (scroll). Si el navegador no soporta IntersectionObserver
   o el usuario prefiere menos movimiento, se muestran de una.
   =========================================================== */
(function () {
    function animar() {
        var elementos = document.querySelectorAll('.reveal');
        if (!elementos.length) return;

        var prefiereMenos = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Sin soporte o movimiento reducido: mostrar todo al instante
        if (prefiereMenos || !('IntersectionObserver' in window)) {
            elementos.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observador = new IntersectionObserver(function (entradas, obs) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('is-visible');
                    obs.unobserve(entrada.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        elementos.forEach(function (el) { observador.observe(el); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animar);
    } else {
        animar();
    }
})();
