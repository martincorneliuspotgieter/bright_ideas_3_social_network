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

// Helper function to extract YouTube Video ID from standard YouTube links
function getYouTubeEmbedUrl(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
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

      headers.forEach((header, index) => {
        const cell = row ? row.c[index] : null;
        let value = (cell && cell.v !== null && cell.v !== undefined) ? cell.v.toString().trim() : '';

        const lowerHeader = header.toLowerCase().replace(/_/g, ' ');

        if (lowerHeader === 'name') name = value;
        else if (lowerHeader === 'avatar') avatar = value;
        else if (lowerHeader === 'class') className = value;
        else if (lowerHeader === 'shared date' || lowerHeader === 'date') date = value;
        else if (lowerHeader.startsWith('shared') && value.length > 0) {
          const categoryName = header.replace(/_/g, ' ');
          sharedItems.push({ category: categoryName, content: value });
        }
      });

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

  posts.reverse().forEach(post => {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    // Check if the content is a YouTube link
    const embedUrl = getYouTubeEmbedUrl(post.content);

    let contentHTML = '';
    if (embedUrl) {
      // Render responsive YouTube iframe
      contentHTML = `
        <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">
          <iframe 
            src="${embedUrl}" 
            title="YouTube video player" 
            style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
        </div>
      `;
    } else {
      // Fallback for regular text entries (like destinations or films)
      contentHTML = `<p style="margin:0;"><strong>${post.category}:</strong> ${post.content}</p>`;
    }

    postCard.innerHTML = `
      <div class="post-header">
        ${post.avatar ? `<img src="${post.avatar}" alt="${post.name}'s avatar" class="post-avatar">` : ''}
        <div>
          <h3 class="post-author">${post.name}</h3>
          <span class="post-meta">${post.className} • ${post.date}</span>
        </div>
      </div>
      <div class="post-content">
        ${contentHTML}
      </div>
    `;

    feedContainer.appendChild(postCard);
  });
}