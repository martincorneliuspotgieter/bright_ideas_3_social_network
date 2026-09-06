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

    const headers = data.table.cols.map(col => col.label ? col.label.trim() : '');
    const rows = data.table.rows;

    const posts = [];

    rows.forEach(row => {
      let name = '';
      let avatar = '';
      let className = '';
      let song = '';
      let date = '';

      headers.forEach((header, index) => {
        const cell = row ? row.c[index] : null;
        let value = (cell && cell.v !== null && cell.v !== undefined) ? cell.v.toString().trim() : '';

        const lowerHeader = header.toLowerCase().replace(/_/g, ' ');
        if (lowerHeader === 'name') name = value;
        else if (lowerHeader === 'avatar') avatar = value;
        else if (lowerHeader === 'class') className = value;
        else if (lowerHeader === 'shared song' || lowerHeader === 'song') song = value;
        else if (lowerHeader === 'shared date' || lowerHeader === 'date') date = value;
      });

      // Only add to feed if student has shared a song
      if (song.length > 0) {
        posts.push({
          name: name || 'Anonymous Student',
          avatar: avatar || 'https://via.placeholder.com/50?text=ESL',
          className: className || 'ESL Class',
          song: song,
          date: date || 'Recently Shared'
        });
      }
    });

    renderFeed(posts);
  })
  .catch(err => console.error("Error loading feed data:", err));

function renderFeed(posts) {
  const feedContainer = document.getElementById('feed-container');
  feedContainer.innerHTML = '';

  if (posts.length === 0) {
    feedContainer.innerHTML = '<p>No shared songs or updates yet!</p>';
    return;
  }

  // Render posts (newest additions at the top)
  posts.reverse().forEach(post => {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    postCard.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" alt="${post.name}'s avatar" class="post-avatar">
        <div>
          <h3 class="post-author">${post.name}</h3>
          <span class="post-meta">${post.className} • ${post.date}</span>
        </div>
      </div>
      <div class="post-content">
        <p style="margin:0;"><strong>🎵 Shared Song:</strong> ${post.song}</p>
      </div>
    `;

    feedContainer.appendChild(postCard);
  });
}