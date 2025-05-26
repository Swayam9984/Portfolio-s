document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const toggleIcon = themeToggleButton ? themeToggleButton.querySelector('i') : null;

    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-sun');
                toggleIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'light');
        } else { // 'dark'
            body.classList.remove('light-mode');
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-moon');
                toggleIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'dark');
        }
    }

    if (themeToggleButton && toggleIcon) {
        let initialTheme = localStorage.getItem('theme');
        if (!initialTheme) {
            initialTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        setTheme(initialTheme);

        themeToggleButton.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        });
    }

    // --- Intersection Observer for Animations ---
    const animatedElements = document.querySelectorAll('.animated-section, .animated-item, .animated-text-reveal, .timeline-item');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // Unobserve after first animation
            }
        });
    }, observerOptions);
    animatedElements.forEach(el => observer.observe(el));

    // --- Smooth Scroll for Nav Links & Header State ---
    const header = document.querySelector('header');
    const navLinksForScroll = document.querySelectorAll('nav a[href^="#"], .hero-buttons a[href^="#"]');

    function handleScroll() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    navLinksForScroll.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = header ? header.offsetHeight + 20 : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-links');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // --- Contact Form Submission (Formspree) ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (contactForm && formStatus) { // Ensure formStatus exists
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(contactForm);
            formStatus.textContent = 'Sending...';
            formStatus.style.color = 'var(--secondary-color)';
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    formStatus.textContent = 'Thanks! Your message has been sent.';
                    formStatus.style.color = 'var(--accent-color)';
                    contactForm.reset();
                    setTimeout(() => { formStatus.textContent = ''; }, 5000);
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = 'Oops! There was a problem submitting your form.';
                    }
                    formStatus.style.color = '#e74c3c'; // Error red
                }
            } catch (error) {
                console.error("Form submission error:", error);
                formStatus.textContent = 'Oops! There was a network error. Please try again.';
                formStatus.style.color = '#e74c3c'; // Error red
            }
        });
    }

    // --- Role Text Animation ---
    const roleTextElement = document.getElementById('roleText');
    if (roleTextElement) {
        const roleSpan = roleTextElement.querySelector('.role-span');
        const roles = [
            { text: "Full-Stack Developer", colorClass: "color-1", pulse: true },
            { text: "WordPress Developer", colorClass: "color-2", pulse: false },
            { text: "UI/UX Enthusiast", colorClass: "color-3", pulse: false },
            { text: "Tech Innovator", colorClass: "color-1", pulse: false }
        ];
        let currentRoleIndex = 0;
        const changeInterval = 3000;
        const animationDuration = 500; // Matches role-span transition

        function updateRole() {
            if (!roleSpan) return;
            roleSpan.classList.remove('visible');
            // Keep pulse if the next role has it, remove if not
            if (!roles[(currentRoleIndex + 1) % roles.length].pulse) {
                roleSpan.classList.remove('pulse');
            }

            setTimeout(() => {
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
                const nextRole = roles[currentRoleIndex];
                roleSpan.textContent = nextRole.text;
                // Clear old color classes before adding new one
                roles.forEach(r => roleSpan.classList.remove(r.colorClass));
                roleSpan.classList.add(nextRole.colorClass);

                // Add visible class to trigger transition
                roleSpan.classList.add('visible');
                if (nextRole.pulse) {
                    roleSpan.classList.add('pulse');
                }
            }, animationDuration); // Wait for fade out before changing text
        }

        // Initial setup for the first role
        if (roleSpan && roles.length > 0) {
            // Delay to sync with animated-text-reveal if present
            let initialDelay = 0;
            if (roleTextElement.classList.contains('animated-text-reveal')) {
                // Ensure getComputedStyle doesn't throw error if element/pseudo-element is not fully ready
                try {
                    const parentRevealDelay = parseFloat(getComputedStyle(roleTextElement).getPropertyValue('transition-delay') || '0s') * 1000;
                    const textRevealCoverDuration = parseFloat(getComputedStyle(roleTextElement, '::before').getPropertyValue('transition-duration') || '0.85s') * 1000;
                    const textAppearDelay = parseFloat(getComputedStyle(roleSpan).getPropertyValue('transition-delay') || '0.45s') * 1000;
                    initialDelay = parentRevealDelay + textRevealCoverDuration + textAppearDelay + 100;
                } catch(e) {
                    initialDelay = 1000; // Fallback delay if computed styles aren't available
                }
            } else { // Fallback if not using animated-text-reveal
                 initialDelay = 500;
            }

            setTimeout(() => {
                roleSpan.textContent = roles[0].text;
                roleSpan.classList.add(roles[0].colorClass);
                roleSpan.classList.add('visible');
                if (roles[0].pulse) {
                    roleSpan.classList.add('pulse');
                }
                setInterval(updateRole, changeInterval + animationDuration);
            }, initialDelay);
        }
    }

    // --- Chatbot UI Logic ---
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbotButton = document.getElementById('closeChatbot');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');

    if (chatbotToggle && chatbotWindow && closeChatbotButton && chatbotMessages && chatbotInput && chatbotSend) {
        const toggleIconElement = chatbotToggle.querySelector('i');

        function toggleChatbot() {
            const isOpen = chatbotWindow.classList.toggle('open');
            if (isOpen) {
                if (toggleIconElement) {
                    toggleIconElement.classList.remove('fa-comments');
                    toggleIconElement.classList.add('fa-times');
                }
                chatbotInput.focus();
            } else {
                 if (toggleIconElement) {
                    toggleIconElement.classList.remove('fa-times');
                    toggleIconElement.classList.add('fa-comments');
                }
            }
        }

        chatbotToggle.addEventListener('click', toggleChatbot);
        closeChatbotButton.addEventListener('click', toggleChatbot);

        function addMessageToChatUI(text, senderType) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');

            if (senderType === 'user') {
                messageDiv.classList.add('user-message');
            } else if (senderType === 'bot-error') {
                 messageDiv.classList.add('bot-message', 'error');
            } else {
                 messageDiv.classList.add('bot-message');
            }
            // Sanitize text before adding to prevent XSS, if necessary, or use textContent.
            // For this simple chatbot, textContent is fine.
            messageDiv.textContent = text;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        async function getBotResponse(userInput) {
            addMessageToChatUI("Thinking...", "bot");
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

            const thinkingMessages = chatbotMessages.querySelectorAll('.bot-message');
            if (thinkingMessages.length > 0) {
                const lastBotMessage = thinkingMessages[thinkingMessages.length -1];
                if(lastBotMessage.textContent === "Thinking...") {
                    lastBotMessage.remove();
                }
            }

            let reply = "I'm here to provide information about Swayam. How can I help you regarding his profile, skills, or projects?";
            const lowerInput = userInput.toLowerCase();

            if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
                reply = "Hello there! How can I assist you with information about Swayam today?";
            } else if (lowerInput.includes("name") || lowerInput.includes("who is swayam")) {
                reply = "This is the portfolio of Swayam Patwa, a passionate Full-Stack Developer and Tech Innovator.";
            } else if (lowerInput.includes("contact") && (lowerInput.includes("phone") || lowerInput.includes("number"))) {
                reply = "You can reach Swayam at +91 95553 63996.";
            } else if (lowerInput.includes("email") || lowerInput.includes("mail")) {
                reply = "Swayam's email is swayampatwa17@gmail.com.";
            } else if (lowerInput.includes("address") || lowerInput.includes("location")) {
                reply = "Swayam is based in Shastri Nagar, Jabalpur, Madhya Pradesh, India.";
            } else if (lowerInput.includes("skill") || lowerInput.includes("tech") || lowerInput.includes("expert")) {
                reply = "Swayam's key skills include JavaScript, React, Node.js, Python, C++, AI Tools, and WordPress. Check out the 'About' section for more!";
            } else if (lowerInput.includes("education") || lowerInput.includes("study") || lowerInput.includes("college")) {
                reply = "Swayam is pursuing a B.Tech in Computer Science from Rajiv Gandhi Proudyogiki Vishwavidyalaya (2022-2026). See the 'Education' section for details.";
            } else if (lowerInput.includes("hackathon") || lowerInput.includes("achievement")) {
                reply = "Swayam has actively participated in hackathons like SIH 2024 (Finalist) and was a Winner at Codactive 3.0. More details are in the 'About' section.";
            } else if (lowerInput.includes("project")) {
                reply = "Swayam has developed projects like an E-Learning Platform, a Health Care solution, and an Intelligent Chatbot. You can find these in the 'Projects' section with links to code and demos.";
            } else if (lowerInput.includes("cv") || lowerInput.includes("resume")) {
                const cvButton = document.querySelector('.cta-button-outline[href="cv.pdf"]'); // More specific selector
                if (cvButton) {
                    reply = "You can download Swayam's CV using the 'Download CV' button in the Home section. (This chatbot can't trigger downloads).";
                } else {
                    reply = "The CV download link should be in the Home section. If you can't find it, please let Swayam know!";
                }
            } else if (lowerInput.includes("thank")) {
                reply = "You're most welcome! Is there anything else?";
            } else if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
                reply = "Goodbye! Feel free to reach out if you have more questions.";
            } else {
                const genericReplies = [
                    "That's an interesting question! For specifics about Swayam's work, you might find details in the relevant sections of the portfolio.",
                    "I can primarily share information about Swayam's skills, projects, and experience. What aspect are you interested in?",
                    "To know more about that, please check Swayam's projects or contact him directly through the form!"
                ];
                reply = genericReplies[Math.floor(Math.random() * genericReplies.length)];
            }

            addMessageToChatUI(reply, "bot");
        }

        async function handleSend() {
            const userText = chatbotInput.value.trim();
            if (userText) {
                addMessageToChatUI(userText, "user");
                chatbotInput.value = "";
                await getBotResponse(userText);
            }
        }

        chatbotSend.addEventListener('click', handleSend);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
         // Initial greeting from bot
        setTimeout(() => {
            addMessageToChatUI("Hi! I'm Swayam's AI assistant. How can I help you explore his portfolio today?", "bot");
        }, 1500);
    }

    // --- Update Footer Year ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

  // --- Custom Cursor JS - Enhanced "Quantum Trail" ---
    const cursorCore = document.querySelector('.custom-cursor-core');
    const cursorAura = document.querySelector('.custom-cursor-aura');
    const particleContainer = document.body;

    // Check for prefers-reduced-motion
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        prefersReducedMotion = e.matches;
        if (prefersReducedMotion) {
            if (cursorCore) cursorCore.style.display = 'none';
            if (cursorAura) cursorAura.style.display = 'none';
            document.body.style.cursor = 'auto';
            document.querySelectorAll('.particle').forEach(p => p.remove());
        } else {
            if (!isTouchDevice()) {
                 if (cursorCore) cursorCore.style.display = '';
                 if (cursorAura) cursorAura.style.display = '';
                 document.body.style.cursor = 'none';
            }
        }
    });


    if (cursorCore && cursorAura) {
        let mouseX = 0;
        let mouseY = 0;
        let coreX = 0, coreY = 0;
        let auraX = 0, auraY = 0;
        let lastParticleTime = 0;
        const particleThrottleInterval = 50; // Milliseconds, adjust for more/less particles

        const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice() && !prefersReducedMotion) {
            document.body.style.cursor = 'none';

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                const currentTime = Date.now();
                if (!prefersReducedMotion && (currentTime - lastParticleTime > particleThrottleInterval)) {
                    if (Math.random() > 0.6) { // Further randomize particle creation
                        createParticle(mouseX, mouseY);
                    }
                    lastParticleTime = currentTime;
                }
            });

            function traceCursor() {
                if (prefersReducedMotion) {
                    requestAnimationFrame(traceCursor); // Still need to call to stop if motion is re-enabled
                    return;
                }

                coreX += (mouseX - coreX) * 0.8;
                coreY += (mouseY - coreY) * 0.8;
                if (cursorCore) {
                    cursorCore.style.transform = `translate(${coreX - cursorCore.offsetWidth / 2}px, ${coreY - cursorCore.offsetHeight / 2}px) scale(${cursorCore.classList.contains('clicked') ? 0.5 : (document.body.classList.contains('interactive-hover') ? 0.6 : 1.3 * Math.sin(Date.now() / 500) * 0.15 + 1)})`;
                }

                auraX += (mouseX - auraX) * 0.18;
                auraY += (mouseY - auraY) * 0.18;
                if (cursorAura && !cursorAura.classList.contains('clicked-burst')) {
                     const auraBaseScale = document.body.classList.contains('interactive-hover') ? 1.15 : 1;
                     const auraPulseScale = 1 + Math.sin(Date.now() / 700) * 0.05;
                    cursorAura.style.transform = `translate(${auraX - cursorAura.offsetWidth / 2}px, ${auraY - cursorAura.offsetHeight / 2}px) scale(${auraBaseScale * auraPulseScale})`;
                }
                requestAnimationFrame(traceCursor);
            }
            requestAnimationFrame(traceCursor);

            function createParticle(x, y) {
                if (prefersReducedMotion) return;

                const particle = document.createElement('div');
                particle.classList.add('particle');

                const size = Math.random() * 5 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;

                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = (Math.random() - 0.5) * 20;
                particle.style.left = `${x + offsetX}px`;
                particle.style.top = `${y + offsetY}px`;

                const endX = (Math.random() - 0.5) * (Math.random() * 60 + 40);
                const endY = (Math.random() - 0.5) * (Math.random() * 60 + 40);
                particle.style.setProperty('--particle-end-x', `${endX}px`);
                particle.style.setProperty('--particle-end-y', `${endY}px`);

                const duration = Math.random() * 0.8 + 0.5;
                particle.style.animation = `particle-fade-out ${duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;

                particleContainer.appendChild(particle);

                particle.addEventListener('animationend', () => {
                    particle.remove();
                });
            }

            const hoverTargets = document.querySelectorAll(
                'a, button, .project-card, .timeline-icon, .skills-list span, .stat-box, input[type="text"], textarea, input[type="email"], .cta-button, .cta-button-outline, .nav-links li a, .project-link, .menu-toggle, .chatbot-toggle-button, #chatbotSend, #closeChatbot, .chatbot-close-button-window, .theme-toggle-button'
            );

            hoverTargets.forEach(target => {
                target.addEventListener('mouseenter', () => {
                    if (!prefersReducedMotion) document.body.classList.add('interactive-hover');
                });
                target.addEventListener('mouseleave', () => {
                    if (!prefersReducedMotion) document.body.classList.remove('interactive-hover');
                });
            });

            document.addEventListener('mousedown', () => {
                 if (prefersReducedMotion) return;
                 if(cursorCore) cursorCore.classList.add('clicked');
                 if(cursorAura) {
                    cursorAura.classList.add('clicked-burst');
                    setTimeout(() => {
                        cursorAura.classList.remove('clicked-burst');
                        if (cursorAura && cursorAura.offsetWidth) { // Check if element is still in DOM / visible
                            cursorAura.style.transform = `translate(${auraX - cursorAura.offsetWidth / 2}px, ${auraY - cursorAura.offsetHeight / 2}px) scale(${document.body.classList.contains('interactive-hover') ? 1.15 : 1})`;
                            cursorAura.style.opacity = document.body.classList.contains('interactive-hover') ? 0.85 : 0.6;
                        }
                    }, 300);
                 }
            });
            document.addEventListener('mouseup', () => {
                if (prefersReducedMotion) return;
                if(cursorCore) cursorCore.classList.remove('clicked');
            });

        } else {
            if(cursorCore) cursorCore.style.display = 'none';
            if(cursorAura) cursorAura.style.display = 'none';
            document.body.style.cursor = 'auto';
        }
    }
});