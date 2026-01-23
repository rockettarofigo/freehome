window.initlight = function() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'light-grid';

  const buttonStates = {};

  fetch('/getdeviceslist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ light: "light" })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Server response:', data);

    const lightNames = Object.keys(data);   

    lightNames.forEach(name => {
      const btn = document.createElement('button');
      btn.className = 'light-btn';
      btn.textContent = name;

      btn.addEventListener('click', () => {
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 150);

        buttonStates[name] = buttonStates[name] === 'on' ? 'off' : 'on';

        fetch('/light', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ light: name, onoff: buttonStates[name] })
        })
        .then(res => res.json())
        .then(data => console.log('Server response:', data))
        .catch(err => console.error('Errore chiamata /light:', err));
      });

      grid.appendChild(btn);
    });

    contentArea.appendChild(grid); 
  })
  .catch(err => console.error('Errore chiamata /getdeviceslist:', err));
};
