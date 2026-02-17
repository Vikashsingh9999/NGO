/* Shared site-wide JS (safe to load on every page) */

// Donation tab switcher (only if the tabs exist on the page)
function switchTab(tabId) {
  const tabs = ['upi', 'bank', 'form'];
  const content = document.getElementById('content-' + tabId);
  const activeBtn = document.getElementById('tab-' + tabId);

  if (!content || !activeBtn) return;

  tabs.forEach((t) => {
    const contentEl = document.getElementById('content-' + t);
    const btn = document.getElementById('tab-' + t);
    if (!contentEl || !btn) return;

    contentEl.classList.add('hidden');
    contentEl.classList.remove('block');

    btn.classList.remove('text-[#1479ad]', 'border-b-2', 'border-[#1479ad]', 'bg-blue-50/50');
    btn.classList.add('text-gray-500');
  });

  content.classList.remove('hidden');
  content.classList.add('block');

  activeBtn.classList.remove('text-gray-500');
  activeBtn.classList.add('text-[#1479ad]', 'border-b-2', 'border-[#1479ad]', 'bg-blue-50/50');
}

function initDonationTabs() {
  if (document.getElementById('tab-upi') && document.getElementById('content-upi')) {
    switchTab('upi');
  }
}

function initRevealObserver() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');

      if (entry.target.querySelector('.counter')) {
        startCounters(entry.target);
      }
    });
  }, observerOptions);

  els.forEach((el) => observer.observe(el));
}

let counted = false;
function startCounters(section) {
  if (counted) return;
  const counters = section.querySelectorAll('.counter');
  if (!counters.length) return;

  counters.forEach((counter) => {
    const target = Number(counter.getAttribute('data-target') || '0');
    const duration = 2000;
    const increment = target / (duration / 16);

    let current = 0;
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.innerText = String(Math.ceil(current));
        requestAnimationFrame(updateCounter);
      } else {
        if (target > 1000) {
          counter.innerText = (target / 1000) + 'k+';
        } else {
          counter.innerText = String(target);
        }
      }
    };
    updateCounter();
  });

  counted = true;
}

function initWelcomeToast() {
  const toast = document.getElementById('welcome-toast');
  if (!toast) return;
  setTimeout(() => {
    toast.classList.remove('translate-y-20', 'opacity-0');
  }, 2500);
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => menu.classList.toggle('hidden'));
}

function initNavbarShadow() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('shadow-sm');
    else nav.classList.remove('shadow-sm');
  });
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(text);
        btn.setAttribute('aria-label', 'Copied');
        btn.classList.add('text-green-600');
        setTimeout(() => {
          btn.setAttribute('aria-label', 'Copy');
          btn.classList.remove('text-green-600');
        }, 1200);
      } catch (_) {
        // ignore
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDonationTabs();
  initRevealObserver();
  initWelcomeToast();
  initMobileMenu();
  initNavbarShadow();
  initCopyButtons();
});

// Export switchTab for inline onclick usage if present
window.switchTab = switchTab;

