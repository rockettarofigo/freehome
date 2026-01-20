window.initCams = async function() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '';

  const camsGrid = document.createElement('div');
  camsGrid.className = 'cams-grid';
  contentArea.appendChild(camsGrid);

  const maxCams = 6; 

  for (let camId = 0; camId < maxCams; camId++) {
    const camImg = document.createElement('img');
    camImg.src = `/camera/${camId}`;
    camImg.alt = `Camera ${camId}`;
    camImg.style.width = '400px';
    camImg.style.height = '300px';
    camImg.style.objectFit = 'cover';
    camImg.style.border = '2px solid #33e0ff';
    camImg.style.borderRadius = '10px';
    camImg.style.margin = '5px';

    camImg.onload = () => {
      camsGrid.appendChild(camImg);
    };

    camImg.onerror = () => {
      console.log(`Camera ${camId} non disponibile`);
    };
  }

  if (camsGrid.children.length === 0) {
    camsGrid.textContent = "";
  }
};
