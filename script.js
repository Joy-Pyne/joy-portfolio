document.addEventListener('DOMContentLoaded', function() {
    
    // --- Loading Animation ---
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    // Trigger initial transitions
                    document.querySelectorAll('.section-transition').forEach((el, index) => {
                        if(index === 0) el.classList.add('visible');
                    });
                }, 500);
            }, 800);
        });
    }

    // --- Particles & Theme ---
    initParticles('dark');
    
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    if(savedTheme === 'light') initParticles('light');

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        initParticles(newTheme);
    });

    // --- Mobile Navbar ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinksList = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Tabbed Navigation Logic (Resume Section) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding tab pane
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Expose switchTab globally for external buttons (like View Projects) ---
    window.switchTab = function(tabId) {
        const targetBtn = document.querySelector(`.tab-btn[data-target="${tabId}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    };

    // --- Scroll Progress Bar & Nav Active States ---
    const progressBar = document.getElementById('progressBar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Progress Bar
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        if(progressBar) progressBar.style.width = scrollPercent + '%';

        // Nav Active State
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Section Transitions (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-transition').forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                formStatus.style.display = 'block';
                
                if (data.success) {
                    formStatus.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
                    formStatus.style.color = '#2ecc71';
                    formStatus.style.border = '1px solid #2ecc71';
                    formStatus.innerText = data.message;
                    contactForm.reset();
                } else {
                    formStatus.style.backgroundColor = 'rgba(231, 76, 60, 0.2)';
                    formStatus.style.color = '#e74c3c';
                    formStatus.style.border = '1px solid #e74c3c';
                    formStatus.innerText = data.error || 'Error. Please try again.';
                }
            } catch (error) {
                formStatus.style.display = 'block';
                formStatus.style.backgroundColor = 'rgba(231, 76, 60, 0.2)';
                formStatus.style.color = '#e74c3c';
                formStatus.style.border = '1px solid #e74c3c';
                formStatus.innerText = 'Server error. Please try again later.';
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
            }
        });
    }

    // --- Typing Animation ---
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const textToType = typingElement.getAttribute('data-text');
        let charIndex = 0;
        typingElement.classList.add('typing');
        
        function typeText() {
            if (charIndex < textToType.length) {
                typingElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, 60);
            }
        }
        
        setTimeout(typeText, 1000); // Start after intro animation
    }

    // --- Standalone Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

});

// --- Particles Configuration ---
function initParticles(theme) {
    const isDark = theme === 'dark';
    const numParticles = window.innerWidth < 768 ? 30 : 60;
    
    const config = {
        "particles": {
            "number": {
                "value": numParticles,
                "density": { "enable": true, "value_area": 800 }
            },
            "color": { "value": isDark ? ["#38bdf8", "#818cf8"] : ["#2563eb", "#4f46e5"] },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.4 },
            "size": { "value": 3, "random": true },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": isDark ? "#38bdf8" : "#2563eb",
                "opacity": 0.2,
                "width": 1
            },
            "move": { "enable": true, "speed": 1.5, "direction": "none" }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 150, "line_linked": { "opacity": 0.8 } },
                "push": { "particles_nb": 3 }
            }
        },
        "retina_detect": true
    };
    
    if(window.particlesJS) {
        particlesJS('particles-js', config);
    }
}
