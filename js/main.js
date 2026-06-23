document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initStickyNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initPropertyFiltering();
  initImageGallery();
  initTabs();
  initFAQAccordion();
  initFormValidation();
  initSmoothScroll();
});

/* ==========================================
   STICKY NAVBAR
   ========================================== */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial check in case page is loaded scrolled down
  handleScroll();
}

/* ==========================================
   MOBILE MENU (HAMBURGER)
   ========================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (!hamburger || !navLinks) return;

  // Dynamically inject the mobile menu backdrop overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const toggleMenu = (forceClose = false) => {
    const isCurrentlyActive = hamburger.classList.contains('active');
    const shouldActive = forceClose ? false : !isCurrentlyActive;

    hamburger.classList.toggle('active', shouldActive);
    navLinks.classList.toggle('active', shouldActive);
    overlay.classList.toggle('active', shouldActive);

    // Prevent page scroll behind the slide-out menu
    document.body.style.overflow = shouldActive ? 'hidden' : 'auto';
  };

  hamburger.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(true));

  // Close menu when links are clicked
  links.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });
}

/* ==========================================
   SCROLL REVEAL ANIMATIONS
   ========================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed to maintain scroll stability
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

/* ==========================================
   ANIMATED COUNTERS
   ========================================== */
function initCounters() {
  const counterTrigger = document.querySelector('.stats-trigger');
  const counters = document.querySelectorAll('.counter-val');
  if (!counterTrigger || counters.length === 0) return;

  const startCounting = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 2000; // 2 seconds counting animation
      const steps = 60;
      const stepTime = duration / steps;
      const increment = Math.ceil(target / steps);

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          counter.innerText = target + suffix;
          clearInterval(timer);
        } else {
          counter.innerText = count + suffix;
        }
      }, stepTime);
    });
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterObserver.observe(counterTrigger);
}

/* ==========================================
   PROPERTY GRID DYNAMIC FILTERING (FRONTEND ONLY)
   ========================================== */
function initPropertyFiltering() {
  const filterForm = document.getElementById('filter-form');
  if (!filterForm) return;

  const searchInput = document.getElementById('search-input');
  const filterLocation = document.getElementById('filter-location');
  const filterType = document.getElementById('filter-type');
  const filterBudget = document.getElementById('filter-budget');
  const filterBeds = document.getElementById('filter-beds');
  const properties = document.querySelectorAll('.property-card');
  const noMatchMsg = document.getElementById('no-properties-message');

  const runFilters = () => {
    const searchVal = searchInput?.value.toLowerCase().trim() || '';
    const locVal = filterLocation?.value || '';
    const typeVal = filterType?.value || '';
    const budgetVal = filterBudget?.value || '';
    const bedsVal = filterBeds?.value || '';

    let matchCount = 0;

    properties.forEach(card => {
      const name = card.querySelector('.property-title').textContent.toLowerCase();
      const cardLoc = card.getAttribute('data-location');
      const cardType = card.getAttribute('data-type');
      const cardPrice = parseInt(card.getAttribute('data-price') || '0', 10);
      const cardBeds = parseInt(card.getAttribute('data-beds') || '0', 10);

      let isMatch = true;

      // Text Search
      if (searchVal && !name.includes(searchVal)) {
        isMatch = false;
      }
      // Location
      if (locVal && cardLoc !== locVal) {
        isMatch = false;
      }
      // Property Type
      if (typeVal && cardType !== typeVal) {
        isMatch = false;
      }
      // Budget
      if (budgetVal) {
        const budgetLimit = parseInt(budgetVal, 10);
        if (cardPrice > budgetLimit) {
          isMatch = false;
        }
      }
      // Beds
      if (bedsVal) {
        const bedsLimit = parseInt(bedsVal, 10);
        if (bedsLimit === 5) {
          if (cardBeds < 5) isMatch = false;
        } else if (cardBeds !== bedsLimit) {
          isMatch = false;
        }
      }

      // Hide or show with a smooth fade
      if (isMatch) {
        card.style.display = 'flex';
        // Minor delay to let display register before opacity transitions
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 10);
        matchCount++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        card.style.display = 'none';
      }
    });

    if (noMatchMsg) {
      noMatchMsg.style.display = matchCount === 0 ? 'block' : 'none';
    }
  };

  // Run on input change or search button click
  searchInput?.addEventListener('input', runFilters);
  filterLocation?.addEventListener('change', runFilters);
  filterType?.addEventListener('change', runFilters);
  filterBudget?.addEventListener('change', runFilters);
  filterBeds?.addEventListener('change', runFilters);

  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    runFilters();
  });
}

/* ==========================================
   PROPERTY GALLERY SWITCH
   ========================================== */
function initImageGallery() {
  const mainImg = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery-thumb-item');

  if (!mainImg || thumbs.length === 0) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Remove active from all thumbs
      thumbs.forEach(t => t.classList.remove('active'));
      
      // Add active to current
      thumb.classList.add('active');
      
      // Update main photo with fading effect
      const newSrc = thumb.getAttribute('data-src');
      mainImg.style.opacity = '0.3';
      
      setTimeout(() => {
        mainImg.setAttribute('src', newSrc);
        mainImg.style.opacity = '1';
      }, 150);
    });
  });
}

/* ==========================================
   INTERACTIVE TABS
   ========================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Deactivate other tabs
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate clicked
      btn.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}

/* ==========================================
   FAQ ACCORDION WITH SMOOTH TRANSITIONS
   ========================================== */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const itemAns = item.querySelector('.faq-answer');
        if (itemAns) {
          itemAns.style.maxHeight = '0px';
        }
      });

      // Toggle current
      if (!isActive) {
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        faqItem.classList.remove('active');
        answer.style.maxHeight = '0px';
      }
    });
  });
}

/* ==========================================
   FORM VALIDATION & FLOATING LABELS
   ========================================== */
function initFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const successPopup = document.getElementById('form-success');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\+?[0-9\s\-()]{7,15}$/.test(phone);
  };

  const checkInput = (input, validationFn, errorId) => {
    const errorEl = document.getElementById(errorId);
    let isValid = true;

    if (!input.value.trim()) {
      isValid = false;
      if (errorEl) errorEl.textContent = 'This field is required.';
    } else if (validationFn && !validationFn(input.value.trim())) {
      isValid = false;
      if (errorEl) errorEl.textContent = 'Please enter a valid format.';
    }

    if (!isValid) {
      input.classList.add('invalid');
      if (errorEl) errorEl.style.display = 'block';
    } else {
      input.classList.remove('invalid');
      if (errorEl) errorEl.style.display = 'none';
    }

    return isValid;
  };

  // Add real-time blur checkers
  nameInput?.addEventListener('blur', () => checkInput(nameInput, null, 'name-error'));
  emailInput?.addEventListener('blur', () => checkInput(emailInput, validateEmail, 'email-error'));
  phoneInput?.addEventListener('blur', () => checkInput(phoneInput, validatePhone, 'phone-error'));
  messageInput?.addEventListener('blur', () => checkInput(messageInput, null, 'message-error'));

  // Form submit intercept
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = checkInput(nameInput, null, 'name-error');
    const isEmailValid = checkInput(emailInput, validateEmail, 'email-error');
    const isPhoneValid = checkInput(phoneInput, validatePhone, 'phone-error');
    const isMsgValid = checkInput(messageInput, null, 'message-error');

    if (isNameValid && isEmailValid && isPhoneValid && isMsgValid) {
      // Show mockup success alert
      if (successPopup) {
        successPopup.style.display = 'block';
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successPopup.style.display = 'none';
        }, 5000);
      }
    }
  });
}

/* ==========================================
   SMOOTH NAVLINK ANCHOR SCROLLING
   ========================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPos = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}
