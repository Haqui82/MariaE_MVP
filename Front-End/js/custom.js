// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

// owl carousel
if (
    !document.body.hasAttribute('data-manual-carousel') &&
    typeof $.fn.owlCarousel === 'function'
) {
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        autoplay: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 6
            }
        }
    });
}

// UserVerification: centralized user-checking function used by multiple pages
// Returns the current user (string) or null and logs the same message used across pages.
function UserVerification() {
    // Prevent duplicate logs when called multiple times during page lifecycle
    if (window.__userVerificationRan) return window.currentUser || null;
    window.__userVerificationRan = true;

    var user = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || null;
    console.log('Actual User Is:', user || 'None');
    // Expose for quick access if needed elsewhere
    window.currentUser = user;
    return user;
}

// If some page requested the function to run early (marker set at top of <body>), run it now
if (window.__runUserVerificationOnLoad) {
    UserVerification();
    delete window.__runUserVerificationOnLoad;
}

// Also ensure it runs when custom.js loads (covers Live Server startup cases)
UserVerification();

// Shared contact form submission and registered-user prefill.
(function initializeContactForms() {
    var localHosts = ['localhost', '127.0.0.1', '::1'];
    var apiBaseUrl = window.location.port === '10000' ||
        (window.location.protocol !== 'file:' && !localHosts.includes(window.location.hostname))
        ? ''
        : 'http://localhost:10000';
    var contactForms = Array.prototype.slice.call(document.querySelectorAll('.contact-form'));
    var notificationForms = Array.prototype.slice.call(document.querySelectorAll('.notification-form'));

    function getCurrentProfile() {
        var userId = localStorage.getItem('currentUser');
        var storedProfile = localStorage.getItem('currentUserProfile');

        if (!userId || !storedProfile) {
            return null;
        }

        try {
            var profile = JSON.parse(storedProfile);
            return profile.documentNumber === userId ? profile : null;
        } catch (error) {
            console.error('No se pudo leer el perfil guardado del usuario:', error);
            return null;
        }
    }

    function fillContactForm(form, profile) {
        form.elements.nombre.value = profile.nombre || '';
        form.elements.email.value = profile.email || '';
        form.elements.telefono.value = profile.telefono || '';
        form.dataset.contactProfile = JSON.stringify(profile);
    }

    function fillNotificationForm(form, profile) {
        form.elements.email.value = profile.email || '';
        form.dataset.notificationProfile = JSON.stringify(profile);
    }

    function refreshContactFormProfiles() {
        var profile = getCurrentProfile();
        var serializedProfile = profile ? JSON.stringify(profile) : '';

        contactForms.forEach(function (form) {
            if (form.dataset.contactProfile === serializedProfile) {
                return;
            }

            if (profile) {
                fillContactForm(form, profile);
            } else if (form.dataset.contactProfile) {
                form.elements.nombre.value = '';
                form.elements.email.value = '';
                form.elements.telefono.value = '';
                delete form.dataset.contactProfile;
            }
        });

        notificationForms.forEach(function (form) {
            if (form.dataset.notificationProfile === serializedProfile) {
                return;
            }

            if (profile) {
                fillNotificationForm(form, profile);
            } else if (form.dataset.notificationProfile) {
                form.elements.email.value = '';
                delete form.dataset.notificationProfile;
            }
        });
    }

    contactForms.forEach(function (form) {
        var status = form.querySelector('.contact-form-status');
        var submitButton = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            submitButton.disabled = true;
            status.textContent = 'Enviando mensaje...';

            try {
                var response = await fetch(apiBaseUrl + '/api/contactos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: form.elements.nombre.value,
                        email: form.elements.email.value,
                        telefono: form.elements.telefono.value,
                        mensaje: form.elements.mensaje.value
                    })
                });
                var result = await response.json();

                if (!response.ok || !result.success) {
                    status.textContent = result.message || 'No se pudo enviar el mensaje. Inténtalo de nuevo.';
                    return;
                }

                form.reset();
                var profile = getCurrentProfile();
                if (profile) {
                    fillContactForm(form, profile);
                }
                status.textContent = result.message;
            } catch (error) {
                console.error('Error al enviar el mensaje de contacto:', error);
                status.textContent = 'No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.';
            } finally {
                submitButton.disabled = false;
            }
        });
    });

    notificationForms.forEach(function (form) {
        var status = form.querySelector('.notification-form-status');
        var submitButton = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            submitButton.disabled = true;
            status.textContent = 'Procesando suscripción...';

            try {
                var email = form.elements.email.value.trim();
                var profile = getCurrentProfile();
                var nombre = profile && profile.email &&
                    profile.email.trim().toLowerCase() === email.toLowerCase()
                    ? profile.nombre
                    : null;
                var response = await fetch(apiBaseUrl + '/api/notificaciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, nombre: nombre })
                });
                var result = await response.json();

                if (!response.ok || !result.success) {
                    status.textContent = result.message || 'No se pudo completar la suscripción.';
                    return;
                }

                form.reset();
                if (profile && profile.email) {
                    fillNotificationForm(form, profile);
                }
                status.textContent = result.message;
            } catch (error) {
                console.error('Error al suscribirse a notificaciones:', error);
                status.textContent = 'No se pudo completar la suscripción. Inténtalo de nuevo más tarde.';
            } finally {
                submitButton.disabled = false;
            }
        });
    });

    refreshContactFormProfiles();
    window.addEventListener('pageshow', refreshContactFormProfiles);
    window.addEventListener('storage', function (event) {
        if (!event.key || event.key === 'currentUser' || event.key === 'currentUserProfile') {
            refreshContactFormProfiles();
        }
    });
})();