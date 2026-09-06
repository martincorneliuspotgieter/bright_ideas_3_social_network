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
      let date = '';
      const sharedItems = [];

      // 1. Process the entire row in one clean pass
      headers.forEach((header, index) => {
        const cell = row ? row.c[index] : null;
        let value = (cell && cell.v !== null && cell.v !== undefined) ? cell.v.toString().trim() : '';

        const lowerHeader = header.toLowerCase().replace(/_/g, ' ');

        // Identity checks
        if (lowerHeader === 'name') name = value;
        else if (lowerHeader === 'avatar') avatar = value;
        else if (lowerHeader === 'class') className = value;
        else if (lowerHeader === 'shared date' || lowerHeader === 'date') date = value;
        
        // 2. Automatically catch ANY column starting with "shared" that has content
        else if (lowerHeader.startsWith('shared') && value.length > 0) {
          const categoryName = header.replace(/_/g, ' '); // e.g., "shared_film" -> "shared film"
          sharedItems.push({ category: categoryName, content: value });
        }
      });

      // 3. Create a feed post for every shared item found for this student
      sharedItems.forEach(item => {
        posts.push({
          name: name || 'Anonymous Student',
          avatar: avatar || '',
          className: className || 'ESL Class',
          category: item.category,
          content: item.content,
          date: date || 'Recently Shared'
        });
      });
    });

    renderFeed(posts);
  })
  .catch(err => console.error("Error loading feed data:", err));

function renderFeed(posts) {
  const feedContainer = document.getElementById('feed-container');
  feedContainer.innerHTML = '';

  if (posts.length === 0) {
    feedContainer.innerHTML = '<p>No updates shared yet!</p>';
    return;
  }

  // Render posts (newest items at the top)
  posts.reverse().forEach(post => {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    postCard.innerHTML = `
      <div class="post-header">
        ${post.avatar ? `<img src="${post.avatar}" alt="${post.name}'s avatar" class="post-avatar">` : ''}
        <div>
          <h3 class="post-author">${post.name}</h3>
          <span class="post-meta">${post.className} • ${post.date}</span>
        </div>
      </div>
      <div class="post-content">
        <p style="margin:0;"><strong>${post.category}:</strong> ${post.content}</p>
      </div>
    `;

    feedContainer.appendChild(postCard);
  });
}