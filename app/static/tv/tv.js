window.initTvs = function() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'tvs-grid';

  const tvNames = ["One", "Two", "Three", "Four", "Five", "Six"];

  const buttonStates = {};

  
tvNames.forEach(name => {
  const btn = document.createElement('button');
  btn.className = 'tv-btn';
  btn.textContent = name;

  btn.addEventListener('click', () => {

    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 150);

    buttonStates[name] = buttonStates[name] === 'on' ? 'off' : 'on';

    fetch('/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room: name, onoff: buttonStates[name] })
    })
    .then(res => res.json())
    .then(data => console.log('Server response:', data))
    .catch(err => console.error('Errore chiamata /room:', err));
  });

  grid.appendChild(btn);
});

  contentArea.appendChild(grid);
};
