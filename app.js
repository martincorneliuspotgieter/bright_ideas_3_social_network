// Fetch the profile data from our JSON file
fetch('profiles.json')
  .then(response => response.json())
  .then(profiles => {
    const container = document.getElementById('profiles-container');
    
    // Loop through each profile and create a card for them
    profiles.forEach(profile => {
      const card = document.createElement('div');
      card.className = 'card';
  
        // This directly sets the card background using the color string from JSON!
        card.style.backgroundColor = profile.colour;
        card.style.backgroundColor = `color-mix(in srgb, ${profile.colour} 50%, transparent)`;
        card.innerHTML = `
        <img src="${profile.avatar}" alt="${profile.name}'s avatar" style="width: 100px; height: auto;">
        <h3>${profile.name}</h3>
        <p><strong>Favourite Animal:</strong> ${profile.animal}</p>
        <p><strong>Favourite Hobby:</strong> ${profile.hobby}</p>
        <p><strong>Favourite Food:</strong> ${profile.food}</p>
      `;
      
      container.appendChild(card);
    });
  });