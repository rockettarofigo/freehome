window.initshutter = function() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'shutter-grid';

//  const shutterNames = ["One", "Two", "Three", "Four", "Five", "Six"];
  
  fetch('/getdeviceslist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shutter: "shutter" })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Server response:', data);

    const shutterNames = Object.keys(data);


  shutterNames.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'shutter-btn';
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

    // Funzioni generiche
    const startTracking = () => { tracking = true; };
    const stopTracking = () => { 
      if (!tracking) return; 
      tracking = false; 

      console.log(`${name} final: ${percent}%`);
      localStorage.setItem(name, percent);

      fetch('/shutter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shutter: name, percentage: percent })
      })
      .then(res => res.json())
      .then(data => console.log('Server response:', data))
      .catch(err => console.error('Errore chiamata /shutter:', err));
    };
    const moveTracking = e => {
      if (!tracking) return;
      e.preventDefault();
      const rect = btn.getBoundingClientRect();
      let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      percent = Math.round((x / rect.width) * 100);
      setColor(percent);
    };

    // TOUCH EVENTS
    btn.addEventListener('touchstart', startTracking);
    btn.addEventListener('touchmove', moveTracking);
    btn.addEventListener('touchend', stopTracking);

    // MOUSE EVENTS
    btn.addEventListener('mousedown', startTracking);
    window.addEventListener('mousemove', moveTracking);
    window.addEventListener('mouseup', stopTracking);

    grid.appendChild(btn);
  });

  contentArea.appendChild(grid);
  })
  .catch(err => console.error('Errore chiamata /getdeviceslist:', err));
};
