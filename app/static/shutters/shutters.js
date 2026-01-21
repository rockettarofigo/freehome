window.initShutters = function() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'shutters-grid';

  const shutterNames = ["One", "Two", "Three", "Four", "Five", "Six"];
  
  shutterNames.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'shutters-btn';
    btn.textContent = name;

    // Recupera percentuale salvata nel LocalStorage oppure 0
    let percent = Number(localStorage.getItem(name)) || 0;

    // Imposta colore iniziale basato sulla percentuale salvata
    const setColor = p => {
      const orange = [255, 136, 0];  
      const blue   = [51, 224, 255]; 
      const r = Math.round(orange[0] + (blue[0]-orange[0])*(p/100));
      const g = Math.round(orange[1] + (blue[1]-orange[1])*(p/100));
      const b = Math.round(orange[2] + (blue[2]-orange[2])*(p/100));
      btn.style.backgroundColor = `rgb(${r},${g},${b})`;
    };
    setColor(percent);

    let tracking = false;

    btn.addEventListener('touchstart', e => {
      tracking = true;
    });

    btn.addEventListener('touchmove', e => {
      if (!tracking) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = btn.getBoundingClientRect();
      let x = touch.clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      percent = Math.round((x / rect.width) * 100);
      setColor(percent);
    });

    btn.addEventListener('touchend', e => {
      if (!tracking) return;
      tracking = false;

      console.log(`${name} final: ${percent}%`);

      // Salva percentuale nel LocalStorage
      localStorage.setItem(name, percent);

      // Invia al server
      fetch('/shutter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          shutter: name, 
          percentage: percent
        })
      })
      .then(res => res.json())
      .then(data => console.log('Server response:', data))
      .catch(err => console.error('Errore chiamata /shutter:', err));
    });

    grid.appendChild(btn);
  });

  contentArea.appendChild(grid);
};
