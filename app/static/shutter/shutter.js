window.initshutter = function () {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'shutter-grid';

  fetch('/getdeviceslist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shutter: "shutter" })
  })
    .then(res => res.json())
    .then(data => {

      const shutterNames = Object.keys(data);

      shutterNames.forEach(name => {

        /* ===== ROW ===== */
        const row = document.createElement('div');
        row.className = 'shutter-row';

        /* ===== MAIN SLIDER BUTTON ===== */
        const btn = document.createElement('button');
        btn.className = 'shutter-btn';
        btn.textContent = name;

        let percent = Number(localStorage.getItem(name)) || 0;

        const setColor = p => {
          const orange = [255, 136, 0];
          const blue = [51, 224, 255];
          const r = Math.round(orange[0] + (blue[0] - orange[0]) * (p / 100));
          const g = Math.round(orange[1] + (blue[1] - orange[1]) * (p / 100));
          const b = Math.round(orange[2] + (blue[2] - orange[2]) * (p / 100));
          btn.style.backgroundColor = `rgb(${r},${g},${b})`;
        };
        setColor(percent);

        let tracking = false;

        const startTracking = () => tracking = true;
        const stopTracking = () => {
          if (!tracking) return;
          tracking = false;

          localStorage.setItem(name, percent);

          fetch('/shutter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shutter: name, percentage: percent })
          });
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

        btn.addEventListener('touchstart', startTracking);
        btn.addEventListener('touchmove', moveTracking);
        btn.addEventListener('touchend', stopTracking);

        btn.addEventListener('mousedown', startTracking);
        window.addEventListener('mousemove', moveTracking);
        window.addEventListener('mouseup', stopTracking);

        /* ===== HELPER API CALL ===== */
        const sendStartStop = (value) => {
          fetch('/shutterstartstop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              shutter: name,
              startstop: value
            })
          });
        };

        /* ===== OPEN BUTTON ===== */
        const openBtn = document.createElement('button');
        openBtn.className = 'shutter-action';
        openBtn.textContent = 'OPEN';

        /* ===== CLOSE BUTTON ===== */
        const closeBtn = document.createElement('button');
        closeBtn.className = 'shutter-action';
        closeBtn.textContent = 'CLOSE';

        openBtn.onclick = () => {
          if (openBtn.classList.contains('active')) {
            // STOP
            openBtn.classList.remove('active');
            openBtn.textContent = 'OPEN';
            sendStartStop('stop');
          } else {
            // OPEN
            openBtn.classList.add('active');
            closeBtn.classList.remove('active');
            openBtn.textContent = '||';
            closeBtn.textContent = 'CLOSE';
            sendStartStop('open');
          }
        };

        closeBtn.onclick = () => {
          if (closeBtn.classList.contains('active')) {
            // STOP
            closeBtn.classList.remove('active');
            closeBtn.textContent = 'CLOSE';
            sendStartStop('stop');
          } else {
            // CLOSE
            closeBtn.classList.add('active');
            openBtn.classList.remove('active');
            closeBtn.textContent = '||';
            openBtn.textContent = 'OPEN';
            sendStartStop('close');
          }
        };

        row.appendChild(btn);
        row.appendChild(openBtn);
        row.appendChild(closeBtn);

        grid.appendChild(row);
      });

      contentArea.appendChild(grid);
    })
    .catch(err => console.error('Errore chiamata /getdeviceslist:', err));
};
