/* ============================================
   Mare Cosmin — Scripts
   ============================================ */

(function () {
    'use strict';

    var nav = document.getElementById('nav');
    var scrollProgress = document.getElementById('scrollProgress');

    function handleNavScroll() {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    function updateScrollProgress() {
        if (!scrollProgress) return;
        var doc = document.documentElement;
        var scrollTop = window.scrollY || doc.scrollTop;
        var height = doc.scrollHeight - doc.clientHeight;
        var pct = height > 0 ? (scrollTop / height) * 100 : 0;
        scrollProgress.style.width = pct + '%';
    }

    function onWindowScroll() {
        handleNavScroll();
        updateScrollProgress();
        onNavScroll();
    }

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    handleNavScroll();
    updateScrollProgress();

    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = anchor.getAttribute('href');
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

    // --- Active nav by scroll position (works for short sections too) ---
    var navSections = [
        { id: 'despre', nav: 'despre' },
        { id: 'experienta', nav: 'experienta' },
        { id: 'proiecte', nav: 'proiecte' },
        { id: 'servicii', nav: 'servicii' },
        { id: 'contact', nav: 'contact' }
    ];
    var navAnchors = document.querySelectorAll('.nav-links a[data-nav]');

    function setActiveNav(id) {
        navAnchors.forEach(function (a) {
            if (a.getAttribute('data-nav') === id) {
                a.classList.add('is-active');
            } else {
                a.classList.remove('is-active');
            }
        });
    }

    var navScrollTicking = false;
    function updateActiveNavFromScroll() {
        navScrollTicking = false;
        if (!navAnchors.length) return;
        var offset = nav.offsetHeight + 32;
        var y = window.scrollY + offset;
        var active = navSections[0].nav;
        for (var i = 0; i < navSections.length; i++) {
            var el = document.getElementById(navSections[i].id);
            if (el && el.offsetTop <= y) {
                active = navSections[i].nav;
            }
        }
        setActiveNav(active);
    }

    function onNavScroll() {
        if (!navScrollTicking) {
            navScrollTicking = true;
            requestAnimationFrame(updateActiveNavFromScroll);
        }
    }

    window.addEventListener('resize', onNavScroll, { passive: true });
    updateActiveNavFromScroll();

    // --- Fade-in on scroll ---
    var fadeElements = document.querySelectorAll('.section, .hero');

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -55px 0px',
        threshold: 0.08
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

    // --- Hero stat counters ---
    var heroStats = document.getElementById('heroStats');
    var counted = false;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function runCounters() {
        if (!heroStats || counted) return;
        counted = true;
        var values = heroStats.querySelectorAll('.hero-stat-value');
        var duration = 1800;

        values.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            if (isNaN(target)) return;
            var start = null;

            function step(ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / duration, 1);
                var eased = easeOutCubic(p);
                el.textContent = Math.round(target * eased);
                if (p < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = String(target);
                }
            }
            requestAnimationFrame(step);
        });
    }

    if (heroStats) {
        var statObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        runCounters();
                        statObserver.disconnect();
                    }
                });
            },
            { threshold: 0.25 }
        );
        statObserver.observe(heroStats);
    }

    // --- Cursor glow ---
    var cursorGlow = document.getElementById('cursorGlow');
    var glowActive = false;

    if (cursorGlow) {
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
    }

    // --- Servicii expand toggles ---
    document.querySelectorAll('.serviciu-toggle').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var card = btn.closest('.serviciu-card');
            if (!card) return;
            var open = !card.classList.contains('is-expanded');
            card.classList.toggle('is-expanded', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            btn.textContent = open ? 'Mai puțin' : 'Mai mult';
        });
    });

    // --- Contact form (Web3Forms) ---
    var form = document.getElementById('contactForm');
    var submitBtn = document.getElementById('submitBtn');
    var formError = document.getElementById('formError');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        formError.style.display = 'none';

        var name = form.querySelector('#name').value.trim();
        var email = form.querySelector('#email').value.trim();
        var message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) return;

        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

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
                    var formParent = form.parentNode;
                    form.remove();

                    var success = document.createElement('div');
                    success.className = 'form-success';
                    success.innerHTML =
                        '<span class="check">&#10003;</span>' +
                        '<p>Mulțumesc, ' + name + '! Revin cu un răspuns cât de curând.</p>';
                    formParent.prepend(success);
                } else {
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
