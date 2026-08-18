fetch('profiles.json')
  .then(response => response.json())
  .then(profiles => {
    const mainContainer = document.getElementById('profiles-container');

    // Get a list of unique classes (e.g., ["Class 1", "Class 2", "Class 3"])
    const classes = [...new Set(profiles.map(p => p.class))];

    classes.forEach(className => {
      // 1. Create a section/compartment for the class
      const classSection = document.createElement('div');
      classSection.className = 'class-section';

      // 2. Add a heading for the class
      const heading = document.createElement('h2');
      heading.className = 'class-title';
      heading.textContent = className;
      classSection.appendChild(heading);

      // 3. Create a grid container inside this section for cards
      const grid = document.createElement('div');
      grid.className = 'card-grid';

      // 4. Filter and add profiles belonging to this class
      profiles.filter(p => p.class === className).forEach(profile => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.backgroundColor = `color-mix(in srgb, ${profile.colour} 40%, white)`;

        card.innerHTML = `
          <img src="${profile.avatar}" alt="${profile.name}'s avatar" style="width: 100px; height: auto;">
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
  });