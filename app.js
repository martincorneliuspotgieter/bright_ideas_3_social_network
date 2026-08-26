// Replace this with your actual Google Sheet ID
const SHEET_ID = '1T-7TAi-EQE0Fwk34DUOqGkkCVDFOb5v9lWRebExhQI8';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    // Google returns data wrapped in a function call callback: google.visualization.Query.setResponse(...)
    // We trim off the wrapper text to get clean JSON parsing:
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonString);

    // Extract headers and row data automatically
    const rows = data.table.rows;
    const profiles = rows.map(row => {
      return {
        id: row.c[0] ? row.c[0].v : '',
        name: row.c[1] ? row.c[1].v : '',
        colour: row.c[2] ? row.c[2].v : 'white',
        animal: row.c[3] ? row.c[3].v : '',
        hobby: row.c[4] ? row.c[4].v : '',
        food: row.c[5] ? row.c[5].v : '',
        class: row.c[6] ? row.c[6].v : 'Unassigned',
        avatar: row.c[7] ? row.c[7].v : ''
      };
    });

    renderProfiles(profiles);
  })
  .catch(err => console.error("Error loading Google Sheet data:", err));

// Function to render the profile cards into class compartments
function renderProfiles(profiles) {
  const mainContainer = document.getElementById('profiles-container');
  mainContainer.innerHTML = ''; // Clear container

  // Get list of unique class names
  const classes = [...new Set(profiles.map(p => p.class))];

  classes.forEach(className => {
    // Create class container
    const classSection = document.createElement('div');
    classSection.className = 'class-section';

    const heading = document.createElement('h2');
    heading.className = 'class-title';
    heading.textContent = className;
    classSection.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    // Build cards for this class
    profiles.filter(p => p.class === className).forEach(profile => {
      const card = document.createElement('div');
      card.className = 'card';
      
      // Apply opacity to background color only
      card.style.backgroundColor = `color-mix(in srgb, ${profile.colour} 50%, transparent)`;

      card.innerHTML = `
        ${profile.avatar ? `<img src="${profile.avatar}" alt="${profile.name}'s avatar" style="width: 100px; height: auto;">` : ''}
        <h3>${profile.name}</h3>
        <p><strong>Favourite Animal:</strong> ${profile.animal}</p>
        <p><strong>Favourite Hobby:</strong> ${profile.hobby}</p>
        <p><strong>Favourite Food:</strong> ${profile.food}</p>
      `;

      grid.appendChild(card);
    });

    classSection.appendChild(grid);
    mainContainer.appendChild(classSection);
  });
}