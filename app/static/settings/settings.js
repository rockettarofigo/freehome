window.initSettings = function(where) {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '';

  const validKeys = ['light', 'tv', 'shutter'];
  let cleanWhere = where.trim().toLowerCase();

  if (!validKeys.includes(cleanWhere)) {
    console.log('not a valid key: ' + where);
    return;
  }

  const nameGroup = document.createElement('div');
  nameGroup.className = 'input-group';
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Name';
  const nameInput = document.createElement('input');
  nameInput.placeholder = 'Inserisci il nome (es. office)';
  nameGroup.appendChild(nameLabel);
  nameGroup.appendChild(nameInput);

  const ipGroup = document.createElement('div');
  ipGroup.className = 'input-group';
  const ipLabel = document.createElement('label');
  ipLabel.textContent = 'IP';
  const ipInput = document.createElement('input');
  ipInput.placeholder = 'Inserisci IP';
  ipGroup.appendChild(ipLabel);
  ipGroup.appendChild(ipInput);

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Invia';

  submitBtn.onclick = async () => {
    const subKey = nameInput.value.trim(); 
    const ipValue = ipInput.value.trim();  

    if (!subKey) {
      console.log('Insert a valid name');
      return;
    }
    if (!ipValue) {
      console.log('Inserisci un IP valido');
      return;
    }

    const flatData = {
      ip: ipValue,                       
      [cleanWhere]: subKey  
    };

    try {
      const res = await fetch('/newdevice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flatData)
      });
      if (res.ok) {
        console.log('Successfully sent');
        initHomeButtons();
      } else {
        console.log('Error on the data stream');
      }
    } catch (e) {
      console.log('Connection error: ' + e.message);
    }
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Elimina';

  deleteBtn.onclick = async () => {
    const subKey = nameInput.value.trim();

    if (!subKey) {
      console.log('Insert a valid name');
      return;
    }

    const flatData = {
      [cleanWhere]: subKey  
    };

    try {
      const res = await fetch('/deletedevice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flatData)
      });
      if (res.ok) {
        console.log('Successfully sent');
        initHomeButtons();
      } else {
        console.log('Error on the data stream');
      }
    } catch (e) {
      console.log('Connection error: ' + e.message);
    }


  };

  const btnGroup = document.createElement('div');
  btnGroup.className = 'button-group';
  btnGroup.appendChild(submitBtn);
  btnGroup.appendChild(deleteBtn);

  contentArea.appendChild(nameGroup);
  contentArea.appendChild(ipGroup);
  contentArea.appendChild(btnGroup);

};
