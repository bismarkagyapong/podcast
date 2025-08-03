const RSS_FEED_URL = "https://feeds.buzzsprout.com/2295296.rss";

// Select DOM elements
const descriptionEl = document.getElementById("podcast-description");
const episodeListEl = document.getElementById("episode-list");
const playerTitleEl = document.getElementById("player-title");
const playerAudioEl = document.getElementById("player-audio");
const toggleButton = document.getElementById("theme-toggle");
const stickyPlayer = document.getElementById("audio-player");

// Load podcast data
async function loadPodcastData() {
    try {
        const response = await fetch(RSS_FEED_URL);
        const rssText = await response.text();

        const parser = new DOMParser();
        const rss = parser.parseFromString(rssText, "application/xml");

        // Podcast description
        const channel = rss.querySelector("channel");
        const description = channel.querySelector("description").textContent;
        descriptionEl.textContent = description;

        // Podcast episodes (Reversed order - latest first)
        const items = channel.querySelectorAll("item");
        const episodes = Array.from(items).map((item, index) => ({
            number: items.length - index,
            title: item.querySelector("title").textContent,
            description: item.querySelector("description").textContent,
            audioUrl: item.querySelector("enclosure").getAttribute("url"),
            coverArt: item.querySelector("itunes\\:image, image")?.getAttribute("href") || "",
        }));

        renderEpisodes(episodes);
    } catch (error) {
        console.error("Error loading podcast data:", error);
    }
}

// Render episodes
function renderEpisodes(episodes) {
    episodeListEl.innerHTML = "";
    episodes.forEach((episode) => {
        const episodeEl = document.createElement("div");
        episodeEl.className = "episode";
        episodeEl.innerHTML = `
            <img src="${episode.coverArt}" alt="Episode Cover Art">
            <h3>${episode.number}. ${episode.title}</h3>
            <p>${episode.description}</p>
            <button onclick="playEpisode('${episode.title}', '${episode.audioUrl}')">Play</button>
        `;
        episodeListEl.appendChild(episodeEl);
    });
}

// Play an episode
function playEpisode(title, audioUrl) {
    playerTitleEl.textContent = title;
    playerAudioEl.src = audioUrl;
    playerAudioEl.play();
    
    // Show the sticky player
    stickyPlayer.style.bottom = "0";
}

// Toggle dark mode
toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
});

// Hide sticky player when audio ends
playerAudioEl.addEventListener("ended", () => {
    stickyPlayer.style.bottom = "-100%";
});

// Load data on page load
document.addEventListener("DOMContentLoaded", loadPodcastData);
