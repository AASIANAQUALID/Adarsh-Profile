/**
 * ADARSH PRIYADARSHI — PORTFOLIO SCRIPT
 * High-performance animations, particle canvas, 3D tilt, and dynamic widgets
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initThemeToggle();
  initMobileMenu();
  initNavbarScroll();
  initStatsCounter();
  initAvatarTilt();
  initProjectFilter();
  initCopyActions();
  initScrollReveal();
});

/* ── 1. Particle Canvas ── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };
  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let dirX = dx / distance;
          let dirY = dy / distance;
          this.x -= dirX * force * 2.5;
          this.y -= dirY * force * 2.5;
        }
      }
    }

    draw(isDark) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.7)' : 'rgba(217, 119, 6, 0.55)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(isDark);

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 125) {
          let opacity = (1 - distance / 125) * (isDark ? 0.25 : 0.16);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark ? `rgba(245, 158, 11, ${opacity})` : `rgba(217, 119, 6, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ── 2. Theme Toggle ── */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const saved = localStorage.getItem('theme') || 'light';
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  });
}

/* ── 3. Mobile Menu ── */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── 4. Navbar Scroll Effect ── */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ── 5. Stats Counter Animation ── */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-num');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statElements.forEach((el) => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 1800;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(2, -10 * progress);
              const currentVal = Math.floor(target * easeOut);

              el.textContent = currentVal.toLocaleString();

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = target.toLocaleString();
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const heroSection = document.querySelector('.hero');
  if (heroSection) observer.observe(heroSection);
}

/* ── 6. Avatar 3D Tilt Effect ── */
function initAvatarTilt() {
  const tiltWrapper = document.getElementById('avatar-tilt');
  if (!tiltWrapper) return;

  tiltWrapper.addEventListener('mousemove', (e) => {
    const rect = tiltWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 12;
    const rotY = (x / (rect.width / 2)) * 12;

    tiltWrapper.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    tiltWrapper.style.transition = 'transform 0.1s ease-out';
  });

  tiltWrapper.addEventListener('mouseleave', () => {
    tiltWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    tiltWrapper.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
}

/* ── 8. Project Filtering System & Show More / Less ── */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const toggleWrap = document.getElementById('projects-toggle-wrap');
  const toggleBtn = document.getElementById('projects-toggle-btn');
  const btnText = toggleBtn ? toggleBtn.querySelector('.btn-text') : null;

  const INITIAL_LIMIT = 4;
  let currentFilter = 'all';
  let isExpanded = false;

  function updateProjects() {
    const matchingCards = projectCards.filter((card) => {
      const category = card.getAttribute('data-category') || '';
      return currentFilter === 'all' || category.includes(currentFilter);
    });

    // Update each card's visibility
    projectCards.forEach((card) => {
      const matchIndex = matchingCards.indexOf(card);
      if (matchIndex !== -1) {
        if (isExpanded || matchIndex < INITIAL_LIMIT) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 180);
        }
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 180);
      }
    });

    // Handle Show More / Show Less button
    if (toggleWrap && toggleBtn && btnText) {
      if (matchingCards.length > INITIAL_LIMIT) {
        toggleWrap.style.display = 'flex';
        if (isExpanded) {
          toggleBtn.classList.add('expanded');
          btnText.textContent = 'Show Less';
        } else {
          toggleBtn.classList.remove('expanded');
          const remaining = matchingCards.length - INITIAL_LIMIT;
          btnText.textContent = `Show More Projects (+${remaining})`;
        }
      } else {
        toggleWrap.style.display = 'none';
      }
    }
  }

  // Filter button clicks
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      isExpanded = false;
      updateProjects();
    });
  });

  // Show More / Less button click
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      updateProjects();

      if (!isExpanded) {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // Initial render
  updateProjects();
}

/* ── 9. Copy Actions & Toast ── */
function initCopyActions() {
  const copyTiles = document.querySelectorAll('.copy-trigger');
  const toast = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      const text = tile.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied: ${text}`);
        });
      }
    });
  });
}

/* ── 10. Scroll Reveal Observer ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.08 }
  );

  reveals.forEach((el) => observer.observe(el));
}
