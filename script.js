document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gallery-grid');
    const weekDisplay = document.getElementById('week-display');

    // Fetch data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Update Header
            weekDisplay.innerText = `Week ${data.meta.week} — ${data.meta.theme}`;

            // Render Cards
            data.members.forEach(member => {
                const card = document.createElement('div');
                card.className = 'card';

                // Check if update is active
                const updateContent = member.update.active 
                    ? `
                        <div class="update-box">
                            <span class="mood">${member.update.mood}</span>
                            <p>${member.update.text}</p>
                        </div>
                      ` 
                    : `<div class="update-box" style="color:#ccc;">Resting this week</div>`;

                // Generate Links
                const linksHtml = Object.entries(member.links)
                    .map(([key, url]) => `<a href="${url}" target="_blank">${key}</a>`)
                    .join('');

                card.innerHTML = `
                    <img src="${member.avatar}" alt="${member.name}" class="avatar">
                    <h2 class="name">${member.name}</h2>
                    <p class="bio">${member.bio}</p>
                    ${updateContent}
                    <div class="links">${linksHtml}</div>
                `;

                grid.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Error loading Galleria:', err);
            weekDisplay.innerText = "Gallery closed for maintenance";
        });
});
