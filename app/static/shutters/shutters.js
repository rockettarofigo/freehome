window.initShutters = async function() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'shutters-grid';

  const shutterNames = ["One", "Two", "Three", "Four", "Five", "Six"];

  const buttonStates = {}; 

  shutterNames.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'shutters-btn';
    btn.textContent = name;

    btn.addEventListener('click', () => {

      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 150);


      buttonStates[name] = buttonStates[name] === 'on' ? 'off' : 'on';


      fetch('/shutter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shutter: name, onoff: buttonStates[name] })
      })
      .then(res => res.json())
      .then(data => console.log('Server response:', data))
      .catch(err => console.error('Errore chiamata /shutter:', err));
    });

    grid.appendChild(btn);
  });

  contentArea.appendChild(grid);
};
