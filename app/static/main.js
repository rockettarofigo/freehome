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
    } 
    else {
      contentArea.textContent = `Section: ${section} (content placeholder)`;
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

  const grid = document.createElement('div');
  grid.className = 'home-grid';

  const buttonNames = ["light", "shutter", "Tv", "Cams"];

  buttonNames.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'home-btn';
    btn.textContent = name;

btn.addEventListener('click', () => {
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 150);

  contentArea.innerHTML = '';

  if (name === "light") {
    window.initlight();
    showBackButton();
    showSettingsButton("light");
  } else if (name === "shutter") { 
    window.initshutter();
    showBackButton();
    showSettingsButton("shutter");
  } else if (name === "Tv") { 
    window.initTvs();
    showBackButton();
    showSettingsButton("Tv");
  } else if (name === "Cams") {
    window.initCams();
    showBackButton();
    showSettingsButton("Cams");
  } else {
    contentArea.textContent = `Section: ${name} (content placeholder)`;
    showBackButton();
  }
});

    grid.appendChild(btn);
  });

  contentArea.appendChild(grid);
}

// =======================
// BACK BUTTON (MOBILE)
// =======================
function showBackButton() {
  if (!isMobile) return;
  if (document.querySelector('.back-btn')) return;

  const backBtn = document.createElement('button');
  backBtn.className = 'back-btn';
  backBtn.textContent = 'Back';

  backBtn.addEventListener('click', () => {
    backBtn.remove();
    initHomeButtons();
  });

  document.body.appendChild(backBtn);
}

function removeBackButton() {
  const btn = document.querySelector('.back-btn');
  if (btn) btn.remove();
}

// =======================
// SETTINGS BUTTON (MOBILE)
// =======================
function showSettingsButton(where) {
  if (!isMobile) return;
  if (document.querySelector('.settings-btn')) return;

  const setnBtn = document.createElement('button');
  setnBtn.className = 'settings-btn';
  setnBtn.textContent = 'Settings';

  setnBtn.addEventListener('click', () => {
    console.log(where)
    initSettings(where);
  });

  document.body.appendChild(setnBtn);
}

function removeSettingsButton() {
  const btn = document.querySelector('.settings-btn');
  if (btn) btn.remove();
}

// =======================
// INIT
// =======================
window.addEventListener('DOMContentLoaded', () => {
  initHomeButtons();
});
