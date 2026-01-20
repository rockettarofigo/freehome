window.initLights = function() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'lights-grid';

  const lightNames = [
    "White Bathroom",
    "Black Bathroom",
    "Bedroom",
    "Office",
    "Living Room",
    "Dining Room"
  ];

  // Rilevamento mobile
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  lightNames.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'light-btn';
    btn.textContent = name;

    // Se siamo su mobile, imposta altezza, angoli arrotondati e larghezza
    if (isMobile) {
      btn.style.height = '50px';     // altezza mobile
      btn.style.width = '100%';      // tutta la larghezza della colonna
      btn.style.borderRadius = '20px'; 
      btn.style.fontSize = '14px';
    }

    // Momentary click
    btn.addEventListener('click', () => {
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 150);
    });

    grid.appendChild(btn);
  });

  contentArea.appendChild(grid);
};
