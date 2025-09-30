document.getElementById("date").textContent = new Date().toDateString();

document.getElementById("theme-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// Search
document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;
    const engine = document.getElementById("search-engine").value;
    const urls = {
        google: `https://www.google.com/search?q=${query}`,
        bing: `https://www.bing.com/search?q=${query}`,
        duckduckgo: `https://duckduckgo.com/?q=${query}`,
        yahoo: `https://search.yahoo.com/search?p=${query}`
    };
    window.open(urls[engine], '_blank');
});

// Weather functionality
navigator.geolocation.getCurrentPosition(
    (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const weather = data.current_weather;
                const fahrenheit = (weather.temperature * 9/5) + 32;
                const mph = (weather.windspeed * 1.609344).toFixed(1);
                document.getElementById("weather-info").textContent = 
                    `Temp: ${weather.temperature}°C (${fahrenheit.toFixed(1)}°F)\nWind: ${weather.windspeed} km/h (${mph} mph)`;
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                document.getElementById("weather-info").textContent = "Weather data unavailable";
            });
    },
    (error) => {
        console.error("Error getting location:", error.message);
        document.getElementById("weather-info").textContent = "Location access denied";
    }
);

// Bookmarks functionality
let bookmarks = [];

// Load bookmarks from localStorage
function loadBookmarks() {
    const savedBookmarks = localStorage.getItem('voidstart-bookmarks');
    if (savedBookmarks) {
        bookmarks = JSON.parse(savedBookmarks);
        displayBookmarks();
    }
}

// Save bookmarks to localStorage
function saveBookmarks() {
    localStorage.setItem('voidstart-bookmarks', JSON.stringify(bookmarks));
}

// Display bookmarks in the list
function displayBookmarks() {
    const bookmarkList = document.getElementById('bookmark-list');
    bookmarkList.innerHTML = '';
    
    bookmarks.forEach((bookmark, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'bookmark-item';
        listItem.innerHTML = `
            <a href="${bookmark.url}" target="_blank" class="bookmark-link">${bookmark.name}</a>
            <button onclick="deleteBookmark(${index})" class="bookmark-delete">Delete</button>
        `;
        bookmarkList.appendChild(listItem);
    });
}

// Add new bookmark
function addBookmark() {
    const nameInput = document.getElementById('bookmark-name');
    const urlInput = document.getElementById('bookmark-url');
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    
    if (name && url) {
        // Add https:// if no protocol is specified
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        bookmarks.push({ name, url });
        saveBookmarks();
        displayBookmarks();
        
        // Clear inputs
        nameInput.value = '';
        urlInput.value = '';
    }
}

// Delete bookmark
function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    saveBookmarks();
    displayBookmarks();
}

// Add event listeners for bookmarks
document.getElementById('add-bookmark').addEventListener('click', addBookmark);

// Allow Enter key to add bookmark
document.getElementById('bookmark-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBookmark();
});

document.getElementById('bookmark-url').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBookmark();
});

// Load bookmarks when page loads
loadBookmarks();
