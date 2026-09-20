// ===== Zajednička skripta za sve stranice (Početna, O nama, Usluge, Kontakt) =====

document.getElementById('godina') && (document.getElementById('godina').textContent = new Date().getFullYear());

// Automatski odabir usluge u formi ako je proslijeđena kroz URL (npr. usluge.html -> kontakt.html?usluga=...)
const uslugaSelect = document.getElementById('cUsluga');
if (uslugaSelect) {
  const params = new URLSearchParams(window.location.search);
  const odabranaUsluga = params.get('usluga');
  if (odabranaUsluga) {
    const match = Array.from(uslugaSelect.options).find(opt => opt.value === odabranaUsluga);
    if (match) uslugaSelect.value = odabranaUsluga;
  }
}

// Mobilni izbornik
const navToggle = document.querySelector('.nav-toggle');
const navLinksEl = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('mobile-open');
  navLinksEl.style.cssText = open
    ? 'display:flex;position:absolute;top:82px;left:0;right:0;background:#fff;flex-direction:column;align-items:stretch;padding:14px 28px 22px;border-bottom:1px solid var(--line);gap:2px;z-index:80;max-height:calc(100vh - 82px);overflow-y:auto;'
    : 'display:none;';
  // Zatvori sve otvorene podizbornike kad se glavni izbornik zatvori
  if (!open) {
    document.querySelectorAll('.nav-item.open').forEach(item => item.classList.remove('open'));
  }
});

// Podizbornici (O nama, Usluge) na mobitelu rade na tap/klik, ne na hover
document.querySelectorAll('.nav-item').forEach((item) => {
  const trigger = item.querySelector('.nav-link');
  if (!trigger || trigger.tagName !== 'BUTTON') return;
  trigger.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 980px)').matches) {
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach(other => { if (other !== item) other.classList.remove('open'); });
      item.classList.toggle('open', !isOpen);
    }
  });
});

// Kontakt forma -> Web3Forms (šalje upit izravno na email, bez otvaranja email klijenta)
const kontaktForm = document.getElementById('kontaktForm');
kontaktForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('formSubmitBtn');
  const result = document.getElementById('formResult');
  const originalBtnText = btn.textContent;

  btn.disabled = true;
  btn.textContent = 'Šaljem...';
  result.textContent = '';
  result.className = 'form-result';

  const formData = new FormData(kontaktForm);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });
    const json = await response.json();

    if (json.success) {
      kontaktForm.reset();
      result.textContent = 'Hvala! Vaš upit je uspješno poslan — javit ćemo se uskoro.';
      result.classList.add('form-result-success');
    } else {
      throw new Error(json.message || 'Slanje nije uspjelo');
    }
  } catch (err) {
    result.textContent = 'Nešto je pošlo po zlu. Molimo pokušajte ponovno ili nas nazovite direktno na 095 861 1661.';
    result.classList.add('form-result-error');
  } finally {
    btn.disabled = false;
    btn.textContent = originalBtnText;
  }
});

// Slideshow klijenata/sportaša (samo na početnoj stranici)
(function () {
  const slider = document.getElementById('clientsSlider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.slider-slide');
  const dots = slider.querySelectorAll('.slider-dot');
  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  function next() { goTo(current + 1); }

  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, 4500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  });

  startAutoplay();
})();

// Cookie banner (zajednički na svim stranicama, pamti izbor kroz localStorage)
const cookieBanner = document.getElementById('cookieBanner');
if (cookieBanner && !localStorage.getItem('nemo_cookie_consent')) {
  setTimeout(() => cookieBanner.classList.add('show'), 600);
}
function zatvoriCookieBanner(vrijednost) {
  localStorage.setItem('nemo_cookie_consent', vrijednost);
  cookieBanner?.classList.remove('show');
}
document.getElementById('cookieAccept')?.addEventListener('click', () => zatvoriCookieBanner('accepted'));
document.getElementById('cookieReject')?.addEventListener('click', () => zatvoriCookieBanner('rejected'));
