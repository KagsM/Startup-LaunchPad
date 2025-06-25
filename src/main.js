const usersURL = 'http://localhost:3000/users';
const communityIdeasURL = 'http://localhost:3000/communityIdeas';
const myIdeasURL = 'http://localhost:3000/myIdeas';
const ideaDraftsURL = 'http://localhost:3000/ideaDrafts';

addEventListener('DOMContentLoaded', () => {
    displayIdeasListener();
})

function displayIdeasListener() {
document.getElementById('idea-select').addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'community-ideas') {
        displayCommunityIdeas();
    } else if (selectedValue === 'my-ideas') {
        displayMyIdeas();
    } else if (selectedValue === 'idea-drafts') {
        displayIdeaDrafts();
    }
});
}

function displayCommunityIdeas() {
    fetch(communityIdeasURL)
    .then(response => response.json())
    .then(communityIdeas => {
        const communityIdeasList = document.getElementById('ideas-container');
        communityIdeasList.innerHTML = '';

        communityIdeas.forEach(communityIdea => {
            const div = document.createElement('div');
            div.className = 'idea';

            const img = document.createElement('img');
            if (!communityIdea.image) {
                img.src = '/images/wallpaperflare.com_wallpaper.jpg';
            } else {
                img.src = communityIdea.image;
            }
            img.alt = communityIdea.title;

            const text = document.createElement('p');
            text.textContent = `${communityIdea.title} by ${communityIdea.founder}`;

            div.appendChild(img);
            div.appendChild(text);
            communityIdeasList.appendChild(div);
        });
    });
}

function displayMyIdeas() {
    fetch(myIdeasURL)
    .then(response => response.json())
    .then(myIdeas => {
        const myIdeasList = document.getElementById('ideas-container');
        myIdeasList.innerHTML = '';

        myIdeas.forEach(myIdea => {
            const div = document.createElement('div');
            div.className = 'idea';

            const img = document.createElement('img');
            if (!myIdea.image) {
                img.src = 'images/css2024-thumb.webp';
            } else {
            img.src = myIdea.image;
            }
            img.alt = myIdea.title;

            const text = document.createElement('p');
            text.textContent = `${myIdea.title} by ${myIdea.founder}`;

            div.appendChild(img);
            div.appendChild(text);
            myIdeasList.appendChild(div);
        })
    })
}