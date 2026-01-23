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
    console.log('Inser a valid ip');
    return;
  }

  const data = {
    light: {},
    tv: {},
    shutter: {}
  };
  data.light[subKey] = ipValue; 

  const flatData = {
    ip: ipValue,                       
   [cleanWhere]: subKey  
  };

  console.log(flatData)

  try {
    const res = await fetch('/newdevice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flatData)
    });
    if (res.ok) {
      console.log('Successfully sent');
    } else {
      console.log('Error on the data stream');
    }
  } catch (e) {
    console.log('Connection error: ' + e.message);
  }
};



  contentArea.appendChild(nameGroup);
  contentArea.appendChild(ipGroup);
  contentArea.appendChild(submitBtn);
};
