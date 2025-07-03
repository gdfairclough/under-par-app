// Enhanced JavaScript for Under Par marketing website

document.addEventListener('DOMContentLoaded', function() {
    
    // Fix button styles immediately to prevent FOUC
    fixButtonStyles();
    
    // Add animation completion handler for Safari pseudo-element fix
    handleButtonAnimationComplete();
    
    // Initialize loading animations
    initializeLoadingAnimations();
    
    // Initialize screenshots showcase
    initializeScreenshotsShowcase();
    
    // Initialize language dropdown
    initializeLanguageDropdown();
    
    // Enhanced smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 50; // Account for any fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add a subtle flash effect to the target section
                targetSection.style.transition = 'background-color 0.3s ease';
                targetSection.style.backgroundColor = 'rgba(45, 124, 49, 0.05)';
                setTimeout(() => {
                    targetSection.style.backgroundColor = '';
                }, 300);
            }
        });
    });
    
    // Initialize intersection observer for loading animations
    function initializeLoadingAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    // Add staggered animation delay for grid items
                    if (entry.target.classList.contains('feature-card') || 
                        entry.target.classList.contains('social-feature')) {
                        const siblings = Array.from(entry.target.parentNode.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe all elements with loading class
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize screenshots showcase functionality
    function initializeScreenshotsShowcase() {
        const screenshots = document.querySelectorAll('.screenshot');
        const thumbnails = document.querySelectorAll('.thumbnail');
        let currentIndex = 0;
        let autoSlideInterval;
        
        // Function to show specific screenshot
        function showScreenshot(index) {
            // Hide all screenshots
            screenshots.forEach(screenshot => {
                screenshot.classList.remove('active');
            });
            
            // Remove active class from all thumbnails
            thumbnails.forEach(thumbnail => {
                thumbnail.classList.remove('active');
            });
            
            // Show selected screenshot and thumbnail
            if (screenshots[index] && thumbnails[index]) {
                screenshots[index].classList.add('active');
                thumbnails[index].classList.add('active');
                currentIndex = index;
            }
            
            // Track screenshot view
            trackEvent('screenshot_viewed', {
                screenshot_index: index,
                screenshot_name: thumbnails[index]?.querySelector('span')?.textContent || 'Unknown'
            });
        }
        
        // Initialize with first screenshot visible
        if (screenshots.length > 0 && thumbnails.length > 0) {
            showScreenshot(0);
        }
        
        // Add click handlers to thumbnails
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', function() {
                showScreenshot(index);
                stopAutoSlide();
                startAutoSlide(); // Restart auto-slide
            });
            
            // Add hover effect
            thumbnail.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateX(5px) scale(1.05)';
                }
            });
            
            thumbnail.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = '';
                }
            });
        });
        
        // Auto-slide functionality
        function nextScreenshot() {
            const nextIndex = (currentIndex + 1) % screenshots.length;
            showScreenshot(nextIndex);
        }
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextScreenshot, 5000); // Change every 5 seconds
        }
        
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        }
        
        // Start auto-slide if screenshots exist
        if (screenshots.length > 1) {
            startAutoSlide();
            
            // Pause auto-slide when hovering over screenshots
            const screenshotsSection = document.querySelector('.screenshots-showcase');
            if (screenshotsSection) {
                screenshotsSection.addEventListener('mouseenter', stopAutoSlide);
                screenshotsSection.addEventListener('mouseleave', startAutoSlide);
            }
        }
        
        // Keyboard navigation for screenshots
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const screenshotsSection = document.querySelector('.screenshots');
                const rect = screenshotsSection.getBoundingClientRect();
                
                // Only handle keyboard if screenshots are visible
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    e.preventDefault();
                    stopAutoSlide();
                    
                    if (e.key === 'ArrowLeft') {
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : screenshots.length - 1;
                        showScreenshot(prevIndex);
                    } else if (e.key === 'ArrowRight') {
                        nextScreenshot();
                    }
                    
                    startAutoSlide();
                }
            }
        });
    }
    
    // Initialize language dropdown functionality
    function initializeLanguageDropdown() {
        const languageDropdown = document.querySelector('.language-dropdown');
        const languageToggle = document.querySelector('.language-toggle');
        const languageMenu = document.querySelector('.language-menu');
        
        if (!languageDropdown || !languageToggle || !languageMenu) {
            return;
        }
        
        // Toggle dropdown on button click
        languageToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown.classList.toggle('open');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('open');
            }
        });
        
        // Close dropdown when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                languageDropdown.classList.remove('open');
            }
        });
        
        // Close dropdown after selecting a language
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                languageDropdown.classList.remove('open');
                
                // Track language change
                trackEvent('language_changed', {
                    from_language: document.querySelector('.language-option.current')?.textContent || 'Unknown',
                    to_language: this.textContent,
                    user_agent: navigator.userAgent
                });
            });
        });
    }
    
    // Fix button styles immediately to prevent FOUC
    function fixButtonStyles() {
        // Detect Safari
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (isSafari) {
            document.body.classList.add('safari-browser');
        }
        
        const secondaryButtons = document.querySelectorAll('.btn-secondary');
        secondaryButtons.forEach(button => {
            button.style.background = 'rgba(255, 255, 255, 0.1)';
            button.style.backgroundImage = 'none';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            button.style.boxShadow = 'none';
            button.style.overflow = 'hidden';
            
            // Safari-specific fixes
            if (isSafari) {
                button.style.webkitTransform = 'translateZ(0)';
                button.style.webkitBackfaceVisibility = 'hidden';
                button.style.willChange = 'transform';
                button.style.webkitBackgroundClip = 'padding-box';
                
                // Force pseudo-element removal in Safari
                const style = document.createElement('style');
                style.textContent = `
                    .safari-browser .btn-secondary::before,
                    .safari-browser .btn.btn-secondary::before {
                        display: none !important;
                        content: none !important;
                        opacity: 0 !important;
                        -webkit-transform: scale(0) !important;
                        transform: scale(0) !important;
                        visibility: hidden !important;
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
    
    // Handle button animation completion for Safari pseudo-element fix
    function handleButtonAnimationComplete() {
        const heroButtons = document.querySelector('.hero-buttons');
        if (!heroButtons) return;
        
        // Wait for the animation to complete (0.2s delay + 0.6s duration = 0.8s total)
        setTimeout(() => {
            heroButtons.classList.add('animation-complete');
        }, 1000); // Adding extra buffer for safety
        
        // Also listen for the animation end event
        heroButtons.addEventListener('animationend', function() {
            this.classList.add('animation-complete');
        });
    }
    
    // Enhanced download button interaction (App Store button)
    const appStoreBtn = document.querySelector('.app-store-btn');
    if (appStoreBtn) {
        appStoreBtn.addEventListener('click', function(e) {
            // Add ripple effect without preventing default link behavior
            createRippleEffect(this, e);
            
            // Track the click
            trackEvent('app_store_download_click', {
                location: 'download_section',
                button_type: 'official_app_store',
                version: '2.0'
            });
        });
        
        // Add enhanced hover effect for App Store button
        appStoreBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        appStoreBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
    
    // Create ripple effect for buttons
    function createRippleEffect(button, event) {
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');
        
        // Add ripple styles
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.transform = 'scale(0)';
        circle.style.animation = 'ripple 0.6s linear';
        circle.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        circle.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(circle);
        
        setTimeout(() => {
            circle.remove();
        }, 600);
    }
    
    // Add ripple animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Enhanced analytics tracking
    function trackEvent(eventName, eventData) {
        console.log('🎯 Event tracked:', eventName, eventData);
        
        // In production, you might use:
        // gtag('event', eventName, eventData);
        // or analytics.track(eventName, eventData);
        // or mixpanel.track(eventName, eventData);
    }
    
    // Track all button interactions with enhanced data
    document.querySelectorAll('.btn, .app-store-btn, .thumbnail').forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim();
            const section = this.closest('section')?.className || 'unknown';
            
            trackEvent('button_click', {
                button_text: btnText,
                section: section,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent
            });
        });
    });
    
    // Enhanced scroll effects
    let lastScrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.floating-golf-ball');
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollProgress = currentScrollY / window.innerHeight;
        
        // Hero parallax effect
        if (hero) {
            const opacity = Math.max(0, 1 - (currentScrollY / (hero.offsetHeight * 0.7)));
            hero.style.opacity = opacity;
            
            // Parallax for hero visual
            const heroVisual = hero.querySelector('.hero-visual');
            if (heroVisual) {
                heroVisual.style.transform = `translateY(-50%) translateX(${currentScrollY * 0.2}px)`;
            }
        }
        
        // Floating elements parallax
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = currentScrollY * speed;
            element.style.transform = `translateY(${yPos}px) rotate(${yPos * 0.1}deg)`;
        });
        
        // Screenshots showcase parallax effect
        const screenshotsDisplay = document.querySelector('.screenshot-display');
        if (screenshotsDisplay) {
            const rect = screenshotsDisplay.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const parallaxY = (window.innerHeight - rect.top) * 0.05;
                screenshotsDisplay.style.transform = `translateY(${parallaxY}px)`;
            }
        }
        
        // Add scroll direction class to body
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            document.body.classList.add('scrolling-down');
            document.body.classList.remove('scrolling-up');
        } else if (currentScrollY < lastScrollY) {
            document.body.classList.add('scrolling-up');
            document.body.classList.remove('scrolling-down');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttled scroll handler for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // ~60fps
        }
    });
    
    // Enhanced feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            
            // Add glow effect to icon
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.filter = 'drop-shadow(0 0 20px rgba(45, 124, 49, 0.3))';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.filter = '';
            }
        });
    });
    
    // Add keyboard navigation support with visual feedback
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Add space/enter support for buttons
        if ((e.key === ' ' || e.key === 'Enter') && 
            (e.target.classList.contains('btn') || 
             e.target.classList.contains('app-store-btn') || 
             e.target.classList.contains('thumbnail'))) {
            e.preventDefault();
            e.target.click();
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add focus styles for keyboard navigation
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .keyboard-navigation *:focus {
            outline: 3px solid #2D7C31 !important;
            outline-offset: 2px !important;
        }
        
        .keyboard-navigation .btn:focus,
        .keyboard-navigation .app-store-btn:focus,
        .keyboard-navigation .thumbnail:focus {
            box-shadow: 0 0 0 3px rgba(45, 124, 49, 0.3) !important;
        }
    `;
    document.head.appendChild(focusStyle);
    
    // Simple performance monitoring
    function logPerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('⚡ Performance metrics:', {
                load_time: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                dom_ready: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                page_load: Math.round(perfData.loadEventEnd - perfData.fetchStart)
            });
        }
    }
    
    // Log performance after page load
    window.addEventListener('load', () => {
        setTimeout(logPerformance, 1000);
    });
    
    // Add subtle mouse follow effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            this.style.background = `
                radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.1) 0%, transparent 50%),
                linear-gradient(135deg, #2D7C31 0%, #4CAF50 30%, #BE95E3 70%, #9C27B0 100%)
            `;
        });
        
        heroSection.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #2D7C31 0%, #4CAF50 30%, #BE95E3 70%, #9C27B0 100%)';
        });
    }
    
    // Add Easter egg for golf enthusiasts
    let clickCount = 0;
    const title = document.querySelector('.hero-title');
    if (title) {
        title.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 5) {
                this.style.transform = 'rotate(360deg)';
                this.style.transition = 'transform 1s ease';
                console.log('🏌️‍♂️ You found the Easter egg! You must really love golf!');
                
                // Add confetti effect
                createConfetti();
                
                setTimeout(() => {
                    this.style.transform = '';
                    clickCount = 0;
                }, 1000);
            }
        });
    }
    
    // Simple confetti effect for Easter egg
    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.background = ['#2D7C31', '#BE95E3', '#FFD700'][Math.floor(Math.random() * 3)];
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.borderRadius = '50%';
                confetti.style.animation = 'confetti-fall 3s linear forwards';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    }
    
    // Add confetti animation
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confetti-fall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyle);
    
    console.log('🏌️‍♂️ Under Par website loaded with enhanced flair and screenshots showcase! Ready to play some golf!');
}); 