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

    if (section === 'lights') {
      window.initLights();
    } else if (section === 'shutters') { 
      window.initShutters();
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

  const buttonNames = ["Lights", "Shutters", "Tv", "Cams"];

  buttonNames.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'home-btn';
    btn.textContent = name;

btn.addEventListener('click', () => {
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 150);

  contentArea.innerHTML = '';

  if (name === "Lights") {
    window.initLights();
    showBackButton();
    showSettingsButton("Lights");
  } else if (name === "Shutters") { 
    window.initShutters();
    showBackButton();
    showSettingsButton("Shutters");
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
