/* ===========================================================
 contastosssssssss 
   =========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    const EMPRESA = 'apexelectronicayservicios22@gmail.com';
    const ENDPOINT = 'https://formsubmit.co/ajax/' + EMPRESA;

    const wrap = form.closest('.formulario-wrap');
    const header = wrap.querySelector('.formulario-header');
    const exito = wrap.querySelector('.form-exito');
    const btn = form.querySelector('.btn-enviar');

    const nombre = form.querySelector('#nombre');
    const correo = form.querySelector('#correo');
    const telefono = form.querySelector('#telefono');
    const mensaje = form.querySelector('#mensaje');

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const ASUNTOS = {
        equipo: 'Un equipo con fallas',
        presupuesto: 'Un presupuesto',
        duda: 'Una duda',
        otro: 'Otro'
    };

    // Contenido del botón según el estado
    const ICONO_ENVIAR = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    const ICONO_CANDADO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
    const BTN_OK = ICONO_ENVIAR + ' Enviar mensaje';
    const BTN_FALTAN = ICONO_CANDADO + ' Llena los campos para enviar';

    // ---- Validación ----
    function esValido() {
        return nombre.value.trim() !== '' &&
               EMAIL_RE.test(correo.value.trim()) &&
               mensaje.value.trim() !== '';
    }

    function refrescarBoton() {
        if (esValido()) {
            btn.disabled = false;
            btn.innerHTML = BTN_OK;
        } else {
            btn.disabled = true;
            btn.innerHTML = BTN_FALTAN;
        }
    }

    form.addEventListener('input', refrescarBoton);
    refrescarBoton(); // estado inicial

    // ---- Mensaje de error reutilizable ----
    function mostrarError(texto) {
        let err = form.querySelector('.form-error');
        if (!err) {
            err = document.createElement('p');
            err.className = 'form-error';
            err.setAttribute('role', 'alert');
            form.appendChild(err);
        }
        err.textContent = texto;
    }

    function limpiarError() {
        const err = form.querySelector('.form-error');
        if (err) err.remove();
    }

    // ---- Envío automático al correo de la empresa ----
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!esValido()) {
            refrescarBoton();
            return;
        }

        limpiarError();
        btn.disabled = true;
        btn.classList.add('cargando');
        btn.innerHTML = ICONO_ENVIAR + ' Enviando...';

        const asuntoEl = form.querySelector('input[name="asunto"]:checked');
        const asunto = asuntoEl ? (ASUNTOS[asuntoEl.value] || asuntoEl.value) : 'Consulta';

        const datos = {
            Nombre: nombre.value.trim(),
            Correo: correo.value.trim(),
            Telefono: telefono.value.trim() || 'No indicado',
            Asunto: asunto,
            Mensaje: mensaje.value.trim(),
            _subject: 'Nuevo mensaje desde la web — ' + asunto,
            _template: 'table',
            _captcha: 'false'
        };

        try {
            const resp = await fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const data = await resp.json().catch(function () { return {}; });

            if (!resp.ok || (data.success && data.success !== 'true' && data.success !== true)) {
                throw new Error('Envío rechazado');
            }

            // Éxito: el correo ya salió. Cerramos el formulario.
            if (header) header.hidden = true;
            form.hidden = true;
            exito.hidden = false;
            exito.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (err) {
            btn.disabled = false;
            btn.classList.remove('cargando');
            btn.innerHTML = BTN_OK;
            mostrarError('No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo, o escríbenos por WhatsApp.');
        }
    });

    // ---- "Enviar otro formulario" ----
    const btnOtro = exito.querySelector('.btn-otro');
    if (btnOtro) {
        btnOtro.addEventListener('click', function () {
            form.reset();
            limpiarError();
            exito.hidden = true;
            form.hidden = false;
            if (header) header.hidden = false;
            btn.classList.remove('cargando');
            refrescarBoton();
            wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});
