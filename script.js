document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gallery-grid');
    const weekDisplay = document.getElementById('week-display');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-btn');

    // Close Modal Function
    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Re-enable scrolling
    }

    // Event Listeners for Closing
    closeBtn.onclick = closeModal;
    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };
    // Escape key to close
    document.onkeydown = (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    };

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            weekDisplay.innerText = `Week ${data.meta.week} — ${data.meta.theme}`;

            data.members.forEach((member, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.animationDelay = `${index * 0.1}s`;
                
                // Add Click Event for Deep Dive
                card.style.cursor = 'pointer';
                card.onclick = () => openModal(member);

                // Grid Preview Content (Simplified)
                const previewContent = member.update.active 
                    ? `<div class="update-box"><span class="mood">${member.update.mood}</span></div>` 
                    : `<div class="update-box" style="color:#ccc;">Resting</div>`;

                const linksHtml = Object.entries(member.links)
                    .map(([key, url]) => `<a href="${url}" target="_blank">${key}</a>`)
                    .join('');

                card.innerHTML = `
                    <img src="${member.avatar}" alt="${member.name}" class="avatar">
                    <h2 class="name">${member.name}</h2>
                    <p class="bio">${member.bio}</p>
                    ${previewContent}
                    <div class="links">${linksHtml}</div>
                `;

                grid.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Error loading Galleria:', err);
            weekDisplay.innerText = "Gallery closed for maintenance";
        });

    // Open Modal Function
    function openModal(member) {
        const updateContent = member.update.active 
            ? `
                <div class="modal-update">
                    <span class="mood" style="font-size:2rem; display:block; margin-bottom:1rem;">${member.update.mood}</span>
                    <p style="font-size:1.1rem; line-height:1.8;">${member.update.text}</p>
                    ${member.update.image ? `<img src="${member.update.image}" class="modal-image" alt="Update Image">` : ''}
                </div>
              ` 
            : `<div class="modal-update" style="text-align:center; color:#ccc;">No update this week.</div>`;

        const linksHtml = Object.entries(member.links)
            .map(([key, url]) => `<a href="${url}" target="_blank">${key}</a>`)
            .join('');

        modalBody.innerHTML = `
            <img src="${member.avatar}" class="modal-avatar">
            <h2 class="modal-name">${member.name}</h2>
            <p class="modal-bio">${member.bio}</p>
            ${updateContent}
            <div class="modal-links">${linksHtml}</div>
        `;

        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Disable background scrolling
    }
});
