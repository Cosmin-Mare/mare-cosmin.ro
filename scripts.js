/* ============================================
   Cosmin Mare — Scripts
   ============================================ */

(function () {
    'use strict';

    // --- Nav scroll effect ---
    const nav = document.getElementById('nav');

    function handleNavScroll() {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = nav.offsetHeight + 16;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Fade-in on scroll ---
    var fadeElements = document.querySelectorAll('.section, .hero');

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(function (el) {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    // --- Cursor glow ---
    var cursorGlow = document.getElementById('cursorGlow');
    var glowActive = false;

    document.addEventListener('mousemove', function (e) {
        if (!glowActive) {
            cursorGlow.classList.add('active');
            glowActive = true;
        }
        requestAnimationFrame(function () {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    });

    document.addEventListener('mouseleave', function () {
        cursorGlow.classList.remove('active');
        glowActive = false;
    });

    // --- Contact form (Web3Forms) ---
    var form = document.getElementById('contactForm');
    var submitBtn = document.getElementById('submitBtn');
    var formError = document.getElementById('formError');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Hide previous error
        formError.style.display = 'none';

        var name = form.querySelector('#name').value.trim();
        var email = form.querySelector('#email').value.trim();
        var message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) return;

        // Loading state
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        // Send via Web3Forms API
        var formData = new FormData(form);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;

            if (data.success) {
                // Replace form with success message
                var formParent = form.parentNode;
                form.remove();

                var success = document.createElement('div');
                success.className = 'form-success';
                success.innerHTML =
                    '<span class="check">&#10003;</span>' +
                    '<p>Mulțumesc, ' + name + '! Revin cu un răspuns cât de curând.</p>';
                formParent.prepend(success);
            } else {
                // Show error
                formError.textContent = data.message || 'Ceva nu a mers. Încearcă din nou sau scrie-mi direct pe email.';
                formError.style.display = 'block';
            }
        })
        .catch(function () {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
            formError.textContent = 'Eroare de conexiune. Verifică internetul sau scrie-mi direct pe email.';
            formError.style.display = 'block';
        });
    });

})();
