// Replace this with your actual Google Sheet ID
const SHEET_ID = '1T-7TAi-EQE0Fwk34DUOqGkkCVDFOb5v9lWRebExhQI8';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

function checkPassword() {
  const secret = "esl2026";
  const userInput = document.getElementById('pass-input').value;

  if (userInput === secret) {
    document.getElementById('password-overlay').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  } else {
    document.getElementById('error-msg').style.display = 'block';
  }
}

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonString);

    // 1. Get header names dynamically from column configuration
    const headers = data.table.cols.map(col => col.label ? col.label.trim() : '');

    // 2. Map rows dynamically using column headers as key names
    const rows = data.table.rows;
    const profiles = rows.map(row => {
      const profile = { details: {} };

      headers.forEach((header, index) => {
        const cell = row.c[index];
        const value = cell && cell.v !== null && cell.v !== undefined ? cell.v.toString().trim() : '';

        // Standard known columns for card structure
        const lowerHeader = header.toLowerCase();
        if (lowerHeader === 'id') profile.id = value;
        else if (lowerHeader === 'name') profile.name = value;
        else if (lowerHeader === 'colour' || lowerHeader === 'color') profile.colour = value || 'white';
        else if (lowerHeader === 'class') profile.class = value || 'Unassigned';
        else if (lowerHeader === 'avatar') profile.avatar = value;
        else if (header !== '') {
          // Any other custom/new column goes into details!
          profile.details[header] = value;
        }
      });

      return profile;
    });

    renderProfiles(profiles);
  })
  .catch(err => console.error("Error loading Google Sheet data:", err));

// Function to render the profile cards into class compartments
function renderProfiles(profiles) {
  const mainContainer = document.getElementById('profiles-container');
  mainContainer.innerHTML = ''; 

  const classes = [...new Set(profiles.map(p => p.class))];

  classes.forEach(className => {
    const classSection = document.createElement('div');
    classSection.className = 'class-section';

    const heading = document.createElement('h2');
    heading.className = 'class-title';
    heading.textContent = className;
    classSection.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    profiles.filter(p => p.class === className).forEach(profile => {
      const card = document.createElement('div');
      card.className = 'card';
      
      card.style.backgroundColor = `color-mix(in srgb, ${profile.colour || 'white'} 50%, transparent)`;

      // Loop over every dynamic detail field and render ONLY if a value exists
      let detailsHTML = '';
      for (const [label, val] of Object.entries(profile.details)) {
        if (val !== '') {
          // Format header (e.g., convert "favourite_song" or "favourite song" nicely)
          const formattedLabel = label.replace(/_/g, ' ');
          detailsHTML += `<p><strong>${formattedLabel}:</strong> ${val}</p>`;
        }
      }

      card.innerHTML = `
        ${profile.avatar ? `<img src="${profile.avatar}" alt="${profile.name}'s avatar" style="width: 100px; height: auto;">` : ''}
        ${profile.name ? `<h3>${profile.name}</h3>` : ''}
        ${detailsHTML}
      `;

      grid.appendChild(card);
    });

    classSection.appendChild(grid);
    mainContainer.appendChild(classSection);
  });
}