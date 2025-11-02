// RFID Child Safety Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Add active class styles
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            background-color: var(--color-primary) !important;
            color: var(--color-btn-primary-text) !important;
        }
    `;
    document.head.appendChild(style);

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .product-card, .application-card, .spec-category, .benefit-item, .step');
    animateElements.forEach(el => observer.observe(el));

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add notification styles
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--color-surface);
                border: 1px solid var(--color-card-border);
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform var(--duration-normal) var(--ease-standard);
                max-width: 400px;
                min-width: 300px;
            }
            
            .notification--success {
                border-left: 4px solid var(--color-success);
            }
            
            .notification--error {
                border-left: 4px solid var(--color-error);
            }
            
            .notification--info {
                border-left: 4px solid var(--color-info);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--space-16);
            }
            
            .notification-message {
                color: var(--color-text);
                font-size: var(--font-size-sm);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--color-text-secondary);
                cursor: pointer;
                font-size: var(--font-size-lg);
                padding: 0;
                margin-left: var(--space-12);
            }
            
            .notification-close:hover {
                color: var(--color-text);
            }
            
            .notification.show {
                transform: translateX(0);
            }
        `;

        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'notification-styles';
            styleElement.textContent = notificationStyles;
            document.head.appendChild(styleElement);
        }

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.classList.contains('show')) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--color-surface)';
            header.style.backdropFilter = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Statistics counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-card h3');
        
        counters.forEach(counter => {
            const text = counter.textContent;
            const number = parseFloat(text.replace(/[^0-9.]/g, ''));
            
            if (number && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                const suffix = text.replace(/[0-9.]/g, '');
                const increment = number / 60;
                let currentNumber = 0;
                
                const timer = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= number) {
                        counter.textContent = text;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(currentNumber) + suffix;
                    }
                }, 50);
            }
        });
    }

    // Observe statistics section for counter animation
    const statsSection = document.querySelector('.market-trends');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // Form validation
    function validateForm() {
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        
        let isValid = true;
        
        // Name validation
        if (nameField && nameField.value.trim().length < 2) {
            showFieldError(nameField, 'Name must be at least 2 characters long');
            isValid = false;
        } else if (nameField) {
            clearFieldError(nameField);
        }
        
        // Email validation
        if (emailField) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearFieldError(emailField);
            }
        }
        
        // Phone validation (optional, but if filled should be valid)
        if (phoneField && phoneField.value.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phoneField.value.replace(/[\s\-\(\)]/g, ''))) {
                showFieldError(phoneField, 'Please enter a valid phone number');
                isValid = false;
            } else {
                clearFieldError(phoneField);
            }
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--color-error)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--space-4)';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = 'var(--color-error)';
    }
    
    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    // Add real-time validation to form fields
    const formFields = ['name', 'email', 'phone'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                validateForm();
            });
            
            field.addEventListener('input', function() {
                clearFieldError(field);
            });
        }
    });

    // Update form submit handler with validation
    if (contactForm) {
        contactForm.removeEventListener('submit', contactForm.submitHandler);
        contactForm.submitHandler = function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                showNotification('Please correct the errors in the form before submitting.', 'error');
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        };
        
        contactForm.addEventListener('submit', contactForm.submitHandler);
    }

    // Scroll to top functionality
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '↑';
    scrollTopButton.className = 'scroll-to-top';
    scrollTopButton.setAttribute('aria-label', 'Scroll to top');
    
    // Add scroll to top button styles
    const scrollTopStyles = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: var(--color-primary);
            color: var(--color-btn-primary-text);
            border: none;
            border-radius: 50%;
            font-size: var(--font-size-xl);
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all var(--duration-normal) var(--ease-standard);
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        }
        
        .scroll-to-top:hover {
            background-color: var(--color-primary-hover);
            transform: translateY(-2px);
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
    `;
    
    // Add styles
    const scrollTopStyleElement = document.createElement('style');
    scrollTopStyleElement.textContent = scrollTopStyles;
    document.head.appendChild(scrollTopStyleElement);
    
    // Add button to page
    document.body.appendChild(scrollTopButton);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top functionality
    scrollTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initialize all animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    console.log('RFID Child Safety website initialized successfully!');
});