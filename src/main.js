const communityIdeasURL = 'http://localhost:3000/communityIdeas';
const myIdeasURL = 'http://localhost:3000/myIdeas';

document.addEventListener('DOMContentLoaded', () => {
    displayEventListeners();
    displayCommunityIdeas();
});

function displayEventListeners() {
    document.getElementById('idea-select').addEventListener('change', (e) => {
        const value = e.target.value;
        if (value === 'community-ideas') displayCommunityIdeas();
        else if (value === 'my-ideas') displayMyIdeas();
        else if (value === 'draft-ideas') displayIdeaDrafts();
    });

    document.getElementById('draft-button').addEventListener('click', (e) => {
        e.preventDefault();
        const idea = getIdeaFromForm();
        const drafts = getDrafts();
        const draftIndex = document.getElementById('idea-form').dataset.draftEditIndex;

        if (draftIndex !== undefined) {
            drafts[draftIndex] = idea;
            delete document.getElementById('idea-form').dataset.draftEditIndex;
        } else {
            drafts.push(idea);
        }

        localStorage.setItem('ideaDrafts', JSON.stringify(drafts));
        document.getElementById('idea-form').reset();
        displayIdeaDrafts();
        alert('Draft saved!');
    });

    document.getElementById('submit-button').addEventListener('click', (e) => {
        e.preventDefault();
        const idea = getIdeaFromForm();
        const editingTitle = document.getElementById('idea-form').dataset.editingTitle;

        if (editingTitle) {
            updateIdeaByTitle(editingTitle, idea);
            delete document.getElementById('idea-form').dataset.editingTitle;
        } else {
            const newIdea = { ...idea, id: crypto.randomUUID(), comments: [], upvotes: 0 };
            saveToServer(newIdea);
        }

        document.getElementById('idea-form').reset();
        displayCommunityIdeas();
    });

    document.getElementById('reset-button').addEventListener('click', () => {
        document.getElementById('idea-form').reset();
        delete document.getElementById('idea-form').dataset.editingTitle;
        delete document.getElementById('idea-form').dataset.draftEditIndex;
    });

    document.getElementById('search-button').addEventListener('click', searchIdeas);
}

function getIdeaFromForm() {
    return {
        title: document.getElementById('idea-title').value,
        image: document.getElementById('idea-image').value,
        category: document.getElementById('idea-category').value,
        stage: document.getElementById('idea-stage').value,
        description: document.getElementById('idea-description').value,
        founder: document.getElementById('idea-founder').value,
        contact: document.getElementById('idea-contact').value,
        email: document.getElementById('idea-email').value,
    };
}

function getDrafts() {
    return JSON.parse(localStorage.getItem('ideaDrafts')) || [];
}

function saveToServer(idea) {
    [communityIdeasURL, myIdeasURL].forEach(url => {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(idea)
        }).catch(err => console.error(`Error posting to ${url}`, err));
    });
}

// UPDATE by TITLE instead of ID
function updateIdeaByTitle(title, updatedIdea) {
    Promise.all([
        fetch(`${myIdeasURL}?title=${encodeURIComponent(title)}`).then(res => res.json()),
        fetch(`${communityIdeasURL}?title=${encodeURIComponent(title)}`).then(res => res.json())
    ])
    .then(([myIdeas, communityIdeas]) => {
        const updatePromises = [];

        if (myIdeas[0]) {
            updatePromises.push(
                fetch(`${myIdeasURL}/${myIdeas[0].id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedIdea)
                })
            );
        }

        if (communityIdeas[0]) {
            updatePromises.push(
                fetch(`${communityIdeasURL}/${communityIdeas[0].id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedIdea)
                })
            );
        }

        return Promise.all(updatePromises);
    })
    .then(() => {
        alert('Idea updated!');
        displayMyIdeas();
    });
}

// DELETE by TITLE instead of ID
function deleteIdeaByTitle(title) {
    Promise.all([
        fetch(`${myIdeasURL}?title=${encodeURIComponent(title)}`).then(res => res.json()),
        fetch(`${communityIdeasURL}?title=${encodeURIComponent(title)}`).then(res => res.json())
    ])
    .then(([myIdeas, communityIdeas]) => {
        const deletePromises = [];

        if (myIdeas[0]) {
            deletePromises.push(fetch(`${myIdeasURL}/${myIdeas[0].id}`, { method: 'DELETE' }));
        }

        if (communityIdeas[0]) {
            deletePromises.push(fetch(`${communityIdeasURL}/${communityIdeas[0].id}`, { method: 'DELETE' }));
        }

        return Promise.all(deletePromises);
    })
    .then(() => displayMyIdeas());
}

function displayCommunityIdeas() {
    fetch(communityIdeasURL)
        .then(res => res.json())
        .then(data => renderIdeas(data, 'community'));
}

function displayMyIdeas() {
    fetch(myIdeasURL)
        .then(res => res.json())
        .then(data => renderIdeas(data, 'my'));
}

function displayIdeaDrafts() {
    const drafts = getDrafts();
    renderIdeas(drafts, 'draft');
}

function renderIdeas(ideas, type) {
    const container = document.getElementById('ideas-container');
    container.innerHTML = '';

    ideas.forEach((idea, i) => {
        const div = document.createElement('div');
        div.className = 'idea';

        const img = document.createElement('img');
        img.src = idea.image || 'images/wallpaperflare.com_wallpaper.jpg';
        img.alt = idea.title;

        const summary = document.createElement('p');
        summary.textContent = `${idea.title} by ${idea.founder || 'Unknown'}`;

        const details = document.createElement('div');
        details.style.display = 'none';
        details.innerHTML = `
            <p>Category: ${idea.category}</p>
            <p>Description: ${idea.description}</p>
            <p>Stage: ${idea.stage}</p>
            <p>Contact: ${idea.contact}</p>
            <p>Email: ${idea.email}</p>
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'community-buttons'
        toggleBtn.textContent = 'Show More';
        toggleBtn.onclick = () => {
            const isHidden = details.style.display === 'none';
            details.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? 'Show Less' : 'Show More';
        };

        div.append(img, summary, toggleBtn, details);

        // Community features
        if (type === 'community') {
            const upvoteBtn = document.createElement('button');
            upvoteBtn.className = 'community-buttons'
            upvoteBtn.textContent = `▲ ${idea.upvotes || 0}`;
            upvoteBtn.onclick = () => {
            const votedIdeas = JSON.parse(localStorage.getItem('votedIdeas') || '[]');

            if (votedIdeas.includes(idea.id)) {
            alert("You've already upvoted this idea.");
            return;
            }

            const updatedVotes = (idea.upvotes || 0) + 1;

            fetch(`${communityIdeasURL}/${idea.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ upvotes: updatedVotes })
            })
            .then(() => {
            votedIdeas.push(idea.id);
            localStorage.setItem('votedIdeas', JSON.stringify(votedIdeas));
            displayCommunityIdeas();
            });
            };
            div.appendChild(upvoteBtn);

            const commentForm = document.createElement('form');
            commentForm.id = 'comment-form'
            const commentInput = document.createElement('input');
            commentInput.id = 'comment-input'
            commentInput.placeholder = 'Add a comment...';
            const commentBtn = document.createElement('button');
            commentBtn.className = 'community-buttons'
            commentBtn.textContent = 'Post';
            commentForm.append(commentInput, commentBtn);

            const commentList = document.createElement('ul');
            (idea.comments || []).forEach(comment => {
                const li = document.createElement('li');
                li.textContent = comment;
                commentList.appendChild(li);
            });

            commentForm.onsubmit = e => {
                e.preventDefault();
                const newComment = commentInput.value.trim();
                if (!newComment) return;
                const updated = [...(idea.comments || []), newComment];
                fetch(`${communityIdeasURL}/${idea.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comments: updated })
                }).then(displayCommunityIdeas);
            };

            div.append(commentForm, commentList);
        }

        // Edit and Delete Only for MY IDEAS
        if (type === 'my') {
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => {
                fillForm(idea);
                document.getElementById('idea-form').dataset.editingTitle = idea.title;
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                deleteIdeaByTitle(idea.title); //delete using title match
            };

            div.append(editBtn, deleteBtn);
        }

        if (type === 'draft') {
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => {
                fillForm(idea);
                document.getElementById('idea-form').dataset.draftEditIndex = i;
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                const drafts = getDrafts();
                drafts.splice(i, 1);
                localStorage.setItem('ideaDrafts', JSON.stringify(drafts));
                displayIdeaDrafts();
            };

            div.append(editBtn, deleteBtn);
        }

        container.appendChild(div);
    });
}

function fillForm(idea) {
    document.getElementById('idea-title').value = idea.title;
    document.getElementById('idea-image').value = idea.image;
    document.getElementById('idea-category').value = idea.category;
    document.getElementById('idea-stage').value = idea.stage;
    document.getElementById('idea-description').value = idea.description;
    document.getElementById('idea-founder').value = idea.founder;
    document.getElementById('idea-contact').value = idea.contact;
    document.getElementById('idea-email').value = idea.email;
}

function searchIdeas() {
    const q = document.getElementById('search-ideas').value.toLowerCase();
    const type = document.getElementById('idea-select').value;

    const filterFn = idea =>
        Object.values(idea).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(q)
        );

    if (type === 'community-ideas') {
        fetch(communityIdeasURL).then(res => res.json()).then(data => {
            renderIdeas(data.filter(filterFn), 'community');
        });
    } else if (type === 'my-ideas') {
        fetch(myIdeasURL).then(res => res.json()).then(data => {
            renderIdeas(data.filter(filterFn), 'my');
        });
    } else if (type === 'draft-ideas') {
        const drafts = getDrafts();
        renderIdeas(drafts.filter(filterFn), 'draft');
    }
}