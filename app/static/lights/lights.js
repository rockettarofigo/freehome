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

  const buttonStates = {};

  
// Pulsanti light
lightNames.forEach(name => {
  const btn = document.createElement('button');
  btn.className = 'light-btn';
  btn.textContent = name;

  // Click momentaneo + toggle + fetch
  btn.addEventListener('click', () => {
    // Animazione momentanea
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 150);

    // Toggle stato
    buttonStates[name] = buttonStates[name] === 'on' ? 'off' : 'on';

    // Chiamata al server
    fetch('/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stanza: name, onoff: buttonStates[name] })
    })
    .then(res => res.json())
    .then(data => console.log('Server response:', data))
    .catch(err => console.error('Errore chiamata /room:', err));
  });

  grid.appendChild(btn);
});

  contentArea.appendChild(grid);
};
