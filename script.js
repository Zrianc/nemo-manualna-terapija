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

// Kontakt forma -> mailto (samo na stranicama koje je imaju, npr. kontakt.html)
document.getElementById('kontaktForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const ime = document.getElementById('cIme').value;
  const tel = document.getElementById('cTel').value;
  const usluga = document.getElementById('cUsluga').value;
  const poruka = document.getElementById('cPoruka').value;
  const subject = encodeURIComponent('Upit s web stranice — ' + usluga);
  const body = encodeURIComponent(`Ime i prezime: ${ime}\nTelefon: ${tel}\nUsluga: ${usluga}\n\nPoruka:\n${poruka}`);
  window.location.href = `mailto:nemo.manualnaterapija@gmail.com?subject=${subject}&body=${body}`;
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
