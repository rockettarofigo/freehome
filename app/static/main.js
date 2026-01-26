// =======================
// GLOBALI
// =======================
const menuItems = document.querySelectorAll('.menu-item');
const contentArea = document.getElementById('content-area');
const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

// =======================
// HOME DESKTOP
// =======================
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    const section = item.dataset.section;
    contentArea.innerHTML = '';

    if (section === 'light') {
      window.initlight();
    } else if (section === 'shutter') {
      window.initshutter();
    } else if (section === 'tv') {
      window.initTvs();
    } else if (section === 'cams') {
      window.initCams();
    } else if (section === 'solar') {
      window.initSolar();
    } else if (section === 'aircon') {
      window.initAircon();
    } else {
      contentArea.textContent = `Section: ${section}`;
    }
  });
});

// =======================
// HOME MOBILE
// =======================
function initHomeButtons() {
  if (!isMobile) return;

  removeBackButton();
  removeSettingsButton();
  contentArea.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'home-wrapper';

  const hero = document.createElement('img');
  hero.src = '/static/img/home-domotica.png';
  hero.alt = 'Smart Home';
  hero.className = 'home-hero';

  const grid = document.createElement('div');
  grid.className = 'home-grid';

  const buttonNames = ['light', 'shutter', 'tv', 'cams', 'solar', 'aircon'];

  buttonNames.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'home-btn';
    btn.textContent = name;

    btn.addEventListener('click', () => {
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 150);

      contentArea.innerHTML = '';

      if (name === 'light') {
        window.initlight();
        showSettingsButton('light');
      } else if (name === 'shutter') {
        window.initshutter();
        showSettingsButton('shutter');
      } else if (name === 'tv') {
        window.initTvs();
        showSettingsButton('tv');
      } else if (name === 'cams') {
        window.initCams();
        showSettingsButton('cams');
      } else if (name === 'solar') {
        window.initSolar();
        showSettingsButton('solar');
      } else if (name === 'aircon') {
        window.initAircon();
        showSettingsButton('aircon');
      }

      showBackButton();
    });

    grid.appendChild(btn);
  });

  wrapper.appendChild(hero);
  wrapper.appendChild(grid);
  contentArea.appendChild(wrapper);
}

// =======================
// BACK BUTTON
// =======================
function showBackButton() {
  if (!isMobile || document.querySelector('.back-btn')) return;

  const btn = document.createElement('button');
  btn.className = 'back-btn';
  btn.textContent = 'Back';

  btn.onclick = () => {
    btn.remove();
    initHomeButtons();
  };

  document.body.appendChild(btn);
}

function removeBackButton() {
  document.querySelector('.back-btn')?.remove();
}

// =======================
// SETTINGS BUTTON
// =======================
function showSettingsButton(where) {
  if (!isMobile || document.querySelector('.settings-btn')) return;

  const btn = document.createElement('button');
  btn.className = 'settings-btn';
  btn.textContent = 'Settings';

  btn.onclick = () => initSettings(where);

  document.body.appendChild(btn);
}

function removeSettingsButton() {
  document.querySelector('.settings-btn')?.remove();
}

// =======================
// INIT
// =======================
window.addEventListener('DOMContentLoaded', initHomeButtons);
