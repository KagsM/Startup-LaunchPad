const usersURL = 'http://localhost:3000/users';
const communityIdeasURL = 'http://localhost:3000/communityIdeas';
const myIdeasURL = 'http://localhost:3000/myIdeas';
const ideaDraftsURL = 'http://localhost:3000/ideaDrafts';
const date = new Date().toLocaleString([], {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

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

            const communityDetails = document.createElement('span');
            communityDetails.style.display = 'none';

            const communityCategory = document.createElement('p');
            communityCategory.textContent = `Category: ${communityIdea.category}`;
            
            const communityDescription = document.createElement('p');
            communityDescription.textContent = `Description: ${communityIdea.description}`;

            const communityStage = document.createElement('p');
            communityStage.textContent = `Stage: ${communityIdea.stage}`;

            const communityContact = document.createElement('p');
            communityContact.textContent = `Contact: ${communityIdea.contact}`;

            const communityEmail = document.createElement('p');
            communityEmail.textContent = `Email: ${communityIdea.email}`;

            const communityDate = document.createElement('p');
            communityDate.textContent = `Added: ${date}`;

            const detailsButton = document.createElement('button');
            detailsButton.className = 'details-button';
            detailsButton.textContent = 'Show More';

            detailsButton.addEventListener('click', () => {
            const isHidden = communityDetails.style.display === 'none';
            communityDetails.style.display = isHidden ? 'block' : 'none';
            detailsButton.textContent = isHidden ? 'Show Less' : 'Show More';
});

            div.appendChild(img);
            div.appendChild(text);
            div.appendChild(communityDetails);
            div.appendChild(detailsButton);
            communityDetails.appendChild(communityCategory);
            communityDetails.appendChild(communityDescription);
            communityDetails.appendChild(communityStage);
            communityDetails.appendChild(communityContact);
            communityDetails.appendChild(communityEmail);
            div.appendChild(communityDate);
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

            const myDetails = document.createElement('span');
            myDetails.style.display = 'none';

            const myCategory = document.createElement('p');
            myCategory.textContent = `Category: ${myIdea.category}`;
            
            const myDescription = document.createElement('p');
            myDescription.textContent = `Description: ${myIdea.description}`;

            const myStage = document.createElement('p');
            myStage.textContent = `Stage: ${myIdea.stage}`;

            const myContact = document.createElement('p');
            myContact.textContent = `Contact: ${myIdea.contact}`;

            const myEmail = document.createElement('p');
            myEmail.textContent = `Email: ${myIdea.email}`;

            const myDate = document.createElement('p');
            myDate.textContent = `Added: ${date}`;

            const detailsButton = document.createElement('button');
            detailsButton.className = 'details-button';
            detailsButton.textContent = 'Show More';

            detailsButton.addEventListener('click', () => {
            const isHidden = myDetails.style.display === 'none';
            myDetails.style.display = isHidden ? 'block' : 'none';
            detailsButton.textContent = isHidden ? 'Show Less' : 'Show More';
});


            div.appendChild(img);
            div.appendChild(text);
            div.appendChild(myDetails);
            div.appendChild(detailsButton);
            myDetails.appendChild(myCategory);
            myDetails.appendChild(myDescription);
            myDetails.appendChild(myStage);
            myDetails.appendChild(myContact);
            myDetails.appendChild(myEmail);
            div.appendChild(myDate);
            myIdeasList.appendChild(div);
        })
    })
}

function ideaDrafts() {
    fetch(ideaDraftsURL)
    .then(response => response.json())
    .then(ideaDrafts => {
        const ideaDraftsList = document.getElementById('ideas-container');
        ideaDraftsList.innerHTML = '';

        ideaDrafts.forEach(ideaDraft => {
            const div = document.createElement('div');
            div.className = 'idea';

            const img = document.createElement('img');
            if (!ideaDraft.image) {
                img.src = 'images/css2024-thumb.webp';
            } else {
            img.src = ideaDraft.image;
            }
            img.alt = ideaDraft.title;

            const text = document.createElement('p');
            text.textContent = `${ideaDraft.title} by ${ideaDraft.founder}`;

            const draftDetails = document.createElement('span');
            draftDetails.style.display = 'none';

            const draftCategory = document.createElement('p');
            draftCategory.textContent = `Category: ${ideaDraft.category}`;
            
            const draftDescription = document.createElement('p');
            draftDescription.textContent = `Description: ${ideaDraft.description}`;

            const draftStage = document.createElement('p');
            draftStage.textContent = `Stage: ${ideaDraft.stage}`;

            const draftContact = document.createElement('p');
            draftContact.textContent = `Contact: ${ideaDraft.contact}`;

            const draftEmail = document.createElement('p');
            draftEmail.textContent = `Email: ${ideaDraft.email}`;

            const draftDate = document.createElement('p');
            draftDate.textContent = `Added: ${date}`;

            const detailsButton = document.createElement('button');
            detailsButton.className = 'details-button';
            detailsButton.textContent = 'Show More';

            detailsButton.addEventListener('click', () => {
            const isHidden = draftDetails.style.display === 'none';
            draftDetails.style.display = isHidden ? 'block' : 'none';
            detailsButton.textContent = isHidden ? 'Show Less' : 'Show More';
});


            div.appendChild(img);
            div.appendChild(text);
            div.appendChild(draftDetails);
            div.appendChild(detailsButton);
            myDetails.appendChild(draftCategory);
            myDetails.appendChild(draftDescription);
            myDetails.appendChild(draftStage);
            myDetails.appendChild(draftContact);
            myDetails.appendChild(draftEmail);
            div.appendChild(draftDate);
            myIdeasList.appendChild(div);
        })
    })
}
