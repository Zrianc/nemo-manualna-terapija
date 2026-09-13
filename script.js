// ===== Zajednička skripta za sve stranice (Početna, O nama, Usluge, Kontakt) =====

document.getElementById('godina') && (document.getElementById('godina').textContent = new Date().getFullYear());

// Mobilni izbornik
const navToggle = document.querySelector('.nav-toggle');
const navLinksEl = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('mobile-open');
  navLinksEl.style.cssText = open
    ? 'display:flex;position:absolute;top:82px;left:0;right:0;background:#fff;flex-direction:column;align-items:stretch;padding:14px 28px 22px;border-bottom:1px solid var(--line);gap:2px;z-index:80;'
    : 'display:none;';
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
