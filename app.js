document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const nav = document.querySelector('#nav ul');
  const themeToggle = document.getElementById('theme-toggle');
  const backTop = document.getElementById('back-to-top');

  mobileBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    mobileBtn.innerHTML = nav.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // theme
  if (localStorage.getItem('darkMode') === 'true') document.documentElement.classList.add('dark');
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    themeToggle.innerHTML = document.documentElement.classList.contains('dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });

  // active nav on scroll
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      if (pageYOffset >= top) cur = s.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
    backTop.classList.toggle('active', window.pageYOffset > 400);
  });

  // simple intersection observer for reveal
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const anim = el.dataset.animate || 'fade-in';
        const delay = el.dataset.delay || '0s';
        el.style.animationDelay = delay;
        el.classList.add(anim);
        obs.unobserve(el);
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));

  // contact form demo
  const form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks! Message sent — I will reach out soon.');
    form.reset();
  });

  // back to top click
  backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
});
