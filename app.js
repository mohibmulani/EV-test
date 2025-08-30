// EV Overseas Website JavaScript - Updated with Enhanced Features

document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
    
        lastScrollTop = scrollTop;
        // Add background to navbar on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(252, 252, 249, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'var(--color-surface)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        // Handle floating buttons scroll visibility
        handleFloatingButtonsScroll();
    });
    
    // Enhanced Floating Buttons Functionality
    function handleFloatingButtonsScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollThreshold = 300;
        
        // Show/hide counselling button
        const counsellingFloat = document.getElementById('counsellingFloat');
        if (counsellingFloat) {
            if (scrollTop > scrollThreshold) {
                counsellingFloat.classList.add('show');
            } else {
                counsellingFloat.classList.remove('show');
            }
        }
        
        // Show/hide WhatsApp button
        const whatsappFloat = document.querySelector('.whatsapp-btn');
        if (whatsappFloat) {
            if (scrollTop > scrollThreshold) {
                whatsappFloat.classList.add('show');
            } else {
                whatsappFloat.classList.remove('show');
            }
        }
    }
    
    // Initialize floating buttons
    function initFloatingButtons() {
        const counsellingFloat = document.getElementById('counsellingFloat');
        const whatsappFloat = document.querySelector('.whatsapp-float');
        
        if (counsellingFloat) {
            counsellingFloat.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Check if we're on the blog page or another page
                if (window.location.pathname.includes('blog.html')) {
                    // Navigate to index.html with contact section
                    window.location.href = 'index.html#contact';
                } else {
                    // Smooth scroll to contact section on current page
                    smoothScrollTo('contact');
                }
                
                // Track event
                trackEvent('counselling_button_click', {
                    page_section: 'floating_button',
                    button_text: 'Get Free Counselling'
                });
            });
        }
        
        if (whatsappFloat) {
            whatsappFloat.addEventListener('click', function() {
                trackEvent('whatsapp_button_click', {
                    page_section: 'floating_button',
                    button_text: 'WhatsApp'
                });
            });
        }
    }
    
    // Initialize floating buttons
    initFloatingButtons();
    
    // Fix smooth scrolling for all navigation links
    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Handle all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });
    
    // Fix CTA buttons functionality
    const ctaButtons = document.querySelectorAll('.nav-cta');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.location.pathname.includes('blog.html')) {
                window.location.href = 'index.html#contact';
            } else {
                smoothScrollTo('contact');
            }
        });
    });
    
    // Fix hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const btnText = this.textContent.toLowerCase();
            if (btnText.includes('counseling') || btnText.includes('consultation')) {
                smoothScrollTo('contact');
            } else if (btnText.includes('services')) {
                smoothScrollTo('services');
            }
        });
    });
    
    // Contact Form Handling with improved validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form before submission
            if (!validateForm()) {
                return;
            }
    
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
    
            // Submit form to Google Sheets
            submitFormToGoogleSheets(data)
                .then(response => {
                    showMessage('Thank you! Your application has been submitted successfully. We will contact you soon.', 'success');
                    contactForm.reset();
                })
                .catch(error => {
                    showMessage('Sorry, there was an error submitting your form. Please try again or contact us directly at +91-9666963756.', 'error');
                    console.error('Form submission error:', error);
                })
                .finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Enhanced Blog Page Functionality
    if (window.location.pathname.includes('blog.html') || document.body.classList.contains('blog-page')) {
        
        // Blog Category Filter
        const categoryCards = document.querySelectorAll('.category-card');
        const blogCards = document.querySelectorAll('.blog-card[data-category]');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all categories
                categoryCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked category
                this.classList.add('active');
                
                const selectedCategory = this.getAttribute('data-category');
                
                // Filter blog cards
                blogCards.forEach(blogCard => {
                    const cardCategory = blogCard.getAttribute('data-category');
                    
                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        blogCard.style.display = 'block';
                        blogCard.classList.add('fade-in');
                    } else {
                        blogCard.style.display = 'none';
                        blogCard.classList.remove('fade-in');
                    }
                });
                
                // Track category filter usage
                trackEvent('blog_category_filter', {
                    page_section: 'blog',
                    button_text: selectedCategory
                });
            });
        });
        
        // Enhanced Blog Article Expansion
        const blogReadMoreLinks = document.querySelectorAll('.blog-read-more');
        blogReadMoreLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const blogCard = this.closest('.blog-card');
                const articleTitle = blogCard.querySelector('h3').textContent;
                const articleExcerpt = blogCard.querySelector('p').textContent;
                const articleCategory = blogCard.querySelector('.blog-category').textContent;
                
                // Create and show full article modal
                showArticleModal(articleTitle, articleExcerpt, articleCategory);
                
                // Track article view
                trackEvent('blog_article_view', {
                    page_section: 'blog',
                    article_title: articleTitle
                });
            });
        });
        
        // Newsletter Subscription
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = this.querySelector('input[type="email"]');
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                // Show loading state
                submitBtn.textContent = 'Subscribing...';
                submitBtn.disabled = true;
                
                // Simulate subscription process
                setTimeout(() => {
                    showMessage('Thank you for subscribing! You will receive our latest articles and updates.', 'success');
                    emailInput.value = '';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Track newsletter subscription
                    trackEvent('newsletter_subscribe', {
                        page_section: 'blog',
                        button_text: 'Subscribe'
                    });
                }, 1000);
            });
        }
    }
    
    // Article Modal Creation for Full Reading Experience
    function showArticleModal(title, excerpt, category) {
        // Remove existing modal if any
        const existingModal = document.getElementById('articleModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Full article content (you can expand this with actual content)
        const fullContent = generateFullArticleContent(title, excerpt, category);
        
        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'articleModal';
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="article-modal-content">
                <div class="article-modal-header">
                    <button class="article-modal-close" aria-label="Close article">&times;</button>
                </div>
                <div class="article-modal-body">
                    <div class="article-category">${category}</div>
                    <h1 class="article-title">${title}</h1>
                    <div class="article-meta">
                        <span>EV Overseas Team</span> • 
                        <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span> • 
                        <span>8 min read</span>
                    </div>
                    <div class="article-content">
                        ${fullContent}
                    </div>
                    <div class="article-footer">
                        <h3>Ready to Start Your Study Abroad Journey?</h3>
                        <p>Get personalized guidance from our expert counselors at EV Overseas</p>
                        <div class="article-cta-buttons">
                            <button class="btn btn--primary" onclick="closeArticleModal(); smoothScrollTo('contact')">Get Free Consultation</button>
                            <a href="tel:+919666963756" class="btn btn--outline">Call Now</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Add event listeners
        const closeBtn = modal.querySelector('.article-modal-close');
        closeBtn.addEventListener('click', closeArticleModal);
        
        // Close on backdrop click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeArticleModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeArticleModal();
            }
        });
        
        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }
    
    // Generate full article content based on title and category
    function generateFullArticleContent(title, excerpt, category) {
        const contentTemplates = {
            'Universities': `
                <p>${excerpt}</p>
                <h2>Top University Selection Criteria</h2>
                <p>When choosing a university for your overseas education, several factors should guide your decision-making process. These include academic reputation, program rankings, research opportunities, and campus culture.</p>
                <h3>Academic Excellence</h3>
                <p>Look for universities with strong academic programs in your field of interest. Check faculty credentials, research output, and industry partnerships that can enhance your learning experience.</p>
                <h3>Financial Considerations</h3>
                <p>Consider tuition fees, living costs, and available scholarships. Many universities offer merit-based and need-based financial aid for international students.</p>
                <h3>Location and Campus Life</h3>
                <p>The university's location affects your overall experience. Consider climate, cultural diversity, internship opportunities, and post-graduation job prospects in the area.</p>
                <blockquote>
                    <p>"Choosing the right university is not just about rankings, but finding the perfect fit for your academic goals and personal growth." - EV Overseas Counseling Team</p>
                </blockquote>
                <h2>Application Timeline</h2>
                <p>Start your application process at least 12-18 months before your intended start date. This allows time for standardized tests, document preparation, and visa processing.</p>
            `,
            'Visa': `
                <p>${excerpt}</p>
                <h2>Complete Visa Documentation Guide</h2>
                <p>Securing a student visa is a critical step in your study abroad journey. Each country has specific requirements and procedures that must be followed carefully.</p>
                <h3>Required Documents</h3>
                <ul>
                    <li>Valid passport with at least 6 months validity</li>
                    <li>University acceptance letter</li>
                    <li>Financial proof and bank statements</li>
                    <li>Academic transcripts and certificates</li>
                    <li>English proficiency test scores (IELTS/TOEFL)</li>
                    <li>Statement of Purpose (SOP)</li>
                    <li>Medical examination reports</li>
                </ul>
                <h3>Application Process</h3>
                <p>The visa application process typically involves online application submission, document upload, biometric data collection, and visa interview (if required).</p>
                <h3>Common Rejection Reasons</h3>
                <p>Insufficient financial proof, incomplete documentation, unclear study intentions, and poor interview performance are leading causes of visa rejections.</p>
                <h2>Tips for Success</h2>
                <p>Prepare thoroughly for your visa interview, ensure all documents are authentic and complete, and demonstrate strong ties to your home country.</p>
            `,
            'Scholarships': `
                <p>${excerpt}</p>
                <h2>Types of Scholarships Available</h2>
                <p>International students can access various scholarship opportunities to fund their overseas education. Understanding these options is crucial for financial planning.</p>
                <h3>Merit-Based Scholarships</h3>
                <p>Awarded based on academic excellence, these scholarships recognize outstanding academic achievements and potential for success.</p>
                <h3>Need-Based Financial Aid</h3>
                <p>Designed for students who demonstrate financial need, these programs help make education accessible regardless of economic background.</p>
                <h3>Country-Specific Programs</h3>
                <p>Many governments offer scholarships to international students as part of cultural exchange and educational diplomacy initiatives.</p>
                <h2>Application Strategies</h2>
                <p>Start your scholarship search early, maintain excellent academic records, participate in extracurricular activities, and craft compelling application essays.</p>
                <h3>Required Documents</h3>
                <p>Most scholarship applications require academic transcripts, recommendation letters, personal statements, and proof of achievements.</p>
                <div class="highlight-box">
                    <h4>Pro Tip</h4>
                    <p>Apply to multiple scholarships to increase your chances of success. Even smaller awards can significantly reduce your education costs.</p>
                </div>
            `
        };
        
        return contentTemplates[category] || `
            <p>${excerpt}</p>
            <h2>Introduction</h2>
            <p>This comprehensive guide will help you understand the important aspects of studying abroad and making informed decisions about your international education journey.</p>
            <h3>Key Considerations</h3>
            <p>When planning your overseas education, it's essential to consider multiple factors including academic goals, financial planning, career aspirations, and personal preferences.</p>
            <h3>Expert Guidance</h3>
            <p>At EV Overseas, we provide personalized counseling to help you navigate the complex process of studying abroad. Our experienced team ensures you make the best decisions for your future.</p>
            <h2>Next Steps</h2>
            <p>Contact our expert counselors for personalized guidance tailored to your specific needs and aspirations.</p>
        `;
    }
    
    // Close article modal
    window.closeArticleModal = function() {
        const modal = document.getElementById('articleModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        }
    };
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll('.service-card, .destination-card, .testimonial-card, .blog-card, .about-content');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
});

// All your existing helper functions remain the same
function validateForm() {
    const form = document.getElementById('contactForm');
    if (!form) return true;
    
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const destination = form.querySelector('#destination').value;
    const course = form.querySelector('#course').value.trim();

    let isValid = true;

    // Clear previous errors
    clearFormErrors();

    if (!name) {
        showFieldError(form.querySelector('#name'), 'Name is required');
        isValid = false;
    }

    if (!email) {
        showFieldError(form.querySelector('#email'), 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError(form.querySelector('#email'), 'Please enter a valid email address');
        isValid = false;
    }

    if (!phone) {
        showFieldError(form.querySelector('#phone'), 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showFieldError(form.querySelector('#phone'), 'Please enter a valid phone number');
        isValid = false;
    }

    if (!destination) {
        showFieldError(form.querySelector('#destination'), 'Please select a destination');
        isValid = false;
    }

    if (!course) {
        showFieldError(form.querySelector('#course'), 'Course interest is required');
        isValid = false;
    }

    return isValid;
}

function clearFormErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    const fields = document.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.style.borderColor = 'var(--color-border)';
    });
}

function showMessage(message, type) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'form-success' : 'form-error';
    messageDiv.textContent = message;

    // Insert before the form
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (contactForm && document.contains(contactForm)) {
        contactForm.parentNode.insertBefore(messageDiv, contactForm);
    } else if (newsletterForm && document.contains(newsletterForm)) {
        newsletterForm.parentNode.insertBefore(messageDiv, newsletterForm.nextSibling);
    }

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 10000);
}

// Google Sheets Integration Function
async function submitFormToGoogleSheets(data) {
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRtK3z-qp2sRCztkPbkG8ixpITP7tom6Ffq6ct8K7jZ0hQ5o8g03BJeJSzMb7y_W8NMw/exec';

    // For demo purposes, simulate successful submission
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Form data that would be submitted:', data);
            resolve({ result: 'success' });
        }, 1000);
    });
}

// Improved email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function validatePhone(phone) {
    const cleaned = phone.replace(/\s|-|\(|\)/g, '');
    const phoneRegex = /^[\+]?[0-9]{10,15}$/;
    return phoneRegex.test(cleaned);
}

function showFieldError(field, message) {
    field.style.borderColor = 'var(--color-error)';
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = 'var(--color-error)';
    errorDiv.style.fontSize = 'var(--font-size-sm)';
    errorDiv.style.marginTop = 'var(--space-4)';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Add scroll-based animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .destination-card, .testimonial-card, .blog-card');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });
}

// Enhanced Analytics Tracking
function trackEvent(eventName, eventData = {}) {
    console.log(`Analytics Event: ${eventName}`, eventData);
    
    // Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: eventData.page_section || 'general',
            event_label: eventData.button_text || eventData.service_name || eventData.destination || '',
            value: eventData.value || 1
        });
    }
}

// Utility function for scrolling
window.scrollToSection = function(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};