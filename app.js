// Fetch the profile data from our JSON file
fetch('profiles.json')
  .then(response => response.json())
  .then(profiles => {
    const container = document.getElementById('profiles-container');
    
    // Loop through each profile and create a card for them
    profiles.forEach(profile => {
      const card = document.createElement('div');
      card.className = `card ${profile.colour}`; // Style it using their favorite color!
      
      card.innerHTML = `
        <h3>${profile.name}</h3>
        <p><strong>Favourite Animal:</strong> ${profile.animal}</p>
        <p><strong>Favourite Hobby:</strong> ${profile.hobby}</p>
        <p><strong>Favourite Food:</strong> ${profile.food}</p>
      `;
      
      container.appendChild(card);
    });
  });