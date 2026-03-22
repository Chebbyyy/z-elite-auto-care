/* =============================================
   Z Elite Auto Care - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Page Loader ----
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(() => loader.classList.add('loaded'), 300);
    });
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
      setTimeout(() => loader.classList.add('loaded'), 300);
    }
  }

  // ---- Navbar Scroll Behavior ----
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ---- Mobile Menu Auto-Close ----
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.navbar-cta)');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.click();
      }
    });
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll Animations (Intersection Observer) ----
  const animateElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
  if (animateElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('animated'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    animateElements.forEach(el => observer.observe(el));
  } else {
    animateElements.forEach(el => el.classList.add('animated'));
  }

  // ---- Image Lazy Loading ----
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length && 'IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.addEventListener('load', () => img.classList.add('loaded'));
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });
    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }

  // ---- Stats Counter Animation ----
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // ---- Before/After Slider ----
  const baContainers = document.querySelectorAll('.before-after-container');
  baContainers.forEach(container => {
    const afterImg = container.querySelector('.after-img');
    const handle = container.querySelector('.slider-handle');
    if (!afterImg || !handle) return;

    let isDragging = false;

    const setPosition = (x) => {
      const rect = container.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(2, Math.min(98, percent));
      afterImg.style.width = percent + '%';
      handle.style.left = percent + '%';
    };

    // Initialize at 50%
    afterImg.style.width = '50%';
    handle.style.left = '50%';

    handle.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('mousemove', (e) => { if (isDragging) setPosition(e.clientX); });

    // Touch support
    handle.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); }, { passive: false });
    document.addEventListener('touchend', () => { isDragging = false; });
    document.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length) setPosition(e.touches[0].clientX);
    }, { passive: true });
  });

  // ---- FAQ Accordion Search ----
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const items = document.querySelectorAll('.faq-accordion .accordion-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = (!query || text.includes(query)) ? '' : 'none';
      });
      // Show/hide category titles
      document.querySelectorAll('.faq-category-title').forEach(title => {
        const next = title.nextElementSibling;
        if (next) {
          const visibleItems = next.querySelectorAll('.accordion-item:not([style*="none"])');
          title.style.display = visibleItems.length ? '' : 'none';
        }
      });
    });
  }

  // ---- Blog Search/Filter ----
  const blogSearch = document.getElementById('blogSearch');
  const blogCards = document.querySelectorAll('.blog-card-wrapper');
  if (blogSearch && blogCards.length) {
    blogSearch.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      blogCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = (!query || text.includes(query)) ? '' : 'none';
      });
    });
  }

  // ---- Our Work Category Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const workItems = document.querySelectorAll('.work-filter-item');
  if (filterBtns.length && workItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        workItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            setTimeout(() => { item.style.opacity = '1'; item.style.transition = 'opacity 0.4s ease'; }, 10);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Contact Form Validation ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const successMsg = document.getElementById('formSuccess');
      const errorMsg = document.getElementById('formError');

      // Clear previous messages
      if (successMsg) successMsg.classList.add('d-none');
      if (errorMsg) errorMsg.classList.add('d-none');

      // HTML5 validation
      if (!this.checkValidity()) {
        this.classList.add('was-validated');
        if (errorMsg) errorMsg.classList.remove('d-none');
        return;
      }

      // Validate phone format if filled
      const phone = document.getElementById('contactPhone');
      if (phone && phone.value.trim()) {
        const phoneRegex = /^[\d\s\+\-\(\)]{7,15}$/;
        if (!phoneRegex.test(phone.value.trim())) {
          phone.setCustomValidity('Please enter a valid phone number.');
          this.classList.add('was-validated');
          if (errorMsg) errorMsg.classList.remove('d-none');
          return;
        }
        phone.setCustomValidity('');
      }

      // Simulate form submission
      const submitBtn = this.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        this.reset();
        this.classList.remove('was-validated');
        if (successMsg) {
          successMsg.classList.remove('d-none');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 1500);
    });
  }

  // ---- WhatsApp Button ----
  const waBtn = document.querySelector('.whatsapp-float');
  if (waBtn) {
    waBtn.addEventListener('click', (e) => {
      const phone = waBtn.dataset.phone || '1234567890';
      const msg = encodeURIComponent('Hello! I would like to book a service at Z Elite Auto Care.');
      waBtn.href = `https://wa.me/${phone}?text=${msg}`;
    });
  }

  // ---- Testimonials Carousel ----
  const testimonialsCarousel = document.getElementById('testimonialsCarousel');
  if (testimonialsCarousel && window.bootstrap) {
    new bootstrap.Carousel(testimonialsCarousel, { interval: 5000, ride: 'carousel' });
  }

  // ---- Back to Top (if present) ----
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.opacity = window.scrollY > 400 ? '1' : '0';
      backToTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Blog Sidebar Category Filter ----
  const catLinks = document.querySelectorAll('.category-filter-link');
  if (catLinks.length && blogCards.length) {
    catLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const cat = this.dataset.category;
        blogCards.forEach(card => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

});
