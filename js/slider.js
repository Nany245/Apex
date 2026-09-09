(function () {
	function iniciarCarrusel() {
		var carrusel = document.querySelector('[data-catalog-carousel]');
		if (!carrusel) return;

		var pista = carrusel.querySelector('[data-catalog-track]');
		var diapositivas = Array.from(carrusel.querySelectorAll('.catalog-item'));
		var anterior = carrusel.querySelector('[data-catalog-prev]');
		var siguiente = carrusel.querySelector('[data-catalog-next]');
		var puntos = carrusel.querySelector('[data-catalog-dots]');
		var indice = 0;
		var inicioX = 0;

		diapositivas.forEach(function (_, posicion) {
			var punto = document.createElement('button');
			punto.type = 'button';
			punto.className = 'catalog-dot';
			punto.setAttribute('aria-label', 'Mostrar imagen ' + (posicion + 1));
			punto.addEventListener('click', function () { mostrar(posicion); });
			puntos.appendChild(punto);
		});

		var indicadores = Array.from(puntos.children);

		function mostrar(nuevoIndice) {
			indice = (nuevoIndice + diapositivas.length) % diapositivas.length;
			pista.style.transform = 'translateX(-' + (indice * 100) + '%)';
			indicadores.forEach(function (punto, posicion) {
				punto.classList.toggle('is-active', posicion === indice);
				punto.setAttribute('aria-current', posicion === indice ? 'true' : 'false');
			});
		}

		anterior.addEventListener('click', function () { mostrar(indice - 1); });
		siguiente.addEventListener('click', function () { mostrar(indice + 1); });

		carrusel.addEventListener('keydown', function (evento) {
			if (evento.key === 'ArrowLeft') mostrar(indice - 1);
			if (evento.key === 'ArrowRight') mostrar(indice + 1);
		});

		carrusel.addEventListener('touchstart', function (evento) {
			inicioX = evento.changedTouches[0].screenX;
		}, { passive: true });

		carrusel.addEventListener('touchend', function (evento) {
			var desplazamiento = evento.changedTouches[0].screenX - inicioX;
			if (Math.abs(desplazamiento) > 45) mostrar(indice + (desplazamiento < 0 ? 1 : -1));
		}, { passive: true });

		mostrar(0);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', iniciarCarrusel);
	} else {
		iniciarCarrusel();
	}
})();
