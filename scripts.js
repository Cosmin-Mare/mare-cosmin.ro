/* ============================================
   Mare Cosmin · Scripts
   ============================================ */

(function () {
    'use strict';

    var isEn = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
    var t = isEn ? {
        thanks: function (n) { return 'Thanks, ' + n + '! I\'ll get back to you soon.'; },
        failed: 'Something went wrong. Try again or email me directly.',
        network: 'Connection error. Check your internet or email me directly.'
    } : {
        thanks: function (n) { return 'Mulțumesc, ' + n + '! Revin cu un răspuns cât de curând.'; },
        failed: 'Ceva nu a mers. Încearcă din nou sau scrie-mi direct pe email.',
        network: 'Eroare de conexiune. Verifică internetul sau scrie-mi direct pe email.'
    };

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
    var navAnchors = document.querySelectorAll('.nav-links a[data-nav]');
    var navSections = [];
    navAnchors.forEach(function (a) {
        var id = a.getAttribute('data-nav');
        navSections.push({ id: id, nav: id });
    });

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
        if (!navSections.length) return;
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
                        '<p></p>';
                    success.querySelector('p').textContent = t.thanks(name);
                    formParent.prepend(success);
                } else {
                    formError.textContent = data.message || t.failed;
                    formError.style.display = 'block';
                }
            })
            .catch(function () {
                submitBtn.classList.remove('btn-loading');
                submitBtn.disabled = false;
                formError.textContent = t.network;
                formError.style.display = 'block';
            });
    });
})();
